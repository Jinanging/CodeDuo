package com.codeduo.judge.dto;

public record JudgeTestResult(
        int caseNumber,
        boolean pass,
        String status,
        String error,
        Long runtimeMs,
        Long memoryKb
) {
}
