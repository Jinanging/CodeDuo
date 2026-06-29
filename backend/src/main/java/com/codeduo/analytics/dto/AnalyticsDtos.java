package com.codeduo.analytics.dto;

import java.util.List;

public class AnalyticsDtos {
    public record Weakness(String subject, int score) {}
    public record Activity(String day, int solved) {}
    public record Summary(int totalSolved, int weeklySolved, int streak, int accuracy) {}
    public record AnalyticsResponse(List<Weakness> weakness, List<Activity> activity, Summary summary) {}
}
