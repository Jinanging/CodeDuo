package com.codeduo.problem.dto;

import com.codeduo.problem.entity.Problem;

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
