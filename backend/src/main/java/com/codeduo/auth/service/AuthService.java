package com.codeduo.auth.service;

import com.codeduo.auth.dto.AuthResponse;
import com.codeduo.auth.dto.LoginRequest;
import com.codeduo.auth.dto.SignupRequest;
import com.codeduo.global.exception.BusinessException;
import com.codeduo.global.security.JwtTokenProvider;
import com.codeduo.user.dto.UserResponse;
import com.codeduo.user.entity.User;
import com.codeduo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException(HttpStatus.CONFLICT, "이미 가입된 이메일입니다.");
        }
        User user = userRepository.save(User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .nickname(request.nickname())
                .avatar(request.nickname().length() >= 2 ? request.nickname().substring(0, 2).toUpperCase() : request.nickname().toUpperCase())
                .xp(0)
                .streakCount(0)
                .hearts(5)
                .build());
        return token(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다."));
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BusinessException(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다.");
        }
        return token(user);
    }

    private AuthResponse token(User user) {
        return new AuthResponse(jwtTokenProvider.createToken(user.getId(), user.getEmail()), "Bearer", UserResponse.from(user));
    }
}
