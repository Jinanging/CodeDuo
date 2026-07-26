package com.codeduo.friend.repository;

import com.codeduo.friend.entity.StudyGroup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long> {
    boolean existsByName(String name);
}
