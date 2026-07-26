package com.codeduo.interview.dto;

import com.codeduo.interview.entity.InterviewSession;
import com.codeduo.interview.entity.InterviewTurn;

import java.time.LocalDateTime;
import java.util.List;

public record InterviewSessionResponse(
        Long id,
        String status,
        int totalQuestions,
        int completedQuestions,
        Integer averageScore,
        InterviewQuestionResponse currentQuestion,
        List<InterviewTurnResponse> turns,
        InterviewFinalReviewResponse finalReview,
        LocalDateTime createdAt,
        LocalDateTime completedAt
) {
    public static InterviewSessionResponse from(InterviewSession session) {
        List<InterviewTurn> turns = session.getTurns() == null ? List.of() : session.getTurns();
        List<InterviewTurnResponse> answered = turns.stream()
                .filter(InterviewTurn::isAnswered)
                .map(InterviewTurnResponse::from)
                .toList();
        InterviewQuestionResponse current = turns.stream()
                .filter(turn -> !turn.isAnswered())
                .findFirst()
                .map(InterviewQuestionResponse::from)
                .orElse(null);
        Integer average = answered.isEmpty()
                ? null
                : answered.stream().map(InterviewTurnResponse::score).mapToInt(Integer::intValue).sum() / answered.size();
        return new InterviewSessionResponse(
                session.getId(),
                session.getStatus().name(),
                session.getTotalQuestions(),
                answered.size(),
                average,
                current,
                answered,
                InterviewFinalReviewResponse.from(session),
                session.getCreatedAt(),
                session.getCompletedAt()
        );
    }
}
