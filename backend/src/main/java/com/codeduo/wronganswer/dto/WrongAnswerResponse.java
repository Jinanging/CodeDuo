package com.codeduo.wronganswer.dto;

import com.codeduo.wronganswer.entity.WrongAnswer;

import java.time.LocalDateTime;

/** 오답을 제출한 학습자 본인의 오답노트에서만 사용하는 해설 응답입니다. */
public record WrongAnswerResponse(
        Long id,
        Long problemId,
        String question,
        String type,
        String language,
        String optionsJson,
        String codeTemplate,
        String lastAnswer,
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
                w.getProblem().getOptionsJson(),
                w.getProblem().getCodeTemplate(),
                w.getLastAnswer(),
                w.getReasonSummary(),
                w.getProblem().getExplanation(),
                w.getUpdatedAt()
        );
    }
}
