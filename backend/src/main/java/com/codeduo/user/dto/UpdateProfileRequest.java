package com.codeduo.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank @Size(max = 30) String nickname,
        @Email @NotBlank @Size(max = 254) String email,
        @NotBlank @Size(max = 2) String avatar
) {
}
