package com.codeduo.interview.dto;

import com.codeduo.interview.entity.InterviewTurn;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

public record InterviewTurnResponse(
        Long id,
        int order,
        String language,
        String topic,
        String question,
        String answer,
        Integer score,
        String verdict,
        String feedback,
        List<String> strengths,
        List<String> improvements,
        String modelAnswer,
        LocalDateTime answeredAt
) {
    public static InterviewTurnResponse from(InterviewTurn turn) {
        return new InterviewTurnResponse(
                turn.getId(),
                turn.getQuestionOrder(),
                turn.getLanguage(),
                turn.getTopic(),
                turn.getQuestion(),
                turn.getAnswer(),
                turn.getScore(),
                turn.getVerdict(),
                turn.getFeedback(),
                lines(turn.getStrengthsText()),
                lines(turn.getImprovementsText()),
                turn.getModelAnswer(),
                turn.getAnsweredAt()
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
