package com.codeduo.ai.service;

import com.codeduo.ai.dto.EssayGradeResult;
import com.codeduo.global.exception.BusinessException;
import com.codeduo.problem.entity.Problem;
import com.codeduo.submission.entity.Submission;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.JsonNode;

import java.util.List;
import java.util.Map;

@Component
@Slf4j
@ConditionalOnProperty(name = "ai.provider", havingValue = "gemini")
public class GeminiAiClient implements AiClient {
    @Value("${ai.gemini.api-key:}")
    private String apiKey;

    @Value("${ai.gemini.model:gemini-flash-lite-latest}")
    private String model;

    @Override
    public String reviewCode(String sourceCode) {
        return generate("""
                너는 초보자를 돕는 코딩 튜터다.
                아래 코드는 테스트를 통과한 정답 코드다.
                한국어로 3문장 이내로 장점과 한 가지 개선 방향만 알려줘.
                정답 코드를 다시 작성하지 마라.

                코드:
                %s
                """.formatted(limit(sourceCode, 5000)));
    }

    @Override
    public String hintCode(Problem problem, Submission submission) {
        return generate("""
                너는 초보자를 돕는 코딩 튜터다.
                사용자가 코드 문제를 틀렸을 때 힌트를 제공한다.

                규칙:
                - 한국어로 답한다.
                - 정답 코드나 완성 코드를 직접 제공하지 않는다.
                - 실패 원인을 추론하되, 테스트케이스의 숨김 입력/기대 출력은 보여주지 않는다.
                - 사용자가 바로 점검할 수 있는 힌트 2~3개와 다음 행동 1개를 제시한다.
                - 500자 이내로 답한다.

                문제 제목: %s
                문제 설명: %s
                언어: %s
                채점 메시지: %s
                테스트 결과 JSON: %s

                사용자 코드:
                %s
                """.formatted(
                safe(problem.getTitle()),
                safe(problem.getDescription()),
                problem.getLanguage(),
                safe(submission.getResultMessage()),
                limit(submission.getTestResultsJson(), 3000),
                limit(submission.getSubmittedAnswer(), 6000)
        ));
    }

    @Override
    public EssayGradeResult gradeEssay(String rubric, String answer) {
        String feedback = generate("""
                너는 프로그래밍 학습 서비스의 서술형 채점자다.
                아래 채점 기준에 따라 답안을 평가한다.
                한국어로 점수, 정오답 판단, 피드백을 간단히 제공한다.
                형식은 반드시 다음처럼 작성한다.
                score: 0부터 100 사이 숫자
                correct: true 또는 false
                feedback: 한두 문장 피드백

                채점 기준:
                %s

                사용자 답안:
                %s
                """.formatted(limit(rubric, 3000), limit(answer, 5000)));

        int score = parseScore(feedback);
        boolean correct = feedback.toLowerCase().contains("correct: true") || score >= 70;
        return new EssayGradeResult(score, correct, feedback);
    }

    private String generate(String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new BusinessException(HttpStatus.SERVICE_UNAVAILABLE, "Gemini API 키가 설정되지 않았습니다.");
        }

        WebClient webClient = WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of("text", prompt))
                ))
        );

        try {
            JsonNode response = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v1beta/models/{model}:generateContent")
                            .queryParam("key", apiKey)
                            .build(model))
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            JsonNode text = response == null
                    ? null
                    : response.at("/candidates/0/content/parts/0/text");
            if (text == null || text.isMissingNode() || text.asText().isBlank()) {
                throw new BusinessException(HttpStatus.SERVICE_UNAVAILABLE, "AI 응답을 생성하지 못했습니다.");
            }
            return text.asText().strip();
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.warn("Gemini request failed. model={}", model, e);
            throw new BusinessException(HttpStatus.SERVICE_UNAVAILABLE, "AI 서비스에 연결하지 못했습니다.");
        }
    }

    private int parseScore(String text) {
        String lower = text == null ? "" : text.toLowerCase();
        int index = lower.indexOf("score:");
        if (index < 0) return 0;
        String number = lower.substring(index + "score:".length()).stripLeading().split("[^0-9]", 2)[0];
        try {
            return Math.max(0, Math.min(100, Integer.parseInt(number)));
        } catch (Exception ignored) {
            return 0;
        }
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private String limit(String value, int maxLength) {
        if (value == null) return "";
        if (value.length() <= maxLength) return value;
        return value.substring(0, maxLength) + "...";
    }
}
