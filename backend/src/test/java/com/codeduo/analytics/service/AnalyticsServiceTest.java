package com.codeduo.analytics.service;

import com.codeduo.ai.service.AiClient;
import com.codeduo.analytics.dto.AnalyticsDtos.AnalyticsResponse;
import com.codeduo.problem.entity.Problem;
import com.codeduo.problem.type.Language;
import com.codeduo.problem.type.ProblemType;
import com.codeduo.submission.entity.Submission;
import com.codeduo.submission.repository.SubmissionRepository;
import com.codeduo.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {
    @Mock private SubmissionRepository submissionRepository;
    @Mock private AiClient aiClient;

    private AnalyticsService service;
    private User user;

    @BeforeEach
    void setUp() {
        service = new AnalyticsService(submissionRepository, aiClient);
        user = User.builder().id(1L).streakCount(4).build();
    }

    @Test
    void solvedCountsUseFirstCorrectSubmissionPerProblem() {
        LocalDateTime monday = LocalDate.now()
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .atTime(12, 0);
        LocalDateTime beforeThisWeek = monday.minusDays(2);
        Problem repeatedProblem = problem(10L);
        Problem wrongOnlyProblem = problem(20L);
        Problem olderSolvedProblem = problem(30L);

        when(submissionRepository.findByUserIdOrderByCreatedAtDesc(1L)).thenReturn(List.of(
                submission(repeatedProblem, true, monday.plusDays(1)),
                submission(repeatedProblem, true, monday),
                submission(wrongOnlyProblem, false, monday.plusDays(2)),
                submission(olderSolvedProblem, true, beforeThisWeek)
        ));

        AnalyticsResponse response = service.getAnalytics(user);

        assertThat(response.summary().totalSolved()).isEqualTo(2);
        assertThat(response.summary().weeklySolved()).isEqualTo(1);
        assertThat(response.activity()).extracting(activity -> activity.solved()).containsExactly(1, 0, 0, 0, 0, 0, 0);
        assertThat(response.summary().accuracy()).isEqualTo(75);
    }

    private Problem problem(long id) {
        return Problem.builder()
                .id(id)
                .type(ProblemType.CODE)
                .language(Language.PYTHON)
                .build();
    }

    private Submission submission(Problem problem, boolean correct, LocalDateTime createdAt) {
        return Submission.builder()
                .problem(problem)
                .correct(correct)
                .score(correct ? 100 : 0)
                .createdAt(createdAt)
                .build();
    }
}
