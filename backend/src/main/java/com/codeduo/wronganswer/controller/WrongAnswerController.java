package com.codeduo.wronganswer.controller;

import com.codeduo.global.response.ApiResponse;
import com.codeduo.global.security.CurrentUser;
import com.codeduo.user.entity.User;
import com.codeduo.wronganswer.dto.WrongAnswerResponse;
import com.codeduo.wronganswer.service.WrongAnswerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "WrongAnswer")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wrong-answers")
public class WrongAnswerController {
    private final WrongAnswerService wrongAnswerService;

    @GetMapping
    public ApiResponse<List<WrongAnswerResponse>> list(@CurrentUser User user) {
        return ApiResponse.ok("오답노트를 조회했습니다.", wrongAnswerService.list(user));
    }

    @GetMapping("/{problemId}")
    public ApiResponse<WrongAnswerResponse> get(@CurrentUser User user, @PathVariable Long problemId) {
        return ApiResponse.ok("오답을 조회했습니다.", wrongAnswerService.get(user, problemId));
    }

    @DeleteMapping("/{problemId}")
    public ApiResponse<Void> delete(@CurrentUser User user, @PathVariable Long problemId) {
        wrongAnswerService.delete(user, problemId);
        return ApiResponse.ok("오답을 삭제했습니다.");
    }
}
