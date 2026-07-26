package com.codeduo.ai.service;

import com.codeduo.ai.dto.EssayGradeResult;
import com.codeduo.ai.dto.InterviewEvaluation;
import com.codeduo.ai.dto.InterviewFinalReview;
import com.codeduo.ai.dto.InterviewQuestion;
import com.codeduo.problem.entity.Problem;
import com.codeduo.submission.entity.Submission;

import java.util.List;

public interface AiClient {
    String reviewCode(String sourceCode);
    String hintCode(Problem problem, Submission submission);
    EssayGradeResult gradeEssay(String rubric, String answer);
    InterviewQuestion createInterviewQuestion(String studyContext, List<String> previousQuestions, int questionNumber);
    InterviewEvaluation evaluateInterviewAnswer(InterviewQuestion question, String answer);
    InterviewFinalReview createInterviewFinalReview(String interviewTranscript, int averageScore);
}
