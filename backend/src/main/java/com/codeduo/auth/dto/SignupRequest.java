package com.codeduo.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(
        @Email @NotBlank @Size(max = 254) String email,
        @NotBlank @Size(min = 8, max = 128, message = "비밀번호는 8자 이상 128자 이하여야 합니다.") String password,
        @NotBlank @Size(max = 30, message = "닉네임은 30자 이하여야 합니다.") String nickname
) {
}
