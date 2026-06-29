package com.codeduo.auth.dto;

import com.codeduo.user.dto.UserResponse;

public record AuthResponse(
        String accessToken,
        String tokenType,
        UserResponse user
) {
}
