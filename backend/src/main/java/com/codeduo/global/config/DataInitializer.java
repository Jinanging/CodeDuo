package com.codeduo.global.config;

import com.codeduo.course.entity.Course;
import com.codeduo.course.repository.CourseRepository;
import com.codeduo.friend.entity.StudyGroup;
import com.codeduo.friend.repository.StudyGroupRepository;
import com.codeduo.lesson.entity.Lesson;
import com.codeduo.lesson.repository.LessonRepository;
import com.codeduo.problem.entity.Problem;
import com.codeduo.problem.repository.ProblemRepository;
import com.codeduo.problem.type.Language;
import com.codeduo.problem.type.ProblemType;
import com.codeduo.judge.dto.JudgeTestCase;
import com.codeduo.submission.repository.SubmissionRepository;
import com.codeduo.user.entity.User;
import com.codeduo.user.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.EnumMap;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

/**
 * 시드 데이터:
 *  - 코스 4개 = 언어 (Python / Java / C / C++)
 *  - 각 코스의 레슨 3개 = 난이도 (초급 / 중급 / 고급)
 *  - 문제 36개 = seed-problems.json (언어 x 난이도 당 3문제) 로드
 *  - 정답과 숨김 테스트 = DB에 저장하고, 외부 비밀 파일이 있으면 실행 시 보강
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final SubmissionRepository submissionRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${grading.secrets-path:}")
    private String gradingSecretsPath;

    @Value("${grading.require-secrets:false}")
    private boolean requireGradingSecrets;

    @Value("${app.admin.bootstrap-email:}")
    private String adminBootstrapEmail;

    @Value("${app.admin.bootstrap-password:}")
    private String adminBootstrapPassword;

    @Value("${app.admin.bootstrap-nickname:관리자}")
    private String adminBootstrapNickname;

    private static final String[] DIFF_NAME = {"초급", "중급", "고급"};
    private static final String[] DIFF_DESC = {
            "기초 문법과 개념 익히기", "코드 작성과 응용 연습", "심화 개념과 서술형 도전"
    };
    private static final ZoneId STUDY_ZONE = ZoneId.of("Asia/Seoul");

    @Bean
    CommandLineRunner initData() {
        return args -> {
            ObjectMapper mapper = new ObjectMapper();
            disableLegacyDemoPasswords();
            createAdminAccountIfConfigured();
            seedPublicCatalogIfEmpty(mapper);
            seedSocialDataIfEmpty();
            applyPrivateGradingData(mapper);
            normalizeMultipleChoiceAnswers(mapper);
            recalculateStudyStreaksFromSubmissions();
        };
    }

    private void recalculateStudyStreaksFromSubmissions() {
        LocalDate today = LocalDate.now(STUDY_ZONE);
        List<User> changedUsers = new ArrayList<>();
        for (User user : userRepository.findAll()) {
            List<LocalDate> studiedDates = submissionRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                    .filter(submission -> submission.getCreatedAt() != null)
                    .map(submission -> submission.getCreatedAt().toLocalDate())
                    .distinct()
                    .toList();
            if (studiedDates.isEmpty()) continue;

            LocalDate lastStudiedDate = studiedDates.get(0);
            user.setLastStudiedDate(lastStudiedDate);
            user.setStreakCount(countCurrentStreak(studiedDates, today));
            changedUsers.add(user);
        }
        userRepository.saveAll(changedUsers);
    }

    private int countCurrentStreak(List<LocalDate> studiedDates, LocalDate today) {
        LocalDate latest = studiedDates.get(0);
        if (!latest.equals(today) && !latest.equals(today.minusDays(1))) return 0;

        Set<LocalDate> dateSet = new HashSet<>(studiedDates);
        int streak = 0;
        LocalDate cursor = latest;
        while (dateSet.contains(cursor)) {
            streak += 1;
            cursor = cursor.minusDays(1);
        }
        return streak;
    }

    private void seedSocialDataIfEmpty() {
        seedStudyGroup("Python 스터디", Language.PYTHON);
        seedStudyGroup("알고리즘 크루", Language.CPP);
        seedStudyGroup("Java 백엔드 팀", Language.JAVA);
        seedStudyGroup("C 시스템 마스터", Language.C);

        seedCompanionUser("algo.master@codeduo.local", "algo_master", "AM", 4200, 14);
        seedCompanionUser("java.wizard@codeduo.local", "java_wizard", "JW", 3100, 9);
        seedCompanionUser("c.pointer@codeduo.local", "c_pointer", "CP", 1800, 3);
        seedCompanionUser("py.snake@codeduo.local", "py_snake", "PS", 2900, 6);
        seedCompanionUser("bit.flip@codeduo.local", "bit_flip", "BF", 5500, 21);
    }

    private void seedStudyGroup(String name, Language language) {
        if (studyGroupRepository.existsByName(name)) return;
        studyGroupRepository.save(StudyGroup.builder()
                .name(name)
                .language(language)
                .build());
    }

    private void seedCompanionUser(String email, String nickname, String avatar, int xp, int streak) {
        if (userRepository.existsByEmail(email)) return;
        userRepository.save(User.builder()
                .email(email)
                .password(passwordEncoder.encode(UUID.randomUUID() + "-seed-companion"))
                .nickname(nickname)
                .avatar(avatar)
                .xp(xp)
                .streakCount(streak)
                .hearts(5)
                .build());
    }

    private void createAdminAccountIfConfigured() {
        if (adminBootstrapEmail == null || adminBootstrapEmail.isBlank()) return;
        if (adminBootstrapPassword == null || adminBootstrapPassword.isBlank()) {
            throw new IllegalStateException("ADMIN_BOOTSTRAP_EMAIL을 설정했다면 ADMIN_BOOTSTRAP_PASSWORD도 설정해야 합니다.");
        }

        userRepository.findByEmail(adminBootstrapEmail).ifPresentOrElse(
                user -> log.info("관리자 부트스트랩 계정이 이미 존재합니다: {}", user.getEmail()),
                () -> {
                    User admin = User.builder()
                            .email(adminBootstrapEmail)
                            .password(passwordEncoder.encode(adminBootstrapPassword))
                            .nickname(adminBootstrapNickname)
                            .avatar(adminBootstrapNickname.length() >= 2
                                    ? adminBootstrapNickname.substring(0, 2).toUpperCase()
                                    : adminBootstrapNickname.toUpperCase())
                            .xp(0)
                            .streakCount(0)
                            .hearts(5)
                            .premium(true)
                            .build();
                    userRepository.save(admin);
                    log.warn("관리자 부트스트랩 계정을 생성했습니다: {}", adminBootstrapEmail);
                }
        );
    }

    private void disableLegacyDemoPasswords() {
        List.of("premium@test.com", "demo@codeduo.dev", "premium@codeduo.dev").forEach(email ->
                userRepository.findByEmail(email).ifPresent(user -> {
                    if (user.getPassword() != null && passwordEncoder.matches("password", user.getPassword())) {
                        user.setPassword(passwordEncoder.encode(UUID.randomUUID() + "-disabled-legacy-account"));
                        userRepository.save(user);
                        log.warn("공개된 기본 비밀번호를 사용하던 레거시 데모 계정의 로그인을 비활성화했습니다: {}", email);
                    }
                })
        );
    }

    private void seedPublicCatalogIfEmpty(ObjectMapper mapper) throws Exception {
        if (courseRepository.count() > 0) return;

        Map<Language, Course> courses = new EnumMap<>(Language.class);
        courses.put(Language.PYTHON, courseRepository.save(course("Python", Language.PYTHON, "입문부터 심화까지 Python")));
        courses.put(Language.JAVA, courseRepository.save(course("Java", Language.JAVA, "백엔드 입문을 위한 Java")));
        courses.put(Language.C, courseRepository.save(course("C", Language.C, "시스템 프로그래밍 C 기본기")));
        courses.put(Language.CPP, courseRepository.save(course("C++", Language.CPP, "알고리즘 학습을 위한 C++")));

        Map<String, Lesson> lessons = new HashMap<>();
        for (Language lang : Language.values()) {
            for (int difficulty = 1; difficulty <= 3; difficulty++) {
                Lesson saved = lessonRepository.save(
                        lesson(courses.get(lang), DIFF_NAME[difficulty - 1], DIFF_DESC[difficulty - 1], difficulty));
                lessons.put(lang.name() + "-" + difficulty, saved);
            }
        }

        List<Map<String, Object>> seed;
        try (InputStream input = new ClassPathResource("seed-problems.json").getInputStream()) {
            seed = mapper.readValue(input, new TypeReference<>() {});
        }

        Map<String, Integer> order = new HashMap<>();
        for (Map<String, Object> item : seed) {
            Language language = Language.valueOf((String) item.get("language"));
            int difficulty = ((Number) item.get("difficulty")).intValue();
            String lessonKey = language.name() + "-" + difficulty;
            int orderIndex = order.merge(lessonKey, 1, Integer::sum);

            problemRepository.save(Problem.builder()
                    .lesson(lessons.get(lessonKey))
                    .type(ProblemType.valueOf((String) item.get("type")))
                    .language(language)
                    .difficulty(difficulty)
                    .title((String) item.get("title"))
                    .description((String) item.get("description"))
                    .optionsJson((String) item.get("optionsJson"))
                    .hint((String) item.get("hint"))
                    .codeTemplate((String) item.get("codeTemplate"))
                    .testInput((String) item.get("testInput"))
                    .expectedOutput((String) item.get("expectedOutput"))
                    .tagsJson("[]")
                    .orderIndex(orderIndex)
                    .build());
        }
    }

    private void applyPrivateGradingData(ObjectMapper mapper) throws Exception {
        Map<String, GradingSecret> secrets = loadGradingSecrets(mapper);
        List<Problem> problems = problemRepository.findAll();
        if (secrets.isEmpty()) {
            if (requireGradingSecrets && !problems.isEmpty()) {
                throw new IllegalStateException("필수 채점 비밀정보가 없습니다.");
            }
            log.info("채점 비밀 파일이 없어 기존 DB 채점 정보를 유지합니다.");
            return;
        }

        List<String> missingKeys = problems.stream()
                .filter(problem -> !isComplete(problem, secrets.get(problemKey(problem))))
                .map(this::problemKey)
                .toList();
        if (requireGradingSecrets && !missingKeys.isEmpty()) {
            throw new IllegalStateException("필수 채점 비밀정보가 누락되었습니다: " + String.join(", ", missingKeys));
        }

        for (Problem problem : problems) {
            GradingSecret secret = secrets.get(problemKey(problem));
            if (secret == null) continue;
            if (secret.answer() != null) problem.setAnswer(secret.answer());
            if (secret.correctOptionIndex() != null) problem.setCorrectOptionIndex(secret.correctOptionIndex());
            if (secret.rubric() != null) problem.setRubric(secret.rubric());
            if (secret.explanation() != null) problem.setExplanation(secret.explanation());
            if (secret.testCases() != null && !secret.testCases().isEmpty()) {
                problem.setTestCasesJson(mapper.writeValueAsString(secret.testCases()));
            }
        }
        problemRepository.saveAll(problems);

        if (!missingKeys.isEmpty()) {
            log.warn("채점 비밀정보가 없는 문제 {}개는 기존 DB 채점 정보를 유지합니다.", missingKeys.size());
        }
    }

    private Map<String, GradingSecret> loadGradingSecrets(ObjectMapper mapper) throws Exception {
        if (gradingSecretsPath == null || gradingSecretsPath.isBlank()) {
            if (requireGradingSecrets) throw new IllegalStateException("GRADING_SECRETS_PATH가 설정되지 않았습니다.");
            return Map.of();
        }

        Path path = Path.of(gradingSecretsPath).toAbsolutePath().normalize();
        if (!Files.isRegularFile(path)) {
            if (requireGradingSecrets) throw new IllegalStateException("채점 비밀 파일을 찾을 수 없습니다: " + path);
            log.warn("채점 비밀 파일이 없어 채점을 비활성화합니다: {}", path);
            return Map.of();
        }
        try (InputStream input = Files.newInputStream(path)) {
            return mapper.readValue(input, new TypeReference<>() {});
        }
    }

    private boolean isComplete(Problem problem, GradingSecret secret) {
        if (secret == null) return false;
        return switch (problem.getType()) {
            case CODE -> secret.testCases() != null && !secret.testCases().isEmpty();
            case ESSAY -> secret.rubric() != null && !secret.rubric().isBlank();
            default -> secret.answer() != null && !secret.answer().isBlank();
        };
    }

    private String problemKey(Problem problem) {
        return problem.getLanguage().name() + "-" + problem.getDifficulty() + "-" + problem.getOrderIndex();
    }

    private void normalizeMultipleChoiceAnswers(ObjectMapper mapper) {
        List<Problem> changed = problemRepository.findAll().stream()
                .filter(problem -> problem.getType() == ProblemType.MULTIPLE_CHOICE)
                .filter(problem -> migrateCorrectOptionIndex(problem, mapper))
                .toList();

        if (!changed.isEmpty()) {
            problemRepository.saveAll(changed);
            log.info("객관식 정답 인덱스 {}개를 기존 answer 값에서 마이그레이션했습니다.", changed.size());
        }
    }

    private boolean migrateCorrectOptionIndex(Problem problem, ObjectMapper mapper) {
        boolean changed = false;

        if (problem.getCorrectOptionIndex() == null) {
            Optional<List<String>> options = parseOptions(problem, mapper);
            Optional<Integer> index = parseAnswerIndex(problem.getAnswer(), options.map(List::size).orElse(0))
                    .or(() -> findAnswerTextIndex(problem, options));
            if (index.isPresent()) {
                problem.setCorrectOptionIndex(index.get());
                changed = true;
            }
        }

        if (problem.getAnswer() != null) {
            problem.setAnswer(null);
            changed = true;
        }

        return changed;
    }

    private Optional<Integer> parseAnswerIndex(String answer, int optionCount) {
        if (answer == null || answer.isBlank()) return Optional.empty();
        try {
            int index = Integer.parseInt(answer.strip());
            return index >= 0 && index < optionCount ? Optional.of(index) : Optional.empty();
        } catch (NumberFormatException ignored) {
            return Optional.empty();
        }
    }

    private Optional<Integer> findAnswerTextIndex(Problem problem, Optional<List<String>> options) {
        if (problem.getAnswer() == null || options.isEmpty()) {
            return Optional.empty();
        }
        String expected = problem.getAnswer().strip();
        List<String> optionList = options.get();
        for (int i = 0; i < optionList.size(); i++) {
            if (optionList.get(i) != null && optionList.get(i).strip().equals(expected)) {
                return Optional.of(i);
            }
        }
        return Optional.empty();
    }

    private Optional<List<String>> parseOptions(Problem problem, ObjectMapper mapper) {
        if (problem.getOptionsJson() == null || problem.getOptionsJson().isBlank()) return Optional.empty();
        try {
            return Optional.of(mapper.readValue(problem.getOptionsJson(), new TypeReference<>() {}));
        } catch (Exception ignored) {
            return Optional.empty();
        }
    }

    private record GradingSecret(
            String answer,
            Integer correctOptionIndex,
            String rubric,
            String explanation,
            List<JudgeTestCase> testCases
    ) {}

    private Course course(String title, Language language, String description) {
        return Course.builder().title(title).language(language).description(description).level("MIXED").build();
    }

    private Lesson lesson(Course course, String title, String description, int orderIndex) {
        return Lesson.builder().course(course).title(title).description(description).orderIndex(orderIndex).build();
    }
}
