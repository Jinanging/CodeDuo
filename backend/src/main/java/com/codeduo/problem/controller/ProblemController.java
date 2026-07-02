package com.codeduo.problem.controller;

import com.codeduo.global.response.ApiResponse;
import com.codeduo.problem.dto.ProblemResponse;
import com.codeduo.problem.service.ProblemService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Problem")
@RestController
@RequiredArgsConstructor
public class ProblemController {
    private final ProblemService problemService;

    @GetMapping("/api/lessons/{lessonId}/problems")
    public ApiResponse<List<ProblemResponse>> problems(@PathVariable Long lessonId) {
        return ApiResponse.ok("문제 목록을 조회했습니다.", problemService.getProblems(lessonId));
    }

    // 언어(python/java/c/cpp) + 난이도(1~3)로 문제 조회
    // difficulty 없으면 해당 언어 전체
    @GetMapping("/api/problems")
    public ApiResponse<List<ProblemResponse>> problemsByLangDiff(@RequestParam String language, @RequestParam(required = false) Integer difficulty) {
        List<ProblemResponse> list = (difficulty == null)
                ? problemService.getProblems(language)
                : problemService.getProblems(language, difficulty);
        return ApiResponse.ok("문제 목록을 조회했습니다.", list);
    }

    @GetMapping("/api/problems/{problemId}")
    public ApiResponse<ProblemResponse> problem(@PathVariable Long problemId) {
        return ApiResponse.ok("문제를 조회했습니다.", problemService.getProblem(problemId));
    }
}
