package com.codeduo.interview.service;

import com.codeduo.ai.dto.InterviewEvaluation;
import com.codeduo.ai.dto.InterviewFinalReview;
import com.codeduo.ai.dto.InterviewQuestion;
import com.codeduo.ai.service.AiClient;
import com.codeduo.global.exception.BusinessException;
import com.codeduo.interview.dto.InterviewSessionResponse;
import com.codeduo.interview.entity.InterviewSession;
import com.codeduo.interview.entity.InterviewTurn;
import com.codeduo.interview.repository.InterviewSessionRepository;
import com.codeduo.interview.type.InterviewStatus;
import com.codeduo.submission.entity.Submission;
import com.codeduo.submission.repository.SubmissionRepository;
import com.codeduo.user.entity.User;
import com.codeduo.user.repository.UserRepository;
import com.codeduo.wronganswer.entity.WrongAnswer;
import com.codeduo.wronganswer.repository.WrongAnswerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class InterviewService {
    private static final int TOTAL_QUESTIONS = 3;
    private static final int MAX_WRONG_CONTEXT = 10;
    private static final int MAX_SUBMISSION_CONTEXT = 20;

    private final InterviewSessionRepository interviewSessionRepository;
    private final UserRepository userRepository;
    private final WrongAnswerRepository wrongAnswerRepository;
    private final SubmissionRepository submissionRepository;
    private final AiClient aiClient;

    public InterviewSessionResponse start(User user) {
        User managedUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));
        requirePremium(managedUser);

        StudyData studyData = studyData(managedUser.getId());
        if (studyData.wrongAnswers().isEmpty() && studyData.submissions().isEmpty()) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "AI 면접을 시작하려면 먼저 레슨 문제를 풀어주세요.");
        }

        InterviewQuestion question = aiClient.createInterviewQuestion(
                buildStudyContext(studyData),
                List.of(),
                1
        );
        InterviewSession session = InterviewSession.builder()
                .user(managedUser)
                .status(InterviewStatus.ACTIVE)
                .totalQuestions(TOTAL_QUESTIONS)
                .build();
        session.addTurn(toTurn(question, 1));
        return InterviewSessionResponse.from(interviewSessionRepository.save(session));
    }

    public InterviewSessionResponse answer(User user, Long sessionId, String rawAnswer) {
        InterviewSession session = findOwnedSession(user, sessionId);
        requirePremium(session.getUser());
        if (session.getStatus() != InterviewStatus.ACTIVE) {
            throw new BusinessException(HttpStatus.CONFLICT, "이미 완료된 AI 면접입니다.");
        }

        InterviewTurn activeTurn = session.getTurns().stream()
                .filter(turn -> !turn.isAnswered())
                .findFirst()
                .orElseThrow(() -> new BusinessException(HttpStatus.CONFLICT, "답변할 면접 질문이 없습니다."));
        String answer = rawAnswer == null ? "" : rawAnswer.strip();
        if (answer.isBlank()) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "면접 답변을 입력해주세요.");
        }

        InterviewEvaluation evaluation = aiClient.evaluateInterviewAnswer(
                new InterviewQuestion(
                        activeTurn.getLanguage(),
                        activeTurn.getTopic(),
                        activeTurn.getQuestion(),
                        activeTurn.getExpectedPoints()
                ),
                answer
        );
        applyEvaluation(activeTurn, answer, evaluation);
        session.setTotalScore(session.getTotalScore() + evaluation.score());

        int nextOrder = activeTurn.getQuestionOrder() + 1;
        if (nextOrder <= session.getTotalQuestions()) {
            StudyData studyData = studyData(user.getId());
            List<String> previousQuestions = session.getTurns().stream()
                    .map(InterviewTurn::getQuestion)
                    .toList();
            InterviewQuestion nextQuestion = aiClient.createInterviewQuestion(
                    buildStudyContext(studyData),
                    previousQuestions,
                    nextOrder
            );
            session.addTurn(toTurn(nextQuestion, nextOrder));
        } else {
            int averageScore = session.getTotalScore() / session.getTotalQuestions();
            InterviewFinalReview finalReview = aiClient.createInterviewFinalReview(
                    buildInterviewTranscript(session),
                    averageScore
            );
            session.setFinalVerdict(limit(finalReview.verdict(), 30));
            session.setOverallReview(limit(finalReview.overallReview(), 8000));
            session.setHiringRecommendation(limit(finalReview.hiringRecommendation(), 4000));
            session.setFocusAreasText(lines(finalReview.focusAreas()));
            session.setStatus(InterviewStatus.COMPLETED);
            session.setCompletedAt(LocalDateTime.now());
        }

        return InterviewSessionResponse.from(interviewSessionRepository.save(session));
    }

    @Transactional(readOnly = true)
    public InterviewSessionResponse get(User user, Long sessionId) {
        InterviewSession session = findOwnedSession(user, sessionId);
        requirePremium(session.getUser());
        return InterviewSessionResponse.from(session);
    }

    @Transactional(readOnly = true)
    public List<InterviewSessionResponse> history(User user) {
        requirePremium(user);
        return interviewSessionRepository.findTop10ByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(InterviewSessionResponse::from)
                .toList();
    }

    private InterviewSession findOwnedSession(User user, Long sessionId) {
        return interviewSessionRepository.findByIdAndUserId(sessionId, user.getId())
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "AI 면접 기록을 찾을 수 없습니다."));
    }

    private void requirePremium(User user) {
        if (user == null || !user.isPremium()) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "AI 면접은 프리미엄 전용 기능입니다.");
        }
    }

    private StudyData studyData(Long userId) {
        List<WrongAnswer> wrongAnswers = wrongAnswerRepository.findByUserIdOrderByUpdatedAtDesc(userId).stream()
                .limit(MAX_WRONG_CONTEXT)
                .toList();
        List<Submission> submissions = submissionRepository.findTop20ByUserIdOrderByCreatedAtDesc(userId).stream()
                .limit(MAX_SUBMISSION_CONTEXT)
                .toList();
        return new StudyData(wrongAnswers, submissions);
    }

    private String buildStudyContext(StudyData data) {
        StringBuilder context = new StringBuilder();
        context.append("[최근 오답]\n");
        if (data.wrongAnswers().isEmpty()) {
            context.append("- 없음\n");
        } else {
            data.wrongAnswers().forEach(wrong -> {
                context.append("- 언어=").append(wrong.getProblem().getLanguage())
                        .append(", 유형=").append(wrong.getProblem().getType())
                        .append(", 주제=").append(safe(wrong.getProblem().getTitle()))
                        .append(", 문제=").append(limit(wrong.getProblem().getDescription(), 500))
                        .append(", 최근 답변=").append(limit(wrong.getLastAnswer(), 500))
                        .append(", 실패 이유=").append(limit(wrong.getReasonSummary(), 300))
                        .append('\n');
            });
        }

        context.append("\n[최근 풀이]\n");
        if (data.submissions().isEmpty()) {
            context.append("- 없음\n");
        } else {
            data.submissions().forEach(submission -> {
                context.append("- 언어=").append(submission.getProblem().getLanguage())
                        .append(", 유형=").append(submission.getProblem().getType())
                        .append(", 주제=").append(safe(submission.getProblem().getTitle()))
                        .append(", 결과=").append(submission.isCorrect() ? "정답" : "오답")
                        .append(", 점수=").append(submission.getScore())
                        .append(", 제출 답변=").append(limit(submission.getSubmittedAnswer(), 500))
                        .append('\n');
            });
        }
        return limit(context.toString(), 14000);
    }

    private InterviewTurn toTurn(InterviewQuestion question, int order) {
        return InterviewTurn.builder()
                .questionOrder(order)
                .language(limit(question.language(), 20))
                .topic(limit(question.topic(), 200))
                .question(limit(question.question(), 5000))
                .expectedPoints(limit(question.expectedPoints(), 5000))
                .build();
    }

    private void applyEvaluation(InterviewTurn turn, String answer, InterviewEvaluation evaluation) {
        turn.setAnswer(limit(answer, 8000));
        turn.setScore(Math.max(0, Math.min(100, evaluation.score())));
        turn.setVerdict(limit(evaluation.verdict(), 30));
        turn.setFeedback(limit(evaluation.feedback(), 5000));
        turn.setStrengthsText(lines(evaluation.strengths()));
        turn.setImprovementsText(lines(evaluation.improvements()));
        turn.setModelAnswer(limit(evaluation.modelAnswer(), 8000));
        turn.setAnsweredAt(LocalDateTime.now());
    }

    private String lines(List<String> values) {
        if (values == null) return "";
        return limit(values.stream()
                .filter(value -> value != null && !value.isBlank())
                .limit(4)
                .map(String::strip)
                .reduce((left, right) -> left + "\n" + right)
                .orElse(""), 5000);
    }

    private String buildInterviewTranscript(InterviewSession session) {
        StringBuilder transcript = new StringBuilder();
        session.getTurns().stream()
                .filter(InterviewTurn::isAnswered)
                .forEach(turn -> transcript
                        .append("[질문 ").append(turn.getQuestionOrder()).append("]\n")
                        .append("언어/주제: ").append(turn.getLanguage()).append(" / ").append(turn.getTopic()).append('\n')
                        .append("질문: ").append(turn.getQuestion()).append('\n')
                        .append("지원자 답변: ").append(turn.getAnswer()).append('\n')
                        .append("점수/판정: ").append(turn.getScore()).append(" / ").append(turn.getVerdict()).append('\n')
                        .append("문항 피드백: ").append(turn.getFeedback()).append("\n\n"));
        return limit(transcript.toString(), 18000);
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private String limit(String value, int maxLength) {
        if (value == null) return "";
        if (value.length() <= maxLength) return value;
        return value.substring(0, maxLength) + "…";
    }

    private record StudyData(List<WrongAnswer> wrongAnswers, List<Submission> submissions) {
    }
}
