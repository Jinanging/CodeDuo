package com.codeduo.interview.service;

import com.codeduo.ai.dto.InterviewEvaluation;
import com.codeduo.ai.dto.InterviewQuestion;
import com.codeduo.ai.service.AiClient;
import com.codeduo.interview.dto.InterviewSessionResponse;
import com.codeduo.interview.entity.InterviewSession;
import com.codeduo.interview.entity.InterviewTurn;
import com.codeduo.interview.repository.InterviewSessionRepository;
import com.codeduo.interview.type.InterviewStatus;
import com.codeduo.lesson.entity.Lesson;
import com.codeduo.problem.entity.Problem;
import com.codeduo.problem.type.Language;
import com.codeduo.problem.type.ProblemType;
import com.codeduo.submission.entity.Submission;
import com.codeduo.submission.repository.SubmissionRepository;
import com.codeduo.user.entity.User;
import com.codeduo.user.repository.UserRepository;
import com.codeduo.wronganswer.entity.WrongAnswer;
import com.codeduo.wronganswer.repository.WrongAnswerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InterviewServiceTest {
    @Mock private InterviewSessionRepository interviewSessionRepository;
    @Mock private UserRepository userRepository;
    @Mock private WrongAnswerRepository wrongAnswerRepository;
    @Mock private SubmissionRepository submissionRepository;
    @Mock private AiClient aiClient;

    private InterviewService service;
    private User user;
    private Problem problem;

    @BeforeEach
    void setUp() {
        service = new InterviewService(
                interviewSessionRepository,
                userRepository,
                wrongAnswerRepository,
                submissionRepository,
                aiClient
        );
        user = User.builder()
                .id(1L)
                .email("premium@codeduo.dev")
                .nickname("지원자")
                .premium(true)
                .build();
        problem = Problem.builder()
                .id(3L)
                .lesson(Lesson.builder().id(1L).build())
                .language(Language.PYTHON)
                .type(ProblemType.CODE)
                .title("합 구하기")
                .description("두 수를 더하세요.")
                .build();
    }

    @Test
    void startsInterviewFromWrongAnswersAndRecentSubmissions() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(wrongAnswerRepository.findByUserIdOrderByUpdatedAtDesc(1L)).thenReturn(List.of(
                WrongAnswer.builder()
                        .user(user)
                        .problem(problem)
                        .lastAnswer("print(a - b)")
                        .reasonSummary("출력이 다릅니다.")
                        .build()
        ));
        when(submissionRepository.findTop20ByUserIdOrderByCreatedAtDesc(1L)).thenReturn(List.of(
                Submission.builder().user(user).problem(problem).submittedAnswer("print(a - b)").score(0).build()
        ));
        when(aiClient.createInterviewQuestion(contains("합 구하기"), eq(List.of()), eq(1)))
                .thenReturn(new InterviewQuestion("PYTHON", "연산과 검증", "두 수의 합을 검증하는 방법은?", "입력, 연산, 경계값"));
        when(interviewSessionRepository.save(any(InterviewSession.class))).thenAnswer(invocation -> {
            InterviewSession saved = invocation.getArgument(0);
            saved.setId(10L);
            saved.getTurns().get(0).setId(20L);
            return saved;
        });

        InterviewSessionResponse response = service.start(user);

        assertThat(response.id()).isEqualTo(10L);
        assertThat(response.status()).isEqualTo("ACTIVE");
        assertThat(response.currentQuestion().question()).contains("검증");
        assertThat(response.completedQuestions()).isZero();
    }

    @Test
    void gradesAnswerAndCreatesNextQuestion() {
        InterviewSession session = InterviewSession.builder()
                .id(10L)
                .user(user)
                .status(InterviewStatus.ACTIVE)
                .totalQuestions(3)
                .turns(new ArrayList<>())
                .build();
        session.addTurn(InterviewTurn.builder()
                .id(20L)
                .questionOrder(1)
                .language("PYTHON")
                .topic("반복문")
                .question("range의 동작을 설명해보세요.")
                .expectedPoints("시작, 종료, 간격")
                .build());

        when(interviewSessionRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(session));
        when(wrongAnswerRepository.findByUserIdOrderByUpdatedAtDesc(1L)).thenReturn(List.of());
        when(submissionRepository.findTop20ByUserIdOrderByCreatedAtDesc(1L)).thenReturn(List.of(
                Submission.builder().user(user).problem(problem).submittedAnswer("print(1)").correct(true).score(100).build()
        ));
        when(aiClient.evaluateInterviewAnswer(any(InterviewQuestion.class), contains("종료값")))
                .thenReturn(new InterviewEvaluation(
                        84,
                        "PASS",
                        "핵심을 정확히 설명했습니다.",
                        List.of("종료값 제외를 설명했습니다."),
                        List.of("간격 예시를 추가하세요."),
                        "range는 시작값부터 종료값 직전까지 값을 만듭니다."
                ));
        when(aiClient.createInterviewQuestion(anyString(), anyList(), eq(2)))
                .thenReturn(new InterviewQuestion("PYTHON", "반복문", "반복문의 경계 오류를 어떻게 찾나요?", "경계값 테스트"));
        when(interviewSessionRepository.save(any(InterviewSession.class))).thenAnswer(invocation -> invocation.getArgument(0));

        InterviewSessionResponse response = service.answer(user, 10L, "range는 종료값을 포함하지 않습니다.");

        assertThat(response.completedQuestions()).isEqualTo(1);
        assertThat(response.averageScore()).isEqualTo(84);
        assertThat(response.turns().get(0).strengths()).containsExactly("종료값 제외를 설명했습니다.");
        assertThat(response.currentQuestion().order()).isEqualTo(2);
    }
}
