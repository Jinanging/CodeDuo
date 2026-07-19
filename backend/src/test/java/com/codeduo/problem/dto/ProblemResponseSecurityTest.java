package com.codeduo.problem.dto;

import com.codeduo.lesson.entity.Lesson;
import com.codeduo.problem.entity.Problem;
import com.codeduo.problem.type.Language;
import com.codeduo.problem.type.ProblemType;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ProblemResponseSecurityTest {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void publicResponseContainsOnlySampleAndNeverGradingSecrets() throws Exception {
        Problem problem = Problem.builder()
                .id(3L)
                .lesson(Lesson.builder().id(1L).build())
                .type(ProblemType.CODE)
                .language(Language.PYTHON)
                .title("합 구하기")
                .description("두 수를 더하세요.")
                .difficulty(1)
                .testInput("2 3")
                .expectedOutput("5")
                .answer("private solution")
                .rubric("private rubric")
                .explanation("private explanation")
                .testCasesJson("[{\"input\":\"secret\",\"expected\":\"secret\"}]")
                .tagsJson("[]")
                .build();

        String json = objectMapper.writeValueAsString(ProblemResponse.from(problem));

        assertThat(json).contains("\"sampleInput\":\"2 3\"")
                .contains("\"sampleOutput\":\"5\"")
                .doesNotContain("private solution", "private rubric", "private explanation", "secret")
                .doesNotContain("testCasesJson", "answer", "rubric", "explanation");
    }
}
