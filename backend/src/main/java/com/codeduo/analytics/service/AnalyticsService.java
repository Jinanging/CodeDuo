package com.codeduo.analytics.service;

import com.codeduo.analytics.dto.AnalyticsDtos.*;
import com.codeduo.problem.type.Language;
import com.codeduo.submission.entity.Submission;
import com.codeduo.submission.repository.SubmissionRepository;
import com.codeduo.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final SubmissionRepository submissionRepository;

    @Transactional(readOnly = true)
    public AnalyticsResponse getAnalytics(User user) {
        List<Submission> submissions = submissionRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        if (submissions.isEmpty()) {
            return new AnalyticsResponse(
                    List.of(
                            new Weakness("Python", 0),
                            new Weakness("Java", 0),
                            new Weakness("C", 0),
                            new Weakness("C++", 0)
                    ),
                    weeklyActivity(submissions),
                    new Summary(0, 0, user.getStreakCount(), 0)
            );
        }

        List<Weakness> weakness = submissions.stream()
                .collect(Collectors.groupingBy(
                        submission -> submission.getProblem().getLanguage(),
                        () -> new EnumMap<>(Language.class),
                        Collectors.averagingInt(Submission::getScore)
                ))
                .entrySet().stream()
                .map(entry -> new Weakness(languageLabel(entry.getKey()), Math.round(entry.getValue().floatValue())))
                .sorted(Comparator.comparingInt(Weakness::score))
                .toList();

        int weeklySolved = weeklySolved(submissions);
        int accuracy = Math.round((float) submissions.stream().filter(Submission::isCorrect).count() * 100 / submissions.size());

        return new AnalyticsResponse(
                weakness,
                weeklyActivity(submissions),
                new Summary(submissions.size(), weeklySolved, user.getStreakCount(), accuracy)
        );
    }

    private List<Activity> weeklyActivity(List<Submission> submissions) {
        LocalDate monday = LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        Map<DayOfWeek, Long> counts = submissions.stream()
                .filter(submission -> submission.getCreatedAt() != null)
                .filter(submission -> !submission.getCreatedAt().toLocalDate().isBefore(monday))
                .collect(Collectors.groupingBy(
                        submission -> submission.getCreatedAt().getDayOfWeek(),
                        Collectors.counting()
                ));

        return List.of(
                new Activity("월", counts.getOrDefault(DayOfWeek.MONDAY, 0L).intValue()),
                new Activity("화", counts.getOrDefault(DayOfWeek.TUESDAY, 0L).intValue()),
                new Activity("수", counts.getOrDefault(DayOfWeek.WEDNESDAY, 0L).intValue()),
                new Activity("목", counts.getOrDefault(DayOfWeek.THURSDAY, 0L).intValue()),
                new Activity("금", counts.getOrDefault(DayOfWeek.FRIDAY, 0L).intValue()),
                new Activity("토", counts.getOrDefault(DayOfWeek.SATURDAY, 0L).intValue()),
                new Activity("일", counts.getOrDefault(DayOfWeek.SUNDAY, 0L).intValue())
        );
    }

    private int weeklySolved(List<Submission> submissions) {
        LocalDateTime mondayStart = LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).atStartOfDay();
        return (int) submissions.stream()
                .filter(submission -> submission.getCreatedAt() != null)
                .filter(submission -> !submission.getCreatedAt().isBefore(mondayStart))
                .count();
    }

    private String languageLabel(Language language) {
        return switch (language) {
            case PYTHON -> "Python";
            case JAVA -> "Java";
            case C -> "C";
            case CPP -> "C++";
        };
    }
}
