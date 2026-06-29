package com.codeduo.submission.controller;

import com.codeduo.global.response.ApiResponse;
import com.codeduo.global.security.CurrentUser;
import com.codeduo.submission.dto.SubmissionRequest;
import com.codeduo.submission.dto.SubmissionResponse;
import com.codeduo.submission.service.SubmissionService;
import com.codeduo.user.entity.User;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Submission")
@RestController
@RequiredArgsConstructor
public class SubmissionController {
    private final SubmissionService submissionService;

    @PostMapping("/api/submissions")
    public ApiResponse<SubmissionResponse> submit(@CurrentUser User user, @Valid @RequestBody SubmissionRequest request) {
        return ApiResponse.ok("채점이 완료되었습니다.", submissionService.submit(user, request));
    }

    @GetMapping("/api/submissions/me")
    public ApiResponse<List<SubmissionResponse>> mine(@CurrentUser User user) {
        return ApiResponse.ok("제출 이력을 조회했습니다.", submissionService.mySubmissions(user));
    }

    @GetMapping("/api/problems/{problemId}/submissions/me")
    public ApiResponse<List<SubmissionResponse>> mineByProblem(@CurrentUser User user, @PathVariable Long problemId) {
        return ApiResponse.ok("문제별 제출 이력을 조회했습니다.", submissionService.myProblemSubmissions(user, problemId));
    }
}
