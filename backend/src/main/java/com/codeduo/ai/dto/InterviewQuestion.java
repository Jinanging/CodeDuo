package com.codeduo.ai.dto;

public record InterviewQuestion(
        String language,
        String topic,
        String question,
        String expectedPoints
) {
}
