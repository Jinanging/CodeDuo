package com.codeduo.admin.dto;

import com.codeduo.lesson.entity.Lesson;

public record AdminLessonResponse(
        Long id,
        Long courseId,
        String courseTitle,
        String language,
        String title,
        String description,
        int orderIndex
) {
    public static AdminLessonResponse from(Lesson lesson) {
        return new AdminLessonResponse(
                lesson.getId(),
                lesson.getCourse().getId(),
                lesson.getCourse().getTitle(),
                lesson.getCourse().getLanguage().name(),
                lesson.getTitle(),
                lesson.getDescription(),
                lesson.getOrderIndex()
        );
    }
}
