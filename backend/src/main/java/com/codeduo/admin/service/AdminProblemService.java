package com.codeduo.admin.service;

import com.codeduo.admin.dto.AdminLessonResponse;
import com.codeduo.admin.dto.AdminProblemRequest;
import com.codeduo.admin.dto.AdminProblemResponse;
import com.codeduo.global.exception.BusinessException;
import com.codeduo.lesson.entity.Lesson;
import com.codeduo.lesson.repository.LessonRepository;
import com.codeduo.problem.entity.Problem;
import com.codeduo.problem.repository.ProblemRepository;
import com.codeduo.problem.type.Language;
import com.codeduo.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminProblemService {
    private final AdminAccessService adminAccessService;
    private final LessonRepository lessonRepository;
    private final ProblemRepository problemRepository;

    @Transactional(readOnly = true)
    public List<AdminLessonResponse> getLessons(User user) {
        adminAccessService.requireAdmin(user);
        return lessonRepository.findAll().stream()
                .sorted(Comparator
                        .comparing((Lesson lesson) -> lesson.getCourse().getLanguage().name())
                        .thenComparing(Lesson::getOrderIndex))
                .map(AdminLessonResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdminProblemResponse> getProblems(User user, Language language, Integer difficulty, Long lessonId) {
        adminAccessService.requireAdmin(user);
        return problemRepository.findAll().stream()
                .filter(problem -> language == null || problem.getLanguage() == language)
                .filter(problem -> difficulty == null || problem.getDifficulty() == difficulty)
                .filter(problem -> lessonId == null || problem.getLesson().getId().equals(lessonId))
                .sorted(Comparator
                        .comparing((Problem problem) -> problem.getLanguage().name())
                        .thenComparingInt(Problem::getDifficulty)
                        .thenComparingInt(Problem::getOrderIndex)
                        .thenComparing(Problem::getId))
                .map(AdminProblemResponse::from)
                .toList();
    }

    @Transactional
    public AdminProblemResponse createProblem(User user, AdminProblemRequest request) {
        adminAccessService.requireAdmin(user);
        Lesson lesson = findLesson(request.lessonId());
        Problem problem = Problem.builder().build();
        apply(problem, lesson, request, nextOrderIndex(lesson.getId()));
        return AdminProblemResponse.from(problemRepository.save(problem));
    }

    @Transactional
    public AdminProblemResponse updateProblem(User user, Long problemId, AdminProblemRequest request) {
        adminAccessService.requireAdmin(user);
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "문제를 찾을 수 없습니다."));
        Lesson lesson = findLesson(request.lessonId());
        apply(problem, lesson, request, problem.getOrderIndex());
        return AdminProblemResponse.from(problemRepository.save(problem));
    }

    @Transactional
    public void deleteProblem(User user, Long problemId) {
        adminAccessService.requireAdmin(user);
        if (!problemRepository.existsById(problemId)) {
            throw new BusinessException(HttpStatus.NOT_FOUND, "문제를 찾을 수 없습니다.");
        }
        problemRepository.deleteById(problemId);
    }

    private Lesson findLesson(Long lessonId) {
        return lessonRepository.findById(lessonId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "레슨을 찾을 수 없습니다."));
    }

    private int nextOrderIndex(Long lessonId) {
        return problemRepository.findByLessonIdOrderByOrderIndex(lessonId).stream()
                .mapToInt(Problem::getOrderIndex)
                .max()
                .orElse(0) + 1;
    }

    private void apply(Problem problem, Lesson lesson, AdminProblemRequest request, int fallbackOrderIndex) {
        problem.setLesson(lesson);
        problem.setType(request.type());
        problem.setLanguage(request.language());
        problem.setDifficulty(request.difficulty());
        problem.setTitle(request.title());
        problem.setDescription(request.description());
        problem.setAnswer(blankToNull(request.answer()));
        problem.setCodeTemplate(blankToNull(request.codeTemplate()));
        problem.setTestInput(blankToNull(request.testInput()));
        problem.setExpectedOutput(blankToNull(request.expectedOutput()));
        problem.setRubric(blankToNull(request.rubric()));
        problem.setOptionsJson(blankToNull(request.optionsJson()));
        problem.setHint(blankToNull(request.hint()));
        problem.setExplanation(blankToNull(request.explanation()));
        problem.setTagsJson(defaultJsonArray(request.tagsJson()));
        problem.setTestCasesJson(blankToNull(request.testCasesJson()));
        problem.setOrderIndex(request.orderIndex() == null ? fallbackOrderIndex : request.orderIndex());
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }

    private String defaultJsonArray(String value) {
        return value == null || value.isBlank() ? "[]" : value;
    }
}
