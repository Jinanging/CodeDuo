package com.codeduo.friend.entity;

import com.codeduo.problem.type.Language;
import com.codeduo.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "study_groups")
public class StudyGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    private int maxMembers;

    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    private User owner;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Language language;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
