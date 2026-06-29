package com.codeduo.course.controller;

import com.codeduo.course.dto.CourseResponse;
import com.codeduo.course.service.CourseService;
import com.codeduo.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Course")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/courses")
public class CourseController {
    private final CourseService courseService;

    @GetMapping
    public ApiResponse<List<CourseResponse>> courses() {
        return ApiResponse.ok("코스 목록을 조회했습니다.", courseService.getCourses());
    }

    @GetMapping("/{courseId}")
    public ApiResponse<CourseResponse> course(@PathVariable Long courseId) {
        return ApiResponse.ok("코스를 조회했습니다.", courseService.getCourse(courseId));
    }
}
