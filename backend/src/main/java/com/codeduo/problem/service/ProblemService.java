package com.codeduo.problem.service;

import com.codeduo.ai.service.AiClient;
import com.codeduo.global.exception.BusinessException;
import com.codeduo.problem.dto.ProblemResponse;
import com.codeduo.problem.entity.Problem;
import com.codeduo.problem.repository.ProblemRepository;
import com.codeduo.problem.type.Language;
import com.codeduo.submission.dto.AiHintResponse;
import com.codeduo.user.entity.User;
import com.codeduo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProblemService {
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final AiClient aiClient;

    public List<ProblemResponse> getProblems(Long lessonId) {
        return problemRepository.findByLessonIdOrderByOrderIndex(lessonId).stream().map(ProblemResponse::from).toList();
    }

    public List<ProblemResponse> getProblems(String language, int difficulty) {
        Language lang = Language.valueOf(language.toUpperCase());
        return problemRepository.findByLanguageAndDifficultyOrderByOrderIndex(lang, difficulty)
                .stream().map(ProblemResponse::from).toList();
    }

    public List<ProblemResponse> getProblems(String language) {
        Language lang = Language.valueOf(language.toUpperCase());
        return problemRepository.findByLanguageOrderByOrderIndex(lang)
                .stream().map(ProblemResponse::from).toList();
    }

    public ProblemResponse getProblem(Long id) {
        return problemRepository.findById(id).map(ProblemResponse::from)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "문제를 찾을 수 없습니다."));
    }

    public AiHintResponse createAiHint(User user, Long problemId) {
        User managedUser = userRepository.getReferenceById(user.getId());
        if (!managedUser.isPremium()) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "AI 힌트는 프리미엄 전용 기능입니다.");
        }

        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "문제를 찾을 수 없습니다."));
        if (problem.getHint() != null && !problem.getHint().isBlank()) {
            return new AiHintResponse(problem.getHint());
        }

        return new AiHintResponse(aiClient.hintProblem(problem));
    }
}
