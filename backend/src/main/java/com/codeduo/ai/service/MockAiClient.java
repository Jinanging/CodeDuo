package com.codeduo.ai.service;

import com.codeduo.ai.dto.EssayGradeResult;
import org.springframework.stereotype.Component;

@Component
public class MockAiClient implements AiClient {
    @Override
    public String reviewCode(String sourceCode) {
        return "정답입니다. 핵심 로직이 간결하고 입력/출력 흐름이 명확합니다. 다음 단계에서는 예외 케이스도 함께 고려해보세요.";
    }

    @Override
    public EssayGradeResult gradeEssay(String rubric, String answer) {
        boolean correct = answer != null && answer.strip().length() >= 10;
        return new EssayGradeResult(correct ? 90 : 40, correct, correct ? "핵심 개념을 충분히 설명했습니다." : "설명이 짧습니다. 개념과 예시를 함께 작성해보세요.");
    }
}
