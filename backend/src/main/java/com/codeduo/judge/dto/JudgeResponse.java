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

    public String errorDetail() {
        if (compileOutput != null && !compileOutput.isBlank()) {
            return compileOutput.strip();
        }
        if (stderr != null && !stderr.isBlank()) {
            return stderr.strip();
        }
        return null;
    }

    private static String normalize(String value) {
        return value == null ? "" : value.strip();
    }
}
