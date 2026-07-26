package com.codeduo.ai.dto;

import java.util.List;

public record InterviewEvaluation(
        int score,
        String verdict,
        String feedback,
        List<String> strengths,
        List<String> improvements,
        String modelAnswer
) {
}
