package com.codeduo.judge.service;

import com.codeduo.judge.dto.JudgeRequest;
import com.codeduo.judge.dto.JudgeResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

/**
 * Judge0(코드 실행 엔진) 클라이언트.
 *  - judge0.mock=true 또는 base-url 미설정 → mock 동작(인프라 없이 개발 가능)
 *  - 실제: POST {base-url}/submissions?base64_encoded=false&wait=true 로 소스+stdin 전송 → stdout 수신
 *  - RapidAPI 사용 시 judge0.rapidapi-key 설정하면 인증 헤더 자동 추가
 */
@Component
public class Judge0Client {

    @Value("${judge0.mock:true}")
    private boolean mock;
    @Value("${judge0.base-url:}")
    private String baseUrl;
    @Value("${judge0.rapidapi-key:}")
    private String rapidApiKey;
    @Value("${judge0.rapidapi-host:judge0-ce.p.rapidapi.com}")
    private String rapidApiHost;

    private final RestClient rest = RestClient.create();

    @SuppressWarnings({"unchecked", "rawtypes"})
    public JudgeResponse execute(JudgeRequest request, String expectedOutput) {
        // 미연결 시 mock
        if (mock || baseUrl == null || baseUrl.isBlank()) {
            return new JudgeResponse(inferMockOutput(request, expectedOutput), null, null, "Accepted", 120L, 1024L);
        }

        Map<String, Object> body = Map.of(
                "source_code", request.sourceCode() == null ? "" : request.sourceCode(),
                "language_id", request.languageId(),
                "stdin", request.stdin() == null ? "" : request.stdin());

        try {
            RestClient.RequestBodySpec spec = rest.post()
                    .uri(baseUrl.replaceAll("/+$", "") + "/submissions?base64_encoded=false&wait=true")
                    .contentType(MediaType.APPLICATION_JSON);
            if (rapidApiKey != null && !rapidApiKey.isBlank()) {
                spec = spec.header("X-RapidAPI-Key", rapidApiKey).header("X-RapidAPI-Host", rapidApiHost);
            }
            Map resp = spec.body(body).retrieve().body(Map.class);
            if (resp == null) return new JudgeResponse("", "empty response", null, "error", null, null);

            String stdout = str(resp.get("stdout")).strip();
            String stderr = str(resp.get("stderr"));
            String compile = str(resp.get("compile_output"));
            Object st = resp.get("status");
            String status = (st instanceof Map<?, ?> m && m.get("description") != null)
                    ? m.get("description").toString() : "unknown";
            return new JudgeResponse(stdout, stderr, compile, status, toLong(resp.get("time"), 1000), toLong(resp.get("memory"), 1));
        } catch (Exception e) {
            return new JudgeResponse("", e.getMessage(), null, "error", null, null);
        }
    }

    private String inferMockOutput(JudgeRequest request, String expectedOutput) {
        String source = request.sourceCode() == null ? "" : request.sourceCode();
        String stdin = request.stdin();
        if (source.contains("a + b") || source.contains("a+b")) {
            String[] parts = stdin == null ? new String[0] : stdin.trim().split("\\s+");
            if (parts.length >= 2) {
                try { return String.valueOf(Integer.parseInt(parts[0]) + Integer.parseInt(parts[1])); }
                catch (NumberFormatException ignored) { return expectedOutput; }
            }
        }
        return expectedOutput; // mock: 그 외에는 기대값 통과 처리
    }

    private static String str(Object o) { return o == null ? "" : o.toString(); }

    private static Long toLong(Object o, double scale) {
        try { return o == null ? null : (long) (Double.parseDouble(o.toString()) * scale); }
        catch (Exception e) { return null; }
    }
}
