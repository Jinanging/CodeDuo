package com.codeduo.admin.controller;

import com.codeduo.admin.dto.AdminLessonResponse;
import com.codeduo.admin.dto.AdminProblemRequest;
import com.codeduo.admin.dto.AdminProblemResponse;
import com.codeduo.admin.service.AdminProblemService;
import com.codeduo.global.response.ApiResponse;
import com.codeduo.global.security.CurrentUser;
import com.codeduo.problem.type.Language;
import com.codeduo.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminProblemController {
    private final AdminProblemService adminProblemService;

    @GetMapping("/lessons")
    public ApiResponse<List<AdminLessonResponse>> lessons(@CurrentUser User user) {
        return ApiResponse.ok("관리자 레슨 목록을 조회했습니다.", adminProblemService.getLessons(user));
    }

    @GetMapping("/problems")
    public ApiResponse<List<AdminProblemResponse>> problems(
            @CurrentUser User user,
            @RequestParam(required = false) Language language,
            @RequestParam(required = false) Integer difficulty,
            @RequestParam(required = false) Long lessonId
    ) {
        return ApiResponse.ok("관리자 문제 목록을 조회했습니다.", adminProblemService.getProblems(user, language, difficulty, lessonId));
    }

    @PostMapping("/problems")
    public ApiResponse<AdminProblemResponse> create(@CurrentUser User user, @Valid @RequestBody AdminProblemRequest request) {
        return ApiResponse.ok("문제를 추가했습니다.", adminProblemService.createProblem(user, request));
    }

    @PutMapping("/problems/{problemId}")
    public ApiResponse<AdminProblemResponse> update(
            @CurrentUser User user,
            @PathVariable Long problemId,
            @Valid @RequestBody AdminProblemRequest request
    ) {
        return ApiResponse.ok("문제를 수정했습니다.", adminProblemService.updateProblem(user, problemId, request));
    }

    @DeleteMapping("/problems/{problemId}")
    public ApiResponse<Void> delete(@CurrentUser User user, @PathVariable Long problemId) {
        adminProblemService.deleteProblem(user, problemId);
        return ApiResponse.ok("문제를 삭제했습니다.");
    }
}
