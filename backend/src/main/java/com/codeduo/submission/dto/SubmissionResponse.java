package com.codeduo.submission.dto;

import com.codeduo.submission.entity.Submission;

import java.time.LocalDateTime;

/** 제출이 끝난 뒤 학습자 본인에게 돌려주는 채점 결과와 해설입니다. */
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
