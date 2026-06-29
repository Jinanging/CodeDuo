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
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initData() {
        return args -> {
            if (courseRepository.count() > 0) {
                return;
            }

            if (!userRepository.existsByEmail("demo@codeduo.dev")) {
                userRepository.save(User.builder()
                        .email("demo@codeduo.dev")
                        .password(passwordEncoder.encode("password"))
                        .nickname("demo")
                        .avatar("DE")
                        .xp(240)
                        .streakCount(7)
                        .hearts(5)
                        .premium(false)
                        .build());
            }

            if (!userRepository.existsByEmail("premium@codeduo.dev")) {
                userRepository.save(User.builder()
                        .email("premium@codeduo.dev")
                        .password(passwordEncoder.encode("password"))
                        .nickname("premium")
                        .avatar("PR")
                        .xp(920)
                        .streakCount(14)
                        .hearts(5)
                        .premium(true)
                        .build());
            }

            Course python = courseRepository.save(course("Python 기초", Language.PYTHON, "입문자를 위한 실전 Python 코스", "BEGINNER"));
            Course java = courseRepository.save(course("Java 기초", Language.JAVA, "백엔드 입문을 위한 Java 문법", "BEGINNER"));
            Course c = courseRepository.save(course("C 기초", Language.C, "시스템 프로그래밍을 위한 C 기본기", "BEGINNER"));
            Course cpp = courseRepository.save(course("C++ 기초", Language.CPP, "알고리즘 학습을 위한 C++ 기본기", "BEGINNER"));

            Lesson output = lessonRepository.save(lesson(python, "출력과 변수", "print와 변수 할당을 연습합니다.", 1));
            lessonRepository.save(lesson(python, "자료형", "문자열, 숫자, 리스트를 익힙니다.", 2));
            lessonRepository.save(lesson(python, "조건문", "if/else 흐름을 연습합니다.", 3));
            lessonRepository.save(lesson(python, "반복문", "for와 while을 익힙니다.", 4));
            lessonRepository.save(lesson(python, "함수", "함수 정의와 반환을 연습합니다.", 5));
            lessonRepository.save(lesson(java, "메인 메서드", "Java 프로그램의 시작점을 이해합니다.", 1));
            lessonRepository.save(lesson(c, "표준 입출력", "stdio.h와 printf를 익힙니다.", 1));
            lessonRepository.save(lesson(cpp, "네임스페이스", "std 네임스페이스를 이해합니다.", 1));

            problemRepository.save(problem(output, ProblemType.MULTIPLE_CHOICE, Language.PYTHON, "변수 할당",
                    "Python에서 변수 x에 정수 5를 할당하는 올바른 방법은?", "1",
                    "[\"int x = 5;\",\"x = 5\",\"var x = 5\",\"x := 5\"]", "Python은 타입을 명시하지 않아도 됩니다.",
                    "Python은 동적 타입 언어로 x = 5처럼 바로 할당합니다.", null, null, null, 1));
            problemRepository.save(problem(output, ProblemType.FILL_BLANK, Language.PYTHON, "출력 함수",
                    "print({{BLANK}})에서 1 + 2 결과를 출력하세요.", "1 + 2",
                    null, "빈칸에는 출력할 표현식을 넣습니다.", "print(1 + 2)는 3을 출력합니다.",
                    "print({{BLANK}})", "", "3", 2));
            problemRepository.save(problem(output, ProblemType.SHORT_ANSWER, Language.PYTHON, "리스트 길이",
                    "Python에서 리스트 길이를 구하는 함수 이름은?", "len",
                    null, "length가 아니라 짧은 이름입니다.", "len(list)로 요소 개수를 구합니다.", null, null, null, 3));
            problemRepository.save(problem(output, ProblemType.CODE, Language.PYTHON, "Hello World",
                    "Hello World를 출력하는 코드를 작성하세요.", "print('Hello World')",
                    null, "print 함수를 사용하세요.", "문자열 출력은 print('Hello World')입니다.",
                    "# 코드를 작성하세요", "", "Hello World", 4));
            problemRepository.save(problem(output, ProblemType.CODE, Language.PYTHON, "합 구하기",
                    "정수 두 개를 입력받아 합을 출력하는 함수를 완성하세요.", "return a + b",
                    null, "두 매개변수를 더해 반환하세요.", "return a + b로 두 수의 합을 반환합니다.",
                    "def solve(a, b):\n    return a + b", "2 3", "5", 5));
            problemRepository.save(problem(output, ProblemType.ESSAY, Language.PYTHON, "반복문 설명",
                    "반복문을 사용하는 이유를 설명하세요.", "반복 작업을 줄이기 위해 사용한다",
                    null, "반복되는 작업과 코드 중복을 떠올려보세요.", "반복문은 같은 패턴의 작업을 효율적으로 수행하게 합니다.",
                    null, null, null, 6));
        };
    }

    private Course course(String title, Language language, String description, String level) {
        return Course.builder().title(title).language(language).description(description).level(level).build();
    }

    private Lesson lesson(Course course, String title, String description, int orderIndex) {
        return Lesson.builder().course(course).title(title).description(description).orderIndex(orderIndex).build();
    }

    private Problem problem(Lesson lesson, ProblemType type, Language language, String title, String description, String answer,
                            String optionsJson, String hint, String explanation, String codeTemplate, String testInput,
                            String expectedOutput, int orderIndex) {
        return Problem.builder()
                .lesson(lesson)
                .type(type)
                .language(language)
                .title(title)
                .description(description)
                .difficulty(1)
                .answer(answer)
                .optionsJson(optionsJson)
                .hint(hint)
                .explanation(explanation)
                .codeTemplate(codeTemplate)
                .testInput(testInput)
                .expectedOutput(expectedOutput)
                .rubric("핵심 개념을 자신의 말로 설명했는지 평가")
                .tagsJson("[\"기초\"]")
                .testCasesJson(expectedOutput == null ? null : "[{\"input\":\"%s\",\"expected\":\"%s\"}]".formatted(testInput == null ? "" : testInput, expectedOutput))
                .orderIndex(orderIndex)
                .build();
    }
}
