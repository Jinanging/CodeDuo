package com.codeduo.problem.repository;

import com.codeduo.problem.entity.Problem;
import com.codeduo.problem.type.Language;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProblemRepository extends JpaRepository<Problem, Long> {
    List<Problem> findByLessonIdOrderByOrderIndex(Long lessonId);

    List<Problem> findByLanguageAndDifficultyOrderByOrderIndex(Language language, int difficulty);

    List<Problem> findByLanguageOrderByOrderIndex(Language language);
}
