package com.codeduo.problem.service;

import com.codeduo.global.exception.BusinessException;
import com.codeduo.problem.dto.ProblemResponse;
import com.codeduo.problem.repository.ProblemRepository;
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

    public List<ProblemResponse> getProblems(Long lessonId) {
        return problemRepository.findByLessonIdOrderByOrderIndex(lessonId).stream().map(ProblemResponse::from).toList();
    }

    public ProblemResponse getProblem(Long id) {
        return problemRepository.findById(id).map(ProblemResponse::from)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "문제를 찾을 수 없습니다."));
    }
}
