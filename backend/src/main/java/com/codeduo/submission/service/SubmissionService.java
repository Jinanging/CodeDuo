package com.codeduo.submission.service;

import com.codeduo.ai.dto.EssayGradeResult;
import com.codeduo.ai.service.AiClient;
import com.codeduo.global.exception.BusinessException;
import com.codeduo.judge.dto.JudgeRequest;
import com.codeduo.judge.dto.JudgeResponse;
import com.codeduo.judge.service.Judge0Client;
import com.codeduo.problem.entity.Problem;
import com.codeduo.problem.repository.ProblemRepository;
import com.codeduo.problem.type.ProblemType;
import com.codeduo.progress.service.ProgressService;
import com.codeduo.submission.dto.SubmissionRequest;
import com.codeduo.submission.dto.SubmissionResponse;
import com.codeduo.submission.entity.Submission;
import com.codeduo.submission.repository.SubmissionRepository;
import com.codeduo.user.entity.User;
import com.codeduo.user.repository.UserRepository;
import com.codeduo.wronganswer.entity.WrongAnswer;
import com.codeduo.wronganswer.repository.WrongAnswerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Value("${judge0.python-language-id:71}")
    private Integer pythonLanguageId;

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

    private Grade grade(Problem problem, String answer) {
        return switch (problem.getType()) {
            case MULTIPLE_CHOICE -> simple(problem, answer);
            case SHORT_ANSWER -> new Grade(normalize(problem.getAnswer()).equals(normalize(answer)), normalize(problem.getAnswer()).equals(normalize(answer)) ? 100 : 0,
                    normalize(problem.getAnswer()).equals(normalize(answer)) ? "정답입니다!" : "정답과 일치하지 않습니다.", null, null, null);
            case FILL_BLANK -> judge(problem, problem.getCodeTemplate().replace("{{BLANK}}", answer));
            case CODE -> judge(problem, answer);
            case ESSAY -> essay(problem, answer);
        };
    }

    private Grade simple(Problem problem, String answer) {
        boolean correct = normalize(problem.getAnswer()).equals(normalize(answer));
        return new Grade(correct, correct ? 100 : 0, correct ? "정답입니다!" : "다시 선택해보세요.", null, null, null);
    }

    private Grade judge(Problem problem, String sourceCode) {
        JudgeResponse response = judge0Client.execute(new JudgeRequest(sourceCode, pythonLanguageId, problem.getTestInput()), problem.getExpectedOutput());
        boolean correct = response.accepted(problem.getExpectedOutput());
        String testResults = "[{\"input\":\"%s\",\"expected\":\"%s\",\"actual\":\"%s\",\"pass\":%s}]"
                .formatted(escape(problem.getTestInput()), escape(problem.getExpectedOutput()), escape(response.stdout()), correct);
        return new Grade(correct, correct ? 100 : 0, correct ? "정답입니다!" : "실행 결과가 기대값과 다릅니다.", response.time(), response.memory(), testResults);
    }

    private Grade essay(Problem problem, String answer) {
        EssayGradeResult result = aiClient.gradeEssay(problem.getRubric(), answer);
        return new Grade(result.correct(), result.score(), result.feedback(), null, null, null);
    }

    private String normalize(String value) {
        return value == null ? "" : value.strip();
    }

    private String escape(String value) {
        return value == null ? "" : value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private record Grade(boolean correct, int score, String message, Long runtimeMs, Long memoryKb, String testResultsJson) {
    }
}
