package com.codeduo.course.dto;

import com.codeduo.course.entity.Course;

public record CourseResponse(Long id, String title, String language, String description, String level) {
    public static CourseResponse from(Course c) {
        return new CourseResponse(c.getId(), c.getTitle(), c.getLanguage().name().toLowerCase(), c.getDescription(), c.getLevel());
    }
}
