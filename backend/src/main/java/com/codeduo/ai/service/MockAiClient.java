package com.codeduo.ai.service;

import com.codeduo.ai.dto.EssayGradeResult;
import com.codeduo.ai.dto.InterviewEvaluation;
import com.codeduo.ai.dto.InterviewFinalReview;
import com.codeduo.ai.dto.InterviewQuestion;
import com.codeduo.analytics.dto.AnalyticsDtos.AiLearningReport;
import com.codeduo.problem.entity.Problem;
import com.codeduo.submission.entity.Submission;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConditionalOnProperty(name = "ai.provider", havingValue = "mock", matchIfMissing = true)
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

    @Override
    public InterviewQuestion createInterviewQuestion(String studyContext, List<String> previousQuestions, int questionNumber) {
        String question = switch (questionNumber) {
            case 1 -> "최근 학습한 개념 중 가장 헷갈렸던 부분을 하나 고르고, 동작 원리를 예시와 함께 설명해보세요.";
            case 2 -> "방금 설명한 개념을 실제 코드에 적용할 때 발생할 수 있는 실수와 예방 방법을 말해보세요.";
            default -> "같은 문제를 다시 해결한다면 어떤 순서로 접근하고 검증할지 면접관에게 설명해보세요.";
        };
        return new InterviewQuestion(
                studyContext != null && studyContext.contains("JAVA") ? "JAVA" : "PYTHON",
                "최근 학습 내용",
                question,
                "핵심 개념, 구체적인 예시, 실수 예방 또는 검증 방법"
        );
    }

    @Override
    public InterviewEvaluation evaluateInterviewAnswer(InterviewQuestion question, String answer) {
        int length = answer == null ? 0 : answer.strip().length();
        int score = Math.min(95, Math.max(35, 35 + length));
        String verdict = score >= 80 ? "PASS" : score >= 60 ? "BORDERLINE" : "NEEDS_IMPROVEMENT";
        return new InterviewEvaluation(
                score,
                verdict,
                score >= 70 ? "핵심 개념과 접근 방향을 이해하고 있습니다." : "핵심 개념을 실제 예시와 연결해 설명해보세요.",
                List.of("질문의 핵심을 벗어나지 않고 답변했습니다."),
                List.of("구체적인 코드 예시와 예외 상황을 덧붙이면 더 설득력 있습니다."),
                "핵심 개념을 먼저 정의하고, 짧은 코드 예시와 발생 가능한 예외 상황, 검증 방법 순서로 설명하는 답변이 좋습니다."
        );
    }

    @Override
    public InterviewFinalReview createInterviewFinalReview(String interviewTranscript, int averageScore) {
        String verdict = averageScore >= 90 ? "STRONG_PASS" : averageScore >= 75 ? "PASS" : averageScore >= 60 ? "BORDERLINE" : "NEEDS_IMPROVEMENT";
        return new InterviewFinalReview(
                verdict,
                "세 질문 모두에서 핵심 개념을 설명하고 문제 해결 과정을 전달했습니다. 실제 면접에서는 선택의 근거와 검증 방법을 더 구체적으로 말하면 좋습니다.",
                averageScore >= 75
                        ? "기초 역량과 성장 가능성이 확인되어 다음 전형을 추천합니다."
                        : "핵심 개념을 코드와 연결해 설명하는 연습 후 재면접을 권합니다.",
                List.of("개념을 실제 코드 예시로 설명하기", "경계값과 예외 상황 검증하기", "기술 선택의 장단점 비교하기")
        );
    }

    @Override
    public AiLearningReport createLearningReport(String learningContext) {
        return new AiLearningReport(
                "최근 풀이 기록을 기준으로 학습 흐름을 정리했습니다. 아직 데이터가 많지 않다면 꾸준히 문제를 풀수록 더 구체적인 리포트를 받을 수 있습니다.",
                List.of("최근 학습을 이어가며 풀이 기록을 쌓고 있습니다.", "오답 기록을 통해 다시 볼 문제를 남기고 있습니다."),
                List.of("풀이 기록이 쌓이면 언어, 난이도, 문제 유형별 흐름을 더 자세히 볼 수 있습니다."),
                List.of("최근 틀린 문제", "풀이 기록이 적은 유형"),
                List.of("오답노트에서 최근 오답 1~2개를 다시 확인하기", "선택한 언어의 기초 문제를 짧게 이어서 풀기")
        );
    }
}
