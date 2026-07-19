package com.codeduo.judge.service;

import com.codeduo.judge.dto.JudgeRequest;
import com.codeduo.judge.dto.JudgeResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Arrays;
import java.util.Map;
import java.time.Duration;

/**
 * Judge0(코드 실행 엔진) 클라이언트.
 *  - judge0.mock=true 또는 base-url 미설정 → mock 동작(인프라 없이 개발 가능)
 *  - 실제: POST {base-url}/submissions?base64_encoded=false&wait=true 로 소스+stdin 전송 → stdout 수신
 *  - RapidAPI 사용 시 judge0.rapidapi-key 설정하면 인증 헤더 자동 추가
 */
@Component
@Slf4j
public class Judge0Client {

    @Value("${judge0.mock:true}")
    private boolean mock;
    @Value("${judge0.base-url:}")
    private String baseUrl;
    @Value("${judge0.rapidapi-key:}")
    private String rapidApiKey;
    @Value("${judge0.rapidapi-host:judge0-ce.p.rapidapi.com}")
    private String rapidApiHost;

    private final RestClient rest;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Judge0Client() {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(5));
        requestFactory.setReadTimeout(Duration.ofSeconds(20));
        this.rest = RestClient.builder().requestFactory(requestFactory).build();
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    public JudgeResponse execute(JudgeRequest request) {
        if (mock || baseUrl == null || baseUrl.isBlank()) {
            return executeMock(request);
        }

        Map<String, Object> body = Map.of(
                "source_code", request.sourceCode() == null ? "" : request.sourceCode(),
                "language_id", request.languageId(),
                "stdin", request.stdin() == null ? "" : request.stdin());

        try {
            String jsonBody = objectMapper.writeValueAsString(body);
            RestClient.RequestBodySpec spec = rest.post()
                    .uri(baseUrl.replaceAll("/+$", "") + "/submissions?base64_encoded=false&wait=true")
                    .contentType(MediaType.APPLICATION_JSON);
            if (rapidApiKey != null && !rapidApiKey.isBlank()) {
                spec = spec.header("X-RapidAPI-Key", rapidApiKey).header("X-RapidAPI-Host", rapidApiHost);
            }
            Map resp = spec.body(jsonBody).retrieve().body(Map.class);
            if (resp == null) return new JudgeResponse("", "Judge0 응답이 비어 있습니다.", null, "Judge0 Error", null, null);

            String stdout = str(resp.get("stdout")).strip();
            String stderr = str(resp.get("stderr"));
            String compile = str(resp.get("compile_output"));
            Object st = resp.get("status");
            String status = (st instanceof Map<?, ?> m && m.get("description") != null)
                    ? m.get("description").toString() : "unknown";
            return new JudgeResponse(stdout, stderr, compile, status, toLong(resp.get("time"), 1000), toLong(resp.get("memory"), 1));
        } catch (Exception e) {
            log.error("Judge0 요청 실패", e);
            return new JudgeResponse("", "코드 실행 서버 요청에 실패했습니다.", null, "Judge0 Error", null, null);
        }
    }

    /**
     * 로컬 UI 흐름 확인용 제한된 실행기다. 정답 출력을 그대로 돌려주지 않으며,
     * 인식하지 못한 코드는 실패시켜 실제 Judge0 사용이 필요하다는 점을 명확히 한다.
     */
    private JudgeResponse executeMock(JudgeRequest request) {
        String source = request.sourceCode() == null ? "" : request.sourceCode();
        String compact = source.replaceAll("\\s+", "");
        long[] numbers;
        try {
            numbers = Arrays.stream((request.stdin() == null ? "" : request.stdin()).strip().split("\\s+"))
                    .filter(value -> !value.isBlank())
                    .mapToLong(Long::parseLong)
                    .toArray();
        } catch (NumberFormatException e) {
            return new JudgeResponse("", "Mock 실행기는 정수 입력만 지원합니다.", null, "Mock Unsupported", null, null);
        }

        String output = inferMockOutput(compact, numbers);
        if (output == null) {
            return new JudgeResponse(
                    "",
                    "Mock 실행기가 해석할 수 없는 코드입니다. JUDGE0_MOCK=false로 실제 Judge0를 연결하세요.",
                    null,
                    "Mock Unsupported",
                    null,
                    null
            );
        }
        return new JudgeResponse(output, null, null, "Accepted", 1L, 1024L);
    }

    private String inferMockOutput(String source, long[] numbers) {
        if (numbers.length >= 2 && source.contains("a+b")) {
            return String.valueOf(numbers[0] + numbers[1]);
        }
        if (numbers.length >= 1 && source.contains("%2") && source.contains("even") && source.contains("odd")) {
            return numbers[0] % 2 == 0 ? "even" : "odd";
        }
        if (numbers.length >= 1 && source.contains("max(nums)")) {
            return String.valueOf(Arrays.stream(numbers).max().orElseThrow());
        }
        if (numbers.length >= 2 && (source.contains("Math.max(a,b)") || source.contains("a>b?a:b"))) {
            return String.valueOf(Math.max(numbers[0], numbers[1]));
        }
        if (numbers.length >= 2 && (source.contains("Math.min(a,b)") || source.contains("a<b?a:b"))) {
            return String.valueOf(Math.min(numbers[0], numbers[1]));
        }
        if (numbers.length >= 1 && source.contains("n<0?-n:n")) {
            return String.valueOf(Math.abs(numbers[0]));
        }
        if (numbers.length >= 1 && source.contains("n*n")) {
            return String.valueOf(numbers[0] * numbers[0]);
        }
        return null;
    }

    private static String str(Object o) { return o == null ? "" : o.toString(); }

    private static Long toLong(Object o, double scale) {
        try { return o == null ? null : (long) (Double.parseDouble(o.toString()) * scale); }
        catch (Exception e) { return null; }
    }
}
