package com.codeduo.wronganswer.dto;

import com.codeduo.wronganswer.entity.WrongAnswer;

import java.time.LocalDateTime;

public record WrongAnswerResponse(
        Long id,
        Long problemId,
        String question,
        String type,
        String language,
        String lastAnswer,
        String correctAnswer,
        String reasonSummary,
        String explanation,
        LocalDateTime updatedAt
) {
    public static WrongAnswerResponse from(WrongAnswer w) {
        return new WrongAnswerResponse(
                w.getId(),
                w.getProblem().getId(),
                w.getProblem().getDescription(),
                w.getProblem().getType().name(),
                w.getProblem().getLanguage().name().toLowerCase(),
                w.getLastAnswer(),
                w.getProblem().getAnswer(),
                w.getReasonSummary(),
                w.getProblem().getExplanation(),
                w.getUpdatedAt()
        );
    }
}
