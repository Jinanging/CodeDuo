package com.codeduo.interview.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record InterviewAnswerRequest(
        @NotBlank(message = "면접 답변을 입력해주세요.")
        @Size(max = 8000, message = "면접 답변은 8000자 이하여야 합니다.")
        String answer
) {
}
