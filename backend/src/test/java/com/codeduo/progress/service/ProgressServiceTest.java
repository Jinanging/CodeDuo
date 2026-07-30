package com.codeduo.progress.service;

import com.codeduo.course.entity.Course;
import com.codeduo.lesson.entity.Lesson;
import com.codeduo.progress.entity.Progress;
import com.codeduo.progress.repository.ProgressRepository;
import com.codeduo.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProgressServiceTest {
    private static final ZoneId STUDY_ZONE = ZoneId.of("Asia/Seoul");

    @Mock
    private ProgressRepository progressRepository;

    private ProgressService service;
    private User user;
    private Lesson lesson;

    @BeforeEach
    void setUp() {
        service = new ProgressService(progressRepository);
        user = User.builder().id(1L).xp(0).streakCount(0).build();
        Course course = Course.builder().id(10L).build();
        lesson = Lesson.builder().id(20L).course(course).build();

        when(progressRepository.findByUserIdAndCourseIdAndLessonId(1L, 10L, 20L)).thenReturn(Optional.empty());
        when(progressRepository.save(any(Progress.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void startsStreakOnFirstStudyAttempt() {
        service.recordStudy(user, lesson, false);

        assertThat(user.getStreakCount()).isEqualTo(1);
        assertThat(user.getLastStudiedDate()).isEqualTo(LocalDate.now(STUDY_ZONE));
        assertThat(user.getXp()).isZero();
    }

    @Test
    void keepsStreakForRepeatedAttemptsOnSameDay() {
        user.setStreakCount(3);
        user.setLastStudiedDate(LocalDate.now(STUDY_ZONE));

        service.recordStudy(user, lesson, true);

        assertThat(user.getStreakCount()).isEqualTo(3);
        assertThat(user.getXp()).isEqualTo(10);
    }

    @Test
    void incrementsStreakWhenPreviousStudyWasYesterday() {
        user.setStreakCount(2);
        user.setLastStudiedDate(LocalDate.now(STUDY_ZONE).minusDays(1));

        service.recordStudy(user, lesson, true);

        assertThat(user.getStreakCount()).isEqualTo(3);
        assertThat(user.getLastStudiedDate()).isEqualTo(LocalDate.now(STUDY_ZONE));
    }

    @Test
    void resetsStreakWhenPreviousStudyWasBeforeYesterday() {
        user.setStreakCount(8);
        user.setLastStudiedDate(LocalDate.now(STUDY_ZONE).minusDays(3));

        service.recordStudy(user, lesson, false);

        assertThat(user.getStreakCount()).isEqualTo(1);
        assertThat(user.getLastStudiedDate()).isEqualTo(LocalDate.now(STUDY_ZONE));
    }
}
