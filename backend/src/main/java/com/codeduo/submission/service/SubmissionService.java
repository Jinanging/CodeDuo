package com.codeduo.submission.service;

import com.codeduo.ai.dto.EssayGradeResult;
import com.codeduo.ai.service.AiClient;
import com.codeduo.global.exception.BusinessException;
import com.codeduo.judge.dto.JudgeRequest;
import com.codeduo.judge.dto.JudgeResponse;
import com.codeduo.judge.dto.JudgeTestCase;
import com.codeduo.judge.dto.JudgeTestResult;
import com.codeduo.judge.service.Judge0Client;
import com.codeduo.problem.entity.Problem;
import com.codeduo.problem.repository.ProblemRepository;
import com.codeduo.problem.type.Language;
import com.codeduo.problem.type.ProblemType;
import com.codeduo.progress.service.ProgressService;
import com.codeduo.submission.dto.SubmissionRequest;
import com.codeduo.submission.dto.SubmissionResponse;
import com.codeduo.submission.dto.AiHintResponse;
import com.codeduo.submission.entity.Submission;
import com.codeduo.submission.repository.SubmissionRepository;
import com.codeduo.user.entity.User;
import com.codeduo.user.repository.UserRepository;
import com.codeduo.wronganswer.entity.WrongAnswer;
import com.codeduo.wronganswer.repository.WrongAnswerRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SubmissionService {
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final WrongAnswerRepository wrongAnswerRepository;
    private final ProgressService progressService;
    private final Judge0Client judge0Client;
    private final AiClient aiClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SubmissionResponse submit(User user, SubmissionRequest request) {
        User managedUser = userRepository.getReferenceById(user.getId());
        Problem problem = problemRepository.findById(request.problemId())
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "문제를 찾을 수 없습니다."));
        Grade grade = grade(problem, request.answer());

        String aiReview = null;
        if (grade.correct && (problem.getType() == ProblemType.CODE || problem.getType() == ProblemType.FILL_BLANK)) {
            aiReview = managedUser.isPremium() ? aiClient.reviewCode(request.answer()) : "프리미엄에서 AI 코드 리뷰를 확인할 수 있습니다.";
        }

        Submission saved = submissionRepository.save(Submission.builder()
                .user(managedUser)
                .problem(problem)
                .submittedAnswer(request.answer())
                .correct(grade.correct)
                .score(grade.score)
                .runtimeMs(grade.runtimeMs)
                .memoryKb(grade.memoryKb)
                .aiReview(aiReview)
                .resultMessage(grade.message)
                .testResultsJson(grade.testResultsJson)
                .build());

        if (grade.correct) {
            progressService.markCorrect(managedUser, problem.getLesson());
        } else {
            WrongAnswer wrongAnswer = wrongAnswerRepository.findByUserIdAndProblemId(managedUser.getId(), problem.getId())
                    .orElseGet(() -> WrongAnswer.builder().user(managedUser).problem(problem).build());
            wrongAnswer.setLastAnswer(request.answer());
            wrongAnswer.setReasonSummary(grade.message);
            wrongAnswerRepository.save(wrongAnswer);
        }

        return SubmissionResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<SubmissionResponse> mySubmissions(User user) {
        return submissionRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream().map(SubmissionResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<SubmissionResponse> myProblemSubmissions(User user, Long problemId) {
        return submissionRepository.findByUserIdAndProblemIdOrderByCreatedAtDesc(user.getId(), problemId).stream().map(SubmissionResponse::from).toList();
    }

    public AiHintResponse createAiHint(User user, Long submissionId) {
        User managedUser = userRepository.getReferenceById(user.getId());
        if (!managedUser.isPremium()) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "AI 힌트는 프리미엄 전용 기능입니다.");
        }

        Submission submission = submissionRepository.findByIdAndUserId(submissionId, managedUser.getId())
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "제출 기록을 찾을 수 없습니다."));
        Problem problem = submission.getProblem();

        if (problem.getType() != ProblemType.CODE) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "코드 문제 제출에서만 AI 힌트를 사용할 수 있습니다.");
        }
        if (submission.isCorrect()) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "이미 정답 처리된 제출입니다.");
        }
        if (submission.getTestResultsJson() == null || submission.getTestResultsJson().isBlank()) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "AI 힌트에 사용할 채점 결과가 없습니다.");
        }
        if (submission.getAiReview() != null && !submission.getAiReview().isBlank()) {
            return new AiHintResponse(submission.getAiReview());
        }

        String hint = aiClient.hintCode(problem, submission);
        submission.setAiReview(hint);
        return new AiHintResponse(hint);
    }

    private Grade grade(Problem problem, String answer) {
        return switch (problem.getType()) {
            case MULTIPLE_CHOICE -> simple(problem, answer);
            case SHORT_ANSWER -> simple(problem, answer);
            case FILL_BLANK -> simple(problem, answer);
            case CODE -> judge(problem, answer);
            case ESSAY -> essay(problem, answer);
        };
    }

    private Grade simple(Problem problem, String answer) {
        requireConfigured(problem.getAnswer());
        boolean correct = normalize(problem.getAnswer()).equals(normalize(answer));
        String wrongMessage = problem.getType() == ProblemType.SHORT_ANSWER
                ? "정답과 일치하지 않습니다."
                : "다시 선택해보세요.";
        return new Grade(correct, correct ? 100 : 0, correct ? "정답입니다!" : wrongMessage, null, null, null);
    }

    private Grade judge(Problem problem, String sourceCode) {
        List<JudgeTestCase> testCases = loadTestCases(problem);
        if (testCases.isEmpty()) {
            return new Grade(false, 0, "이 문제에 실행할 테스트케이스가 없습니다.", null, null, "[]");
        }

        List<JudgeTestResult> results = new ArrayList<>();
        long totalRuntimeMs = 0L;
        boolean hasRuntime = false;
        Long maxMemoryKb = null;

        for (int index = 0; index < testCases.size(); index++) {
            JudgeTestCase testCase = testCases.get(index);
            JudgeResponse response = judge0Client.execute(
                    new JudgeRequest(sourceCode, languageId(problem.getLanguage()), testCase.input())
            );
            boolean pass = response.accepted(testCase.expected());
            // 응답에는 통과 여부와 오류 유형만 담고 숨김 입력·기대 출력·실제 출력은 노출하지 않습니다.
            results.add(new JudgeTestResult(
                    index + 1,
                    pass,
                    valueOrEmpty(response.status()),
                    limit(response.errorDetail(), 2000),
                    response.time(),
                    response.memory()
            ));

            if (response.time() != null) {
                totalRuntimeMs += response.time();
                hasRuntime = true;
            }
            if (response.memory() != null) {
                maxMemoryKb = maxMemoryKb == null ? response.memory() : Math.max(maxMemoryKb, response.memory());
            }
        }

        int passedCount = (int) results.stream().filter(JudgeTestResult::pass).count();
        boolean correct = passedCount == results.size();
        int score = passedCount * 100 / results.size();
        String message = correct ? "모든 테스트케이스를 통과했습니다!" : failureMessage(results);
        return new Grade(
                correct,
                score,
                message,
                hasRuntime ? totalRuntimeMs : null,
                maxMemoryKb,
                toJson(results)
        );
    }

    private Grade essay(Problem problem, String answer) {
        requireConfigured(problem.getRubric());
        EssayGradeResult result = aiClient.gradeEssay(problem.getRubric(), answer);
        return new Grade(result.correct(), result.score(), result.feedback(), null, null, null);
    }

    private String normalize(String value) {
        return value == null ? "" : value.strip();
    }

    private List<JudgeTestCase> loadTestCases(Problem problem) {
        if (problem.getTestCasesJson() != null && !problem.getTestCasesJson().isBlank()) {
            try {
                List<JudgeTestCase> parsed = objectMapper.readValue(
                        problem.getTestCasesJson(),
                        new TypeReference<List<JudgeTestCase>>() {}
                );
                return parsed.stream()
                        .filter(testCase -> testCase != null && testCase.expected() != null)
                        .toList();
            } catch (JsonProcessingException e) {
                throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "문제 테스트케이스 설정이 올바르지 않습니다.");
            }
        }
        return List.of();
    }

    private void requireConfigured(String value) {
        if (value == null || value.isBlank()) {
            throw new BusinessException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "문제 채점 설정이 준비되지 않았습니다. 관리자에게 문의해주세요."
            );
        }
    }

    private String failureMessage(List<JudgeTestResult> results) {
        String status = results.stream()
                .filter(result -> !result.pass())
                .map(JudgeTestResult::status)
                .findFirst()
                .orElse("")
                .toLowerCase();

        if (status.contains("compilation")) return "컴파일 오류가 발생했습니다.";
        if (status.contains("time limit")) return "실행 시간이 제한을 초과했습니다.";
        if (status.contains("memory limit")) return "메모리 제한을 초과했습니다.";
        if (status.contains("runtime")) return "코드 실행 중 런타임 오류가 발생했습니다.";
        if (status.contains("mock unsupported")) return "로컬 Mock이 지원하지 않는 코드입니다. 실제 Judge0 연결이 필요합니다.";
        if (status.contains("judge0 error") || status.contains("internal error")) return "코드 실행 서버에 연결하지 못했습니다.";
        if (status.contains("accepted")) return "실행 결과가 기대 출력과 다릅니다.";
        return "코드 실행에 실패했습니다.";
    }

    private String toJson(List<JudgeTestResult> results) {
        try {
            return objectMapper.writeValueAsString(results);
        } catch (JsonProcessingException e) {
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "채점 결과를 저장하지 못했습니다.");
        }
    }

    private String valueOrEmpty(String value) {
        return value == null ? "" : value;
    }

    private String limit(String value, int maxLength) {
        if (value == null || value.length() <= maxLength) return value;
        return value.substring(0, maxLength) + "…";
    }

    private int languageId(Language language) {
        return switch (language) {
            case PYTHON -> 71; // Python 3
            case JAVA -> 62;   // OpenJDK
            case C -> 50;      // C (GCC)
            case CPP -> 54;    // C++ (GCC)
        };
    }

    private record Grade(boolean correct, int score, String message, Long runtimeMs, Long memoryKb, String testResultsJson) {
    }
}
