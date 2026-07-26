package com.codeduo.interview.dto;

import com.codeduo.interview.entity.InterviewSession;

import java.util.Arrays;
import java.util.List;

public record InterviewFinalReviewResponse(
        String verdict,
        String overallReview,
        String hiringRecommendation,
        List<String> focusAreas
) {
    public static InterviewFinalReviewResponse from(InterviewSession session) {
        if (session.getOverallReview() == null || session.getOverallReview().isBlank()) return null;
        return new InterviewFinalReviewResponse(
                session.getFinalVerdict(),
                session.getOverallReview(),
                session.getHiringRecommendation(),
                lines(session.getFocusAreasText())
        );
    }

    private static List<String> lines(String value) {
        if (value == null || value.isBlank()) return List.of();
        return Arrays.stream(value.split("\\R"))
                .map(String::strip)
                .filter(line -> !line.isBlank())
                .toList();
    }
}
