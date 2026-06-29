package com.codeduo.submission.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SubmissionRequest(
        @NotNull Long problemId,
        @NotBlank String answer
) {
}
