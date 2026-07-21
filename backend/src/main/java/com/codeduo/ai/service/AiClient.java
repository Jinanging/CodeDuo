package com.codeduo.ai.service;

import com.codeduo.ai.dto.EssayGradeResult;
import com.codeduo.problem.entity.Problem;
import com.codeduo.submission.entity.Submission;

public interface AiClient {
    String reviewCode(String sourceCode);
    String hintCode(Problem problem, Submission submission);
    EssayGradeResult gradeEssay(String rubric, String answer);
}
