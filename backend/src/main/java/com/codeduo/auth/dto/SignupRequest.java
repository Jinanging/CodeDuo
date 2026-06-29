package com.codeduo.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(
        @Email @NotBlank String email,
        @Size(min = 6, message = "비밀번호는 6자 이상이어야 합니다.") String password,
        @NotBlank String nickname
) {
}
