package com.codeduo.user.service;

import com.codeduo.global.exception.BusinessException;
import com.codeduo.problem.type.Language;
import com.codeduo.submission.repository.SubmissionRepository;
import com.codeduo.user.dto.UpdateProfileRequest;
import com.codeduo.user.dto.UserActivityResponse;
import com.codeduo.user.entity.User;
import com.codeduo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    public List<UserActivityResponse> getActivity(Long userId, LocalDate from, LocalDate to) {
        LocalDate safeTo = to == null ? LocalDate.now() : to;
        LocalDate safeFrom = from == null ? safeTo.minusMonths(3).plusDays(1) : from;
        if (safeFrom.isAfter(safeTo)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "조회 시작일이 종료일보다 늦을 수 없습니다.");
        }

        Map<Long, LocalDateTime> firstSolvedByProblem = new HashMap<>();
        submissionRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .filter(submission -> submission.isCorrect() && submission.getCreatedAt() != null)
                .forEach(submission -> firstSolvedByProblem.merge(
                        submission.getProblem().getId(),
                        submission.getCreatedAt(),
                        (left, right) -> left.isBefore(right) ? left : right
                ));

        Map<LocalDate, Long> counts = firstSolvedByProblem.values().stream()
                .filter(solvedAt -> !solvedAt.toLocalDate().isBefore(safeFrom))
                .filter(solvedAt -> !solvedAt.toLocalDate().isAfter(safeTo))
                .collect(Collectors.groupingBy(
                        solvedAt -> solvedAt.toLocalDate(),
                        LinkedHashMap::new,
                        Collectors.counting()
                ));

        return counts.entrySet().stream()
                .map(entry -> new UserActivityResponse(entry.getKey().toString(), entry.getValue()))
                .toList();
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
        String nickname = request.nickname().trim();
        if (!user.getNickname().equalsIgnoreCase(nickname) && userRepository.existsByNicknameIgnoreCaseAndIdNot(nickname, user.getId())) {
            throw new BusinessException(HttpStatus.CONFLICT, "이미 사용 중인 닉네임입니다.");
        }

        user.setNickname(nickname);
        user.setEmail(email);
        user.setAvatar(request.avatar().trim());
        return user;
    }

    @Transactional
    public User upgradeToPremium(User user) {
        User managedUser = getById(user.getId());
        managedUser.setPremium(true);
        return managedUser;
    }

    @Transactional
    public void heartbeat(User user) {
        User managedUser = getById(user.getId());
        managedUser.setLastSeenAt(LocalDateTime.now());
    }
}
