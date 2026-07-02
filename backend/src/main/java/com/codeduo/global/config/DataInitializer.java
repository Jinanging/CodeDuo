package com.codeduo.global.config;

import com.codeduo.course.entity.Course;
import com.codeduo.course.repository.CourseRepository;
import com.codeduo.lesson.entity.Lesson;
import com.codeduo.lesson.repository.LessonRepository;
import com.codeduo.problem.entity.Problem;
import com.codeduo.problem.repository.ProblemRepository;
import com.codeduo.problem.type.Language;
import com.codeduo.problem.type.ProblemType;
import com.codeduo.user.entity.User;
import com.codeduo.user.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.InputStream;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 시드 데이터:
 *  - 코스 4개 = 언어 (Python / Java / C / C++)
 *  - 각 코스의 레슨 3개 = 난이도 (초급 / 중급 / 고급)
 *  - 문제 36개 = seed-problems.json (언어 x 난이도 당 3문제) 로드
 */
@Configuration
@RequiredArgsConstructor
public class DataInitializer {
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String[] DIFF_NAME = {"초급", "중급", "고급"};
    private static final String[] DIFF_DESC = {
            "기초 문법과 개념 익히기", "코드 작성과 응용 연습", "심화 개념과 서술형 도전"
    };

    @Bean
    CommandLineRunner initData() {
        return args -> {
            ObjectMapper mapper = new ObjectMapper();

            // 프리미엄 계정(premium@test.com) - DB가 이미 채워져 있어도 없으면 추가
            if (!userRepository.existsByEmail("premium@test.com")) {
                userRepository.save(User.builder()
                        .email("premium@test.com").password(passwordEncoder.encode("password"))
                        .nickname("admin").avatar("AD").xp(0).streakCount(0).hearts(5).premium(true).build());
            }

            if (courseRepository.count() > 0) {
                return;
            }

            if (!userRepository.existsByEmail("demo@codeduo.dev")) {
                userRepository.save(User.builder()
                        .email("demo@codeduo.dev").password(passwordEncoder.encode("password"))
                        .nickname("demo").avatar("DE").xp(240).streakCount(7).hearts(5).premium(false).build());
            }
            if (!userRepository.existsByEmail("premium@codeduo.dev")) {
                userRepository.save(User.builder()
                        .email("premium@codeduo.dev").password(passwordEncoder.encode("password"))
                        .nickname("premium").avatar("PR").xp(920).streakCount(14).hearts(5).premium(true).build());
            }

            Map<Language, Course> courses = new EnumMap<>(Language.class);
            courses.put(Language.PYTHON, courseRepository.save(course("Python", Language.PYTHON, "입문부터 심화까지 Python")));
            courses.put(Language.JAVA, courseRepository.save(course("Java", Language.JAVA, "백엔드 입문을 위한 Java")));
            courses.put(Language.C, courseRepository.save(course("C", Language.C, "시스템 프로그래밍 C 기본기")));
            courses.put(Language.CPP, courseRepository.save(course("C++", Language.CPP, "알고리즘 학습을 위한 C++")));

            Map<String, Lesson> lessons = new HashMap<>();
            for (Language lang : Language.values()) {
                for (int d = 1; d <= 3; d++) {
                    Lesson saved = lessonRepository.save(
                            lesson(courses.get(lang), DIFF_NAME[d - 1], DIFF_DESC[d - 1], d));
                    lessons.put(lang.name() + "-" + d, saved);
                }
            }

            List<Map<String, Object>> seed;
            try (InputStream is = new ClassPathResource("seed-problems.json").getInputStream()) {
                seed = mapper.readValue(is, new TypeReference<List<Map<String, Object>>>() {});
            }

            Map<String, Integer> order = new HashMap<>();
            for (Map<String, Object> it : seed) {
                Language lang = Language.valueOf((String) it.get("language"));
                int diff = ((Number) it.get("difficulty")).intValue();
                String key = lang.name() + "-" + diff;
                Lesson lesson = lessons.get(key);
                int ord = order.merge(key, 1, Integer::sum);

                problemRepository.save(Problem.builder()
                        .lesson(lesson)
                        .type(ProblemType.valueOf((String) it.get("type")))
                        .language(lang)
                        .difficulty(diff)
                        .title((String) it.get("title"))
                        .description((String) it.get("description"))
                        .answer((String) it.get("answer"))
                        .optionsJson((String) it.get("optionsJson"))
                        .hint((String) it.get("hint"))
                        .explanation((String) it.get("explanation"))
                        .codeTemplate((String) it.get("codeTemplate"))
                        .testInput((String) it.get("testInput"))
                        .expectedOutput((String) it.get("expectedOutput"))
                        .testCasesJson((String) it.get("testCasesJson"))
                        .rubric((String) it.getOrDefault("rubric", "핵심 개념을 자신의 말로 설명했는지 평가"))
                        .tagsJson("[]")
                        .orderIndex(ord)
                        .build());
            }
        };
    }

    private Course course(String title, Language language, String description) {
        return Course.builder().title(title).language(language).description(description).level("MIXED").build();
    }

    private Lesson lesson(Course course, String title, String description, int orderIndex) {
        return Lesson.builder().course(course).title(title).description(description).orderIndex(orderIndex).build();
    }
}
