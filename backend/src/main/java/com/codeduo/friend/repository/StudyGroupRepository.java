package com.codeduo.friend.repository;

import com.codeduo.friend.entity.StudyGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long> {
    boolean existsByName(String name);
    List<StudyGroup> findTop20ByNameContainingIgnoreCaseOrderByNameAsc(String name);
}
