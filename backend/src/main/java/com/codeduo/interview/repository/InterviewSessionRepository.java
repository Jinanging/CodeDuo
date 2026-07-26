package com.codeduo.interview.repository;

import com.codeduo.interview.entity.InterviewSession;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {
    @EntityGraph(attributePaths = "turns")
    Optional<InterviewSession> findByIdAndUserId(Long id, Long userId);

    List<InterviewSession> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);
}
