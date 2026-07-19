package com.codeduo.global.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class AuthRateLimitFilter extends OncePerRequestFilter {
    private static final int MAX_TRACKED_CLIENTS = 10_000;

    private final ConcurrentHashMap<String, Window> attempts = new ConcurrentHashMap<>();
    private final AtomicLong requestCounter = new AtomicLong();
    private final int maxAttempts;
    private final long windowMillis;
    private final Clock clock;

    @Autowired
    public AuthRateLimitFilter(
            @Value("${app.auth-rate-limit.max-attempts:10}") int maxAttempts,
            @Value("${app.auth-rate-limit.window-seconds:60}") long windowSeconds
    ) {
        this(maxAttempts, windowSeconds, Clock.systemUTC());
    }

    AuthRateLimitFilter(int maxAttempts, long windowSeconds, Clock clock) {
        this.maxAttempts = Math.max(1, maxAttempts);
        this.windowMillis = Math.max(1, windowSeconds) * 1_000;
        this.clock = clock;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        if (!"POST".equalsIgnoreCase(request.getMethod())) return true;
        String path = request.getRequestURI();
        return !"/api/auth/login".equals(path) && !"/api/auth/signup".equals(path);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        long now = clock.millis();
        if (requestCounter.incrementAndGet() % 100 == 0) {
            attempts.entrySet().removeIf(entry -> now - entry.getValue().startedAt() >= windowMillis);
        }

        String key = request.getRemoteAddr() + ':' + request.getRequestURI();
        if (!attempts.containsKey(key) && attempts.size() >= MAX_TRACKED_CLIENTS) {
            reject(response, windowMillis / 1_000);
            return;
        }

        Window window = attempts.compute(key, (ignored, current) -> {
            if (current == null || now - current.startedAt() >= windowMillis) {
                return new Window(now, 1);
            }
            return new Window(current.startedAt(), current.count() + 1);
        });

        if (window.count() > maxAttempts) {
            long retryAfterSeconds = Math.max(1, (windowMillis - (now - window.startedAt()) + 999) / 1_000);
            reject(response, retryAfterSeconds);
            return;
        }
        filterChain.doFilter(request, response);
    }

    private void reject(HttpServletResponse response, long retryAfterSeconds) throws IOException {
        response.setStatus(429);
        response.setHeader("Retry-After", String.valueOf(retryAfterSeconds));
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"success\":false,\"message\":\"로그인 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.\",\"data\":null}");
    }

    private record Window(long startedAt, int count) {}
}
