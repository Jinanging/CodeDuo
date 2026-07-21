package com.codeduo.submission.repository;

import com.codeduo.submission.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Submission> findByUserIdAndProblemIdOrderByCreatedAtDesc(Long userId, Long problemId);
    List<Submission> findByUserIdAndCreatedAtBetweenOrderByCreatedAtAsc(Long userId, LocalDateTime from, LocalDateTime to);
    Optional<Submission> findByIdAndUserId(Long id, Long userId);
    void deleteByProblemId(Long problemId);

    // 언어별 "정답" 제출 수 집계 → [Language, count]
    @Query("SELECT p.language, COUNT(s) FROM Submission s JOIN s.problem p " +
           "WHERE s.user.id = :userId AND s.correct = true GROUP BY p.language")
    List<Object[]> countCorrectByLanguage(@Param("userId") Long userId);
}
