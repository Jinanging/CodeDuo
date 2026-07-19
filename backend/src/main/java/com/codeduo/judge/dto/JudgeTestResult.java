package com.codeduo.judge.dto;

/**
 * 학습자에게 공개 가능한 테스트별 채점 결과입니다.
 * 숨김 테스트의 입력, 기대 출력, 실제 출력은 의도적으로 저장하지 않습니다.
 */
public record JudgeTestResult(
        int caseNumber,
        boolean pass,
        String status,
        String error,
        Long runtimeMs,
        Long memoryKb
) {
}
