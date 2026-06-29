package com.codeduo.lesson.dto;

import com.codeduo.lesson.entity.Lesson;

public record LessonResponse(Long id, Long courseId, String title, String description, int orderIndex) {
    public static LessonResponse from(Lesson l) {
        return new LessonResponse(l.getId(), l.getCourse().getId(), l.getTitle(), l.getDescription(), l.getOrderIndex());
    }
}
