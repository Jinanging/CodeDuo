package com.codeduo.judge.service;

import com.codeduo.judge.dto.JudgeRequest;
import com.codeduo.judge.dto.JudgeResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;

class Judge0ClientTest {
    private Judge0Client client;

    @BeforeEach
    void setUp() {
        client = new Judge0Client();
        ReflectionTestUtils.setField(client, "mock", true);
    }

    @Test
    void mockExecutesSupportedSumWithoutUsingExpectedOutput() {
        JudgeResponse response = client.execute(new JudgeRequest(
                "a, b = map(int, input().split())\nprint(a + b)",
                71,
                "10 20"
        ));

        assertThat(response.status()).isEqualTo("Accepted");
        assertThat(response.stdout()).isEqualTo("30");
    }

    @Test
    void mockRejectsCodeItCannotActuallyEvaluate() {
        JudgeResponse response = client.execute(new JudgeRequest(
                "a, b = map(int, input().split())\n# 아직 출력 코드가 없음",
                71,
                "10 20"
        ));

        assertThat(response.status()).isEqualTo("Mock Unsupported");
        assertThat(response.stdout()).isEmpty();
    }

    @Test
    void realClientSendsJudge0FieldsAsJson() throws Exception {
        AtomicReference<String> requestBody = new AtomicReference<>();
        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/submissions", exchange -> {
            requestBody.set(new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8));
            byte[] response = """
                    {"stdout":"5\\n","time":"0.01","memory":1024,"stderr":null,
                     "compile_output":null,"status":{"id":3,"description":"Accepted"}}
                    """.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.length);
            exchange.getResponseBody().write(response);
            exchange.close();
        });
        server.start();

        try {
            ReflectionTestUtils.setField(client, "mock", false);
            ReflectionTestUtils.setField(client, "baseUrl", "http://127.0.0.1:" + server.getAddress().getPort());
            ReflectionTestUtils.setField(client, "rapidApiKey", "");

            JudgeResponse response = client.execute(new JudgeRequest("print(2 + 3)", 71, "2 3"));
            Map<String, Object> sent = new ObjectMapper().readValue(requestBody.get(), new TypeReference<>() {});

            assertThat(sent)
                    .containsEntry("source_code", "print(2 + 3)")
                    .containsEntry("language_id", 71)
                    .containsEntry("stdin", "2 3");
            assertThat(response.status()).isEqualTo("Accepted");
            assertThat(response.stdout()).isEqualTo("5");
        } finally {
            server.stop(0);
        }
    }
}
