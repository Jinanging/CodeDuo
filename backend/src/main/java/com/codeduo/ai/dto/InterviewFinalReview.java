package com.codeduo.ai.dto;

import java.util.List;

public record InterviewFinalReview(
        String verdict,
        String overallReview,
        String hiringRecommendation,
        List<String> focusAreas
) {
}
