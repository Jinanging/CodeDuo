package com.codeduo.admin.dto;

import com.codeduo.problem.type.Language;
import com.codeduo.problem.type.ProblemType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AdminProblemRequest(
        @NotNull Long lessonId,
        @NotNull ProblemType type,
        @NotNull Language language,
        @Min(1) @Max(9) int difficulty,
        @NotBlank String title,
        @NotBlank String description,
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
        Integer orderIndex
) {
}
