package com.codeduo.user.service;

import com.codeduo.global.exception.BusinessException;
import com.codeduo.user.dto.UpdateProfileRequest;
import com.codeduo.user.entity.User;
import com.codeduo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));
    }

    @Transactional
    public User updateProfile(User user, UpdateProfileRequest request) {
        String email = request.email().trim();
        if (!user.getEmail().equals(email) && userRepository.existsByEmail(email)) {
            throw new BusinessException(HttpStatus.CONFLICT, "이미 사용 중인 이메일입니다.");
        }

        user.setNickname(request.nickname().trim());
        user.setEmail(email);
        user.setAvatar(request.avatar().trim().toUpperCase());
        return user;
    }
}
