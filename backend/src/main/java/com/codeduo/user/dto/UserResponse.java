package com.codeduo.user.dto;

import com.codeduo.user.entity.User;

public record UserResponse(
        Long id,
        String email,
        String nickname,
        String tier,
        int xp,
        int streak,
        int hearts,
        String avatar
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.isPremium() ? "premium" : "free",
                user.getXp(),
                user.getStreakCount(),
                user.getHearts(),
                user.getAvatar()
        );
    }
}
