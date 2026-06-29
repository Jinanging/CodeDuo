package com.codeduo.ai.service;

import com.codeduo.ai.dto.EssayGradeResult;

public interface AiClient {
    String reviewCode(String sourceCode);
    EssayGradeResult gradeEssay(String rubric, String answer);
}
