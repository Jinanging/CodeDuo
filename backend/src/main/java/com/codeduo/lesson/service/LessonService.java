package com.codeduo.lesson.service;

import com.codeduo.global.exception.BusinessException;
import com.codeduo.lesson.dto.LessonResponse;
import com.codeduo.lesson.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LessonService {
    private final LessonRepository lessonRepository;

    public List<LessonResponse> getLessons(Long courseId) {
        return lessonRepository.findByCourseIdOrderByOrderIndex(courseId).stream().map(LessonResponse::from).toList();
    }

    public LessonResponse getLesson(Long id) {
        return lessonRepository.findById(id).map(LessonResponse::from)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "레슨을 찾을 수 없습니다."));
    }
}
