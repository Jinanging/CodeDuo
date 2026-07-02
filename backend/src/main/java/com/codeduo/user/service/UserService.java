package com.codeduo.user.service;

import com.codeduo.global.exception.BusinessException;
import com.codeduo.problem.type.Language;
import com.codeduo.submission.repository.SubmissionRepository;
import com.codeduo.user.dto.UpdateProfileRequest;
import com.codeduo.user.entity.User;
import com.codeduo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private static final int XP_PER_CORRECT = 10;

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;

    /** 언어별 XP = 해당 언어 정답 제출 수 x 10 (총 XP 규칙과 동일). 모든 언어 0으로 초기화 후 채움. */
    public Map<String, Integer> getLanguageXp(Long userId) {
        Map<String, Integer> result = new LinkedHashMap<>();
        for (Language lang : Language.values()) result.put(lang.name().toLowerCase(), 0);
        for (Object[] row : submissionRepository.countCorrectByLanguage(userId)) {
            Language lang = (Language) row[0];
            long count = (Long) row[1];
            result.put(lang.name().toLowerCase(), (int) count * XP_PER_CORRECT);
        }
        return result;
    }

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
