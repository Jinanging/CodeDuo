package com.codeduo.global.config;

import com.codeduo.course.entity.Course;
import com.codeduo.course.repository.CourseRepository;
import com.codeduo.lesson.entity.Lesson;
import com.codeduo.lesson.repository.LessonRepository;
import com.codeduo.problem.entity.Problem;
import com.codeduo.problem.repository.ProblemRepository;
import com.codeduo.problem.type.Language;
import com.codeduo.problem.type.ProblemType;
import com.codeduo.judge.dto.JudgeTestCase;
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
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    @Bean
    CommandLineRunner initData() {
        return args -> {
            ObjectMapper mapper = new ObjectMapper();
            disableLegacyDemoPasswords();
            createAdminAccountIfConfigured();
            seedPublicCatalogIfEmpty(mapper);
            applyPrivateGradingData(mapper);
        };
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

    private record GradingSecret(
            String answer,
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
