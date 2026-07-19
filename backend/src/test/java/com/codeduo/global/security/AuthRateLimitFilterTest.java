package com.codeduo.global.security;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import static org.assertj.core.api.Assertions.assertThat;

class AuthRateLimitFilterTest {
    @Test
    void rejectsAuthenticationRequestsAfterConfiguredLimit() throws Exception {
        AuthRateLimitFilter filter = new AuthRateLimitFilter(
                2,
                60,
                Clock.fixed(Instant.parse("2026-07-20T00:00:00Z"), ZoneOffset.UTC)
        );

        assertThat(invoke(filter).getStatus()).isEqualTo(200);
        assertThat(invoke(filter).getStatus()).isEqualTo(200);

        MockHttpServletResponse rejected = invoke(filter);
        assertThat(rejected.getStatus()).isEqualTo(429);
        assertThat(rejected.getHeader("Retry-After")).isEqualTo("60");
        assertThat(rejected.getContentAsString()).contains("요청이 너무 많습니다");
    }

    private MockHttpServletResponse invoke(AuthRateLimitFilter filter) throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/auth/login");
        request.setRemoteAddr("192.0.2.10");
        MockHttpServletResponse response = new MockHttpServletResponse();
        filter.doFilter(request, response, new MockFilterChain());
        return response;
    }
}
