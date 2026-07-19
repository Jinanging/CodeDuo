package com.codeduo.wronganswer.dto;

import com.codeduo.problem.entity.Problem;
import com.codeduo.problem.type.Language;
import com.codeduo.problem.type.ProblemType;
import com.codeduo.wronganswer.entity.WrongAnswer;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class WrongAnswerResponseSecurityTest {
    @Test
    void wrongAnswerHistoryReturnsLearningExplanationButNeverExactAnswer() throws Exception {
        Problem problem = Problem.builder()
                .id(1L)
                .type(ProblemType.SHORT_ANSWER)
                .language(Language.PYTHON)
                .description("문제")
                .answer("private answer")
                .explanation("private explanation")
                .build();
        WrongAnswer wrongAnswer = WrongAnswer.builder()
                .id(1L)
                .problem(problem)
                .lastAnswer("wrong")
                .reasonSummary("다시 시도하세요.")
                .build();

        String json = new ObjectMapper().writeValueAsString(WrongAnswerResponse.from(wrongAnswer));

        assertThat(json)
                .doesNotContain("private answer", "correctAnswer")
                .contains("private explanation", "explanation", "wrong", "다시 시도하세요.");
    }
}
