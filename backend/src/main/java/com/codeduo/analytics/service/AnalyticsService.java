package com.codeduo.analytics.service;

import com.codeduo.analytics.dto.AnalyticsDtos.*;
import com.codeduo.user.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnalyticsService {
    public AnalyticsResponse getAnalytics(User user) {
        return new AnalyticsResponse(
                List.of(
                        new Weakness("Python 기초", 82),
                        new Weakness("Java OOP", 48),
                        new Weakness("C 포인터", 35),
                        new Weakness("C++ STL", 62),
                        new Weakness("알고리즘", 55),
                        new Weakness("자료구조", 70)
                ),
                List.of(
                        new Activity("월", 4),
                        new Activity("화", 7),
                        new Activity("수", 2),
                        new Activity("목", 9),
                        new Activity("금", 5),
                        new Activity("토", 11),
                        new Activity("일", 6)
                ),
                new Summary(user.getXp() / 10, 44, user.getStreakCount(), 78)
        );
    }
}
