package com.codeduo.ai.service;

import com.codeduo.ai.dto.EssayGradeResult;
import com.codeduo.problem.entity.Problem;
import com.codeduo.submission.entity.Submission;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnMissingBean(AiClient.class)
public class MockAiClient implements AiClient {
    @Override
    public String reviewCode(String sourceCode) {
        return "정답입니다. 핵심 로직이 간결하고 입력/출력 흐름이 명확합니다. 다음 단계에서는 예외 케이스도 함께 고려해보세요.";
    }

    @Override
    public String hintCode(Problem problem, Submission submission) {
        return "실패한 테스트의 입력 조건을 다시 확인해보세요. 반복문 범위, 조건 분기, 출력 형식 중 하나가 기대 결과와 다를 가능성이 큽니다.";
    }

    @Override
    public EssayGradeResult gradeEssay(String rubric, String answer) {
        boolean correct = answer != null && answer.strip().length() >= 10;
        return new EssayGradeResult(correct ? 90 : 40, correct, correct ? "핵심 개념을 충분히 설명했습니다." : "설명이 짧습니다. 개념과 예시를 함께 작성해보세요.");
    }
}
