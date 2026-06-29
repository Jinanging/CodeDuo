package com.codeduo.wronganswer.repository;

import com.codeduo.wronganswer.entity.WrongAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WrongAnswerRepository extends JpaRepository<WrongAnswer, Long> {
    List<WrongAnswer> findByUserIdOrderByUpdatedAtDesc(Long userId);
    Optional<WrongAnswer> findByUserIdAndProblemId(Long userId, Long problemId);
    void deleteByUserIdAndProblemId(Long userId, Long problemId);
}
