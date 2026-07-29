package com.codeduo.friend.entity;

import com.codeduo.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "study_group_join_requests",
        uniqueConstraints = @UniqueConstraint(columnNames = {"study_group_id", "user_id"})
)
public class StudyGroupJoinRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private StudyGroup studyGroup;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User user;

    @CreationTimestamp
    private LocalDateTime requestedAt;
}
