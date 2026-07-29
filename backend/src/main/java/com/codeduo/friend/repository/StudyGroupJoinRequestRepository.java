package com.codeduo.friend.repository;

import com.codeduo.friend.entity.StudyGroupJoinRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudyGroupJoinRequestRepository extends JpaRepository<StudyGroupJoinRequest, Long> {
    List<StudyGroupJoinRequest> findAllByStudyGroupId(Long studyGroupId);
    List<StudyGroupJoinRequest> findAllByUserId(Long userId);
    Optional<StudyGroupJoinRequest> findByStudyGroupIdAndUserId(Long studyGroupId, Long userId);
    boolean existsByStudyGroupIdAndUserId(Long studyGroupId, Long userId);
    void deleteByStudyGroupIdAndUserId(Long studyGroupId, Long userId);
}
