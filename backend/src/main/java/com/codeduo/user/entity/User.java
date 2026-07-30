package com.codeduo.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String nickname;

    @Builder.Default
    private boolean premium = false;

    @Builder.Default
    private int xp = 0;

    @Builder.Default
    private int streakCount = 0;

    private LocalDate lastStudiedDate;

    @Builder.Default
    private int hearts = 5;

    @Column(columnDefinition = "LONGTEXT")
    private String avatar;

    private LocalDateTime lastSeenAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
