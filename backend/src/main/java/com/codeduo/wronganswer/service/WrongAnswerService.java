package com.codeduo.wronganswer.service;

import com.codeduo.global.exception.BusinessException;
import com.codeduo.user.entity.User;
import com.codeduo.wronganswer.dto.WrongAnswerResponse;
import com.codeduo.wronganswer.repository.WrongAnswerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WrongAnswerService {
    private final WrongAnswerRepository wrongAnswerRepository;

    @Transactional(readOnly = true)
    public List<WrongAnswerResponse> list(User user) {
        return wrongAnswerRepository.findByUserIdOrderByUpdatedAtDesc(user.getId()).stream().map(WrongAnswerResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public WrongAnswerResponse get(User user, Long problemId) {
        return wrongAnswerRepository.findByUserIdAndProblemId(user.getId(), problemId).map(WrongAnswerResponse::from)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "오답 기록을 찾을 수 없습니다."));
    }

    public void delete(User user, Long problemId) {
        wrongAnswerRepository.deleteByUserIdAndProblemId(user.getId(), problemId);
    }
}
