package com.codeduo.lesson.controller;

import com.codeduo.global.response.ApiResponse;
import com.codeduo.lesson.dto.LessonResponse;
import com.codeduo.lesson.service.LessonService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Lesson")
@RestController
@RequiredArgsConstructor
public class LessonController {
    private final LessonService lessonService;

    @GetMapping("/api/courses/{courseId}/lessons")
    public ApiResponse<List<LessonResponse>> lessons(@PathVariable Long courseId) {
        return ApiResponse.ok("레슨 목록을 조회했습니다.", lessonService.getLessons(courseId));
    }

    @GetMapping("/api/lessons/{lessonId}")
    public ApiResponse<LessonResponse> lesson(@PathVariable Long lessonId) {
        return ApiResponse.ok("레슨을 조회했습니다.", lessonService.getLesson(lessonId));
    }
}
