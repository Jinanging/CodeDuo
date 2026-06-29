package com.codeduo.progress.service;

import com.codeduo.lesson.entity.Lesson;
import com.codeduo.progress.dto.ProgressResponse;
import com.codeduo.progress.entity.Progress;
import com.codeduo.progress.repository.ProgressRepository;
import com.codeduo.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProgressService {
    private final ProgressRepository progressRepository;

    public void markCorrect(User user, Lesson lesson) {
        Progress progress = progressRepository.findByUserIdAndCourseIdAndLessonId(user.getId(), lesson.getCourse().getId(), lesson.getId())
                .orElseGet(() -> Progress.builder()
                        .user(user)
                        .course(lesson.getCourse())
                        .lesson(lesson)
                        .completedProblemCount(0)
                        .streakCount(user.getStreakCount())
                        .build());
        progress.setCompletedProblemCount(progress.getCompletedProblemCount() + 1);
        progress.setStreakCount(Math.max(progress.getStreakCount(), user.getStreakCount()));
        progress.setLastStudiedAt(LocalDateTime.now());
        user.setXp(user.getXp() + 10);
        user.setStreakCount(Math.max(1, user.getStreakCount()));
        progressRepository.save(progress);
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
