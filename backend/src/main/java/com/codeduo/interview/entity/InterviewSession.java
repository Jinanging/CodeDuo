package com.codeduo.interview.entity;

import com.codeduo.interview.type.InterviewStatus;
import com.codeduo.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "interview_session")
public class InterviewSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private InterviewStatus status = InterviewStatus.ACTIVE;

    @Column(nullable = false)
    @Builder.Default
    private int totalQuestions = 3;

    @Column(nullable = false)
    @Builder.Default
    private int totalScore = 0;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("questionOrder ASC")
    @Builder.Default
    private List<InterviewTurn> turns = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime completedAt;

    @Column(length = 30)
    private String finalVerdict;

    @Column(columnDefinition = "TEXT")
    private String overallReview;

    @Column(columnDefinition = "TEXT")
    private String hiringRecommendation;

    @Column(columnDefinition = "TEXT")
    private String focusAreasText;

    public void addTurn(InterviewTurn turn) {
        turns.add(turn);
        turn.setSession(this);
    }
}
