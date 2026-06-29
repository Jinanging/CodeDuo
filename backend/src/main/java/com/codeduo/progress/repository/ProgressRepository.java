package com.codeduo.progress.repository;

import com.codeduo.progress.entity.Progress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProgressRepository extends JpaRepository<Progress, Long> {
    List<Progress> findByUserId(Long userId);
    List<Progress> findByUserIdAndCourseId(Long userId, Long courseId);
    Optional<Progress> findByUserIdAndCourseIdAndLessonId(Long userId, Long courseId, Long lessonId);
}
