package com.codeduo.progress.controller;

import com.codeduo.global.response.ApiResponse;
import com.codeduo.global.security.CurrentUser;
import com.codeduo.progress.dto.ProgressResponse;
import com.codeduo.progress.service.ProgressService;
import com.codeduo.user.entity.User;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Progress")
@RestController
@RequiredArgsConstructor
public class ProgressController {
    private final ProgressService progressService;

    @GetMapping("/api/progress")
    public ApiResponse<List<ProgressResponse>> myProgress(@CurrentUser User user) {
        return ApiResponse.ok("진도를 조회했습니다.", progressService.getMyProgress(user));
    }

    @GetMapping("/api/courses/{courseId}/progress")
    public ApiResponse<List<ProgressResponse>> courseProgress(@CurrentUser User user, @PathVariable Long courseId) {
        return ApiResponse.ok("코스 진도를 조회했습니다.", progressService.getCourseProgress(user, courseId));
    }
}
