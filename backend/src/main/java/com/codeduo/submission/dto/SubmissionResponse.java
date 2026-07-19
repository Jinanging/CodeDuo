package com.codeduo.submission.dto;

import com.codeduo.submission.entity.Submission;

import java.time.LocalDateTime;

public record SubmissionResponse(
        Long id,
        Long problemId,
        boolean correct,
        int score,
        String resultMessage,
        String explanation,
        String aiReview,
        Long runtimeMs,
        Long memoryKb,
        String testResultsJson,
        LocalDateTime createdAt
) {
    public static SubmissionResponse from(Submission s) {
        return new SubmissionResponse(
                s.getId(),
                s.getProblem().getId(),
                s.isCorrect(),
                s.getScore(),
                s.getResultMessage(),
                s.getProblem().getExplanation(),
                s.getAiReview(),
                s.getRuntimeMs(),
                s.getMemoryKb(),
                s.getTestResultsJson(),
                s.getCreatedAt()
        );
    }
}
