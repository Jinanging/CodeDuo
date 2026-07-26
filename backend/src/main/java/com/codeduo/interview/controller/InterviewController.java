package com.codeduo.interview.controller;

import com.codeduo.global.response.ApiResponse;
import com.codeduo.global.security.CurrentUser;
import com.codeduo.interview.dto.InterviewAnswerRequest;
import com.codeduo.interview.dto.InterviewSessionResponse;
import com.codeduo.interview.service.InterviewService;
import com.codeduo.user.entity.User;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "AI Interview")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/interviews")
public class InterviewController {
    private final InterviewService interviewService;

    @PostMapping
    public ApiResponse<InterviewSessionResponse> start(@CurrentUser User user) {
        return ApiResponse.ok("AI 면접을 시작했습니다.", interviewService.start(user));
    }

    @PostMapping("/{sessionId}/answers")
    public ApiResponse<InterviewSessionResponse> answer(
            @CurrentUser User user,
            @PathVariable Long sessionId,
            @Valid @RequestBody InterviewAnswerRequest request
    ) {
        return ApiResponse.ok("AI 면접 답변을 평가했습니다.", interviewService.answer(user, sessionId, request.answer()));
    }

    @GetMapping("/{sessionId}")
    public ApiResponse<InterviewSessionResponse> get(@CurrentUser User user, @PathVariable Long sessionId) {
        return ApiResponse.ok("AI 면접을 조회했습니다.", interviewService.get(user, sessionId));
    }

    @GetMapping
    public ApiResponse<List<InterviewSessionResponse>> history(@CurrentUser User user) {
        return ApiResponse.ok("AI 면접 이력을 조회했습니다.", interviewService.history(user));
    }
}
