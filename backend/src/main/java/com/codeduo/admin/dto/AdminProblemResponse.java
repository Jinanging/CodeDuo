package com.codeduo.admin.dto;

import com.codeduo.problem.entity.Problem;

import java.time.LocalDateTime;

public record AdminProblemResponse(
        Long id,
        Long lessonId,
        String type,
        String language,
        String title,
        String description,
        int difficulty,
        String answer,
        String codeTemplate,
        String testInput,
        String expectedOutput,
        String rubric,
        String optionsJson,
        String hint,
        String explanation,
        String tagsJson,
        String testCasesJson,
        int orderIndex,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static AdminProblemResponse from(Problem p) {
        return new AdminProblemResponse(
                p.getId(),
                p.getLesson().getId(),
                p.getType().name(),
                p.getLanguage().name(),
                p.getTitle(),
                p.getDescription(),
                p.getDifficulty(),
                p.getAnswer(),
                p.getCodeTemplate(),
                p.getTestInput(),
                p.getExpectedOutput(),
                p.getRubric(),
                p.getOptionsJson(),
                p.getHint(),
                p.getExplanation(),
                p.getTagsJson(),
                p.getTestCasesJson(),
                p.getOrderIndex(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }
}
