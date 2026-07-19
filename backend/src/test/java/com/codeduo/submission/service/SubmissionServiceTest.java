package com.codeduo.submission.service;

import com.codeduo.ai.service.AiClient;
import com.codeduo.judge.dto.JudgeResponse;
import com.codeduo.judge.service.Judge0Client;
import com.codeduo.lesson.entity.Lesson;
import com.codeduo.problem.entity.Problem;
import com.codeduo.problem.repository.ProblemRepository;
import com.codeduo.problem.type.Language;
import com.codeduo.problem.type.ProblemType;
import com.codeduo.progress.service.ProgressService;
import com.codeduo.submission.dto.SubmissionRequest;
import com.codeduo.submission.dto.SubmissionResponse;
import com.codeduo.submission.entity.Submission;
import com.codeduo.submission.repository.SubmissionRepository;
import com.codeduo.user.entity.User;
import com.codeduo.user.repository.UserRepository;
import com.codeduo.wronganswer.repository.WrongAnswerRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubmissionServiceTest {
    @Mock private ProblemRepository problemRepository;
    @Mock private UserRepository userRepository;
    @Mock private SubmissionRepository submissionRepository;
    @Mock private WrongAnswerRepository wrongAnswerRepository;
    @Mock private ProgressService progressService;
    @Mock private Judge0Client judge0Client;
    @Mock private AiClient aiClient;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private SubmissionService service;
    private User user;
    private Problem problem;

    @BeforeEach
    void setUp() {
        service = new SubmissionService(
                problemRepository,
                userRepository,
                submissionRepository,
                wrongAnswerRepository,
                progressService,
                judge0Client,
                aiClient
        );
        user = User.builder().id(1L).email("learner@codeduo.dev").premium(false).build();
        problem = Problem.builder()
                .id(3L)
                .lesson(Lesson.builder().id(1L).build())
                .type(ProblemType.CODE)
                .language(Language.PYTHON)
                .explanation("제출 후 공개되는 학습 해설")
                .testInput("2 3")
                .expectedOutput("5")
                .testCasesJson("""
                        [{"input":"2 3","expected":"5"},
                         {"input":"10 20","expected":"30"},
                         {"input":"-1 1","expected":"0"}]
                        """)
                .build();

        when(userRepository.getReferenceById(1L)).thenReturn(user);
        when(problemRepository.findById(3L)).thenReturn(Optional.of(problem));
        when(submissionRepository.save(any(Submission.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void executesAndStoresEveryTestCase() throws Exception {
        when(judge0Client.execute(any()))
                .thenReturn(accepted("5", 11L, 1000L))
                .thenReturn(accepted("30", 12L, 1200L))
                .thenReturn(accepted("0", 13L, 1100L));

        SubmissionResponse response = service.submit(user, new SubmissionRequest(3L, "print(a + b)"));

        assertThat(response.correct()).isTrue();
        assertThat(response.score()).isEqualTo(100);
        assertThat(response.runtimeMs()).isEqualTo(36L);
        assertThat(response.memoryKb()).isEqualTo(1200L);
        assertThat(response.explanation()).isEqualTo("제출 후 공개되는 학습 해설");
        List<Map<String, Object>> results = objectMapper.readValue(response.testResultsJson(), new TypeReference<>() {});
        assertThat(results).hasSize(3);
        assertThat(results).allSatisfy(result -> {
            assertThat(result.get("pass")).isEqualTo(true);
            assertThat(result).containsKeys("caseNumber", "status");
            assertThat(result).doesNotContainKeys("input", "expected", "actual");
        });
        verify(judge0Client, times(3)).execute(any());
        verify(progressService).markCorrect(user, problem.getLesson());
    }

    @Test
    void reportsPartialPassAsWrongAnswer() throws Exception {
        when(judge0Client.execute(any()))
                .thenReturn(accepted("5", 10L, 1000L))
                .thenReturn(accepted("999", 10L, 1000L))
                .thenReturn(accepted("0", 10L, 1000L));
        when(wrongAnswerRepository.findByUserIdAndProblemId(1L, 3L)).thenReturn(Optional.empty());

        SubmissionResponse response = service.submit(user, new SubmissionRequest(3L, "print(a + b)"));

        assertThat(response.correct()).isFalse();
        assertThat(response.score()).isEqualTo(66);
        assertThat(response.resultMessage()).isEqualTo("실행 결과가 기대 출력과 다릅니다.");
        assertThat(response.explanation()).isEqualTo("제출 후 공개되는 학습 해설");
        List<Map<String, Object>> results = objectMapper.readValue(response.testResultsJson(), new TypeReference<>() {});
        assertThat(results).extracting(result -> result.get("pass")).containsExactly(true, false, true);
        assertThat(results).allSatisfy(result -> assertThat(result).doesNotContainKeys("input", "expected", "actual"));
        verify(wrongAnswerRepository).save(any());
        verify(progressService, never()).markCorrect(any(), any());
    }

    @Test
    void distinguishesCompilationErrors() {
        when(judge0Client.execute(any())).thenReturn(new JudgeResponse(
                "", "", "Main.java: error: ';' expected", "Compilation Error", null, null
        ));
        when(wrongAnswerRepository.findByUserIdAndProblemId(1L, 3L)).thenReturn(Optional.empty());

        SubmissionResponse response = service.submit(user, new SubmissionRequest(3L, "broken code"));

        assertThat(response.correct()).isFalse();
        assertThat(response.score()).isZero();
        assertThat(response.resultMessage()).isEqualTo("컴파일 오류가 발생했습니다.");
        assertThat(response.testResultsJson()).contains("Main.java: error").contains("Compilation Error");
    }

    private JudgeResponse accepted(String stdout, Long time, Long memory) {
        return new JudgeResponse(stdout, "", "", "Accepted", time, memory);
    }
}
