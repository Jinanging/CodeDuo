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

    @Query("""
            SELECT s.user.id, COUNT(s)
            FROM Submission s JOIN s.problem p
            WHERE s.user.id IN :userIds
              AND p.language = :language
              AND s.correct = true
              AND s.createdAt BETWEEN :from AND :to
            GROUP BY s.user.id
            """)
    List<Object[]> countWeeklyCorrectByUsersAndLanguage(
            @Param("userIds") List<Long> userIds,
            @Param("language") com.codeduo.problem.type.Language language,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
}
