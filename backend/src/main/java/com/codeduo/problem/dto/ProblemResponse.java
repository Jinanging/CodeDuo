package com.codeduo.problem.dto;

import com.codeduo.problem.entity.Problem;

/**
 * 문제 풀이 전 공개해도 되는 정보만 담는 응답입니다.
 * 정답, 해설, 서술형 기준, 숨김 테스트케이스는 이 DTO에 추가하지 않습니다.
 */
public record ProblemResponse(
        Long id,
        Long lessonId,
        String type,
        String language,
        String title,
        String description,
        int difficulty,
        String codeTemplate,
        String sampleInput,
        String sampleOutput,
        String optionsJson,
        String hint,
        String tagsJson,
        int orderIndex
) {
    public static ProblemResponse from(Problem p) {
        return new ProblemResponse(
                p.getId(),
                p.getLesson().getId(),
                p.getType().name(),
                p.getLanguage().name().toLowerCase(),
                p.getTitle(),
                p.getDescription(),
                p.getDifficulty(),
                p.getCodeTemplate(),
                p.getTestInput(),
                p.getExpectedOutput(),
                p.getOptionsJson(),
                p.getHint(),
                p.getTagsJson(),
                p.getOrderIndex()
        );
    }
}
