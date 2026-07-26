package com.codeduo.interview.dto;

import com.codeduo.interview.entity.InterviewSession;
import com.codeduo.interview.entity.InterviewTurn;
import com.codeduo.interview.type.InterviewStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;

class InterviewSessionResponseSecurityTest {
    @Test
    void responseNeverExposesExpectedEvaluationPoints() throws Exception {
        InterviewSession session = InterviewSession.builder()
                .id(1L)
                .status(InterviewStatus.ACTIVE)
                .totalQuestions(3)
                .turns(new ArrayList<>())
                .build();
        session.addTurn(InterviewTurn.builder()
                .id(2L)
                .questionOrder(1)
                .language("JAVA")
                .topic("컬렉션")
                .question("List와 Set의 차이는 무엇인가요?")
                .expectedPoints("private grading criteria")
                .build());

        String json = new ObjectMapper().writeValueAsString(InterviewSessionResponse.from(session));

        assertThat(json)
                .contains("List와 Set의 차이")
                .doesNotContain("private grading criteria", "expectedPoints");
    }
}
