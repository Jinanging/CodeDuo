package com.codeduo.judge.dto;

public record JudgeResponse(
        String stdout,
        String stderr,
        String compileOutput,
        String status,
        Long time,
        Long memory
) {
    public boolean accepted(String expectedOutput) {
        return "Accepted".equalsIgnoreCase(status) && normalize(stdout).equals(normalize(expectedOutput));
    }

    private static String normalize(String value) {
        return value == null ? "" : value.strip();
    }
}
