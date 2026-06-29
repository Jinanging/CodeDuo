package com.codeduo.progress.dto;

import com.codeduo.progress.entity.Progress;

import java.time.LocalDateTime;

public record ProgressResponse(
        Long id,
        Long courseId,
        Long lessonId,
        int completedProblemCount,
        int streakCount,
        LocalDateTime lastStudiedAt
) {
    public static ProgressResponse from(Progress p) {
        return new ProgressResponse(
                p.getId(),
                p.getCourse().getId(),
                p.getLesson().getId(),
                p.getCompletedProblemCount(),
                p.getStreakCount(),
                p.getLastStudiedAt()
        );
    }
}
