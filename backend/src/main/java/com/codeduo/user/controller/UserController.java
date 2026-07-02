package com.codeduo.user.controller;

import com.codeduo.global.response.ApiResponse;
import com.codeduo.global.security.CurrentUser;
import com.codeduo.user.dto.UpdateProfileRequest;
import com.codeduo.user.dto.UserResponse;
import com.codeduo.user.entity.User;
import com.codeduo.user.service.UserService;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "User")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ApiResponse<UserResponse> me(@CurrentUser User user) {
        return ApiResponse.ok("내 정보를 조회했습니다.", UserResponse.from(user));
    }

    @PatchMapping("/me")
    public ApiResponse<UserResponse> updateMe(@CurrentUser User user, @Valid @RequestBody UpdateProfileRequest request) {
        User updated = userService.updateProfile(user, request);
        return ApiResponse.ok("프로필을 수정했습니다.", UserResponse.from(updated));
    }
}
