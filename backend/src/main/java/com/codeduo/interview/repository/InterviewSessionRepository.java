package com.codeduo.interview.repository;

import com.codeduo.interview.entity.InterviewSession;
import com.codeduo.interview.type.InterviewStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {
    @EntityGraph(attributePaths = "turns")
    Optional<InterviewSession> findByIdAndUserId(Long id, Long userId);

    @EntityGraph(attributePaths = "turns")
    Optional<InterviewSession> findFirstByUserIdAndStatusOrderByCreatedAtDesc(Long userId, InterviewStatus status);

    @EntityGraph(attributePaths = "turns")
    List<InterviewSession> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);
}
