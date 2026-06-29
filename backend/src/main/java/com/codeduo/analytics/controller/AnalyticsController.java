package com.codeduo.analytics.controller;

import com.codeduo.analytics.dto.AnalyticsDtos.AnalyticsResponse;
import com.codeduo.analytics.service.AnalyticsService;
import com.codeduo.global.response.ApiResponse;
import com.codeduo.global.security.CurrentUser;
import com.codeduo.user.entity.User;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Analytics")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/analytics")
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    @GetMapping
    public ApiResponse<AnalyticsResponse> analytics(@CurrentUser User user) {
        return ApiResponse.ok("분석 데이터를 조회했습니다.", analyticsService.getAnalytics(user));
    }
}
