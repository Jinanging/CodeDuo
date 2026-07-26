package com.codeduo.friend.entity;

import com.codeduo.user.entity.User;
import com.codeduo.friend.type.FriendshipStatus;
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
        name = "friendships",
        uniqueConstraints = @UniqueConstraint(columnNames = {"requester_id", "addressee_id"})
)
public class Friendship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User requester;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User addressee;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private FriendshipStatus status = FriendshipStatus.ACCEPTED;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @PrePersist
    void fillDefaultStatus() {
        if (status == null) status = FriendshipStatus.ACCEPTED;
    }
}
