package com.codeduo.judge.dto;

public record JudgeRequest(String sourceCode, Integer languageId, String stdin) {
}
