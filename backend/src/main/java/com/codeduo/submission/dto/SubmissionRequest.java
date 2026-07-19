package com.codeduo.submission.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SubmissionRequest(
        @NotNull Long problemId,
        @NotBlank @Size(max = 65_536, message = "답안은 65,536자 이하여야 합니다.") String answer
) {
}
