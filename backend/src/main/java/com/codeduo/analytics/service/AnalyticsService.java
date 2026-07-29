package com.codeduo.analytics.service;

import com.codeduo.analytics.dto.AnalyticsDtos.*;
import com.codeduo.ai.service.AiClient;
import com.codeduo.global.exception.BusinessException;
import com.codeduo.problem.type.Language;
import com.codeduo.problem.type.ProblemType;
import com.codeduo.submission.entity.Submission;
import com.codeduo.submission.repository.SubmissionRepository;
import com.codeduo.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final SubmissionRepository submissionRepository;
    private final AiClient aiClient;

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

    @Transactional(readOnly = true)
    public AiLearningReport getAiReport(User user) {
        if (!user.isPremium()) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "AI 학습 리포트는 프리미엄 전용 기능입니다.");
        }

        List<Submission> submissions = submissionRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return aiClient.createLearningReport(buildLearningContext(user, submissions));
    }

    private String buildLearningContext(User user, List<Submission> submissions) {
        if (submissions.isEmpty()) {
            return """
                    사용자는 아직 문제 풀이 기록이 없다.
                    프리미엄 학습 리포트에서는 데이터가 부족하다는 점과 첫 학습을 시작하기 위한 가벼운 다음 행동을 제안해야 한다.
                    """;
        }

        Map<Language, List<Submission>> byLanguage = submissions.stream()
                .collect(Collectors.groupingBy(
                        submission -> submission.getProblem().getLanguage(),
                        () -> new EnumMap<>(Language.class),
                        Collectors.toList()
                ));
        Map<ProblemType, List<Submission>> byType = submissions.stream()
                .collect(Collectors.groupingBy(
                        submission -> submission.getProblem().getType(),
                        LinkedHashMap::new,
                        Collectors.toList()
                ));

        String languageSummary = byLanguage.entrySet().stream()
                .map(entry -> "- %s: 제출 %d회, 평균 점수 %d점, 오답 %d회".formatted(
                        languageLabel(entry.getKey()),
                        entry.getValue().size(),
                        averageScore(entry.getValue()),
                        wrongCount(entry.getValue())
                ))
                .collect(Collectors.joining("\n"));

        String typeSummary = byType.entrySet().stream()
                .map(entry -> "- %s: 제출 %d회, 평균 점수 %d점, 오답 %d회".formatted(
                        problemTypeLabel(entry.getKey()),
                        entry.getValue().size(),
                        averageScore(entry.getValue()),
                        wrongCount(entry.getValue())
                ))
                .collect(Collectors.joining("\n"));

        String recentSubmissions = submissions.stream()
                .limit(12)
                .map(submission -> "- %s / %s / %s / %d점 / %s / %s".formatted(
                        dateLabel(submission),
                        languageLabel(submission.getProblem().getLanguage()),
                        problemTypeLabel(submission.getProblem().getType()),
                        submission.getScore(),
                        submission.isCorrect() ? "해결" : "다시 볼 문제",
                        safe(submission.getProblem().getTitle())
                ))
                .collect(Collectors.joining("\n"));

        String recentWrongs = submissions.stream()
                .filter(submission -> !submission.isCorrect())
                .limit(8)
                .map(submission -> "- %s / %s / %s / %s".formatted(
                        languageLabel(submission.getProblem().getLanguage()),
                        problemTypeLabel(submission.getProblem().getType()),
                        safe(submission.getProblem().getTitle()),
                        safe(submission.getResultMessage())
                ))
                .collect(Collectors.joining("\n"));

        return """
                사용자: %s
                총 제출 수: %d
                이번 주 풀이 수: %d
                연속 학습일: %d

                언어별 기록:
                %s

                문제 유형별 기록:
                %s

                최근 풀이:
                %s

                최근 다시 볼 문제:
                %s
                """.formatted(
                safe(user.getNickname()),
                submissions.size(),
                weeklySolved(submissions),
                user.getStreakCount(),
                languageSummary,
                typeSummary,
                recentSubmissions,
                recentWrongs.isBlank() ? "없음" : recentWrongs
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

    private String problemTypeLabel(ProblemType type) {
        return switch (type) {
            case MULTIPLE_CHOICE -> "객관식";
            case FILL_BLANK -> "빈칸";
            case SHORT_ANSWER -> "주관식";
            case CODE -> "코딩";
            case ESSAY -> "서술형";
        };
    }

    private int averageScore(List<Submission> submissions) {
        if (submissions.isEmpty()) return 0;
        return Math.round((float) submissions.stream().mapToInt(Submission::getScore).sum() / submissions.size());
    }

    private int wrongCount(List<Submission> submissions) {
        return (int) submissions.stream().filter(submission -> !submission.isCorrect()).count();
    }

    private String dateLabel(Submission submission) {
        return submission.getCreatedAt() == null ? "날짜 없음" : submission.getCreatedAt().toLocalDate().toString();
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}
