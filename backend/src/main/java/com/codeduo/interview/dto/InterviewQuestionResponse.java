package com.codeduo.interview.dto;

import com.codeduo.interview.entity.InterviewTurn;

public record InterviewQuestionResponse(
        Long id,
        int order,
        String language,
        String topic,
        String question
) {
    public static InterviewQuestionResponse from(InterviewTurn turn) {
        return new InterviewQuestionResponse(
                turn.getId(),
                turn.getQuestionOrder(),
                turn.getLanguage(),
                turn.getTopic(),
                turn.getQuestion()
        );
    }
}
