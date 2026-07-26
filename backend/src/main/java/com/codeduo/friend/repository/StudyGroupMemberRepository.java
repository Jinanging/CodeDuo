package com.codeduo.friend.repository;

import com.codeduo.friend.entity.StudyGroupMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudyGroupMemberRepository extends JpaRepository<StudyGroupMember, Long> {
    List<StudyGroupMember> findAllByUserId(Long userId);
    List<StudyGroupMember> findAllByStudyGroupId(Long studyGroupId);
    Optional<StudyGroupMember> findByStudyGroupIdAndUserId(Long studyGroupId, Long userId);
    long countByStudyGroupId(Long studyGroupId);
}
