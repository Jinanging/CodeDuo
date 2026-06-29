package com.codeduo.course.service;

import com.codeduo.course.dto.CourseResponse;
import com.codeduo.course.repository.CourseRepository;
import com.codeduo.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseService {
    private final CourseRepository courseRepository;

    public List<CourseResponse> getCourses() {
        return courseRepository.findAll().stream().map(CourseResponse::from).toList();
    }

    public CourseResponse getCourse(Long id) {
        return courseRepository.findById(id).map(CourseResponse::from)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "코스를 찾을 수 없습니다."));
    }
}
