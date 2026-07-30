package com.codeduo.progress.service;

import com.codeduo.lesson.entity.Lesson;
import com.codeduo.progress.dto.ProgressResponse;
import com.codeduo.progress.entity.Progress;
import com.codeduo.progress.repository.ProgressRepository;
import com.codeduo.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProgressService {
    private static final ZoneId STUDY_ZONE = ZoneId.of("Asia/Seoul");

    private final ProgressRepository progressRepository;

    public void markCorrect(User user, Lesson lesson) {
        recordStudy(user, lesson, true);
    }

    public void recordStudy(User user, Lesson lesson, boolean correct) {
        updateUserStreak(user);

        Progress progress = progressRepository.findByUserIdAndCourseIdAndLessonId(user.getId(), lesson.getCourse().getId(), lesson.getId())
                .orElseGet(() -> Progress.builder()
                        .user(user)
                        .course(lesson.getCourse())
                        .lesson(lesson)
                        .completedProblemCount(0)
                        .streakCount(user.getStreakCount())
                        .build());
        if (correct) {
            progress.setCompletedProblemCount(progress.getCompletedProblemCount() + 1);
            user.setXp(user.getXp() + 10);
        }
        progress.setStreakCount(Math.max(progress.getStreakCount(), user.getStreakCount()));
        progress.setLastStudiedAt(LocalDateTime.now());
        progressRepository.save(progress);
    }

    private void updateUserStreak(User user) {
        LocalDate today = LocalDate.now(STUDY_ZONE);
        LocalDate lastStudiedDate = user.getLastStudiedDate();
        if (today.equals(lastStudiedDate)) return;

        if (today.minusDays(1).equals(lastStudiedDate)) {
            user.setStreakCount(user.getStreakCount() + 1);
        } else {
            user.setStreakCount(1);
        }
        user.setLastStudiedDate(today);
    }

    @Transactional(readOnly = true)
    public List<ProgressResponse> getMyProgress(User user) {
        return progressRepository.findByUserId(user.getId()).stream().map(ProgressResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<ProgressResponse> getCourseProgress(User user, Long courseId) {
        return progressRepository.findByUserIdAndCourseId(user.getId(), courseId).stream().map(ProgressResponse::from).toList();
    }
}
