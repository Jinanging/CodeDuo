package com.codeduo.interview.entity;

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
        name = "interview_turn",
        uniqueConstraints = @UniqueConstraint(columnNames = {"session_id", "question_order"})
)
public class InterviewTurn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private InterviewSession session;

    @Column(name = "question_order", nullable = false)
    private int questionOrder;

    @Column(nullable = false, length = 20)
    private String language;

    @Column(nullable = false, length = 200)
    private String topic;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String expectedPoints;

    @Column(columnDefinition = "TEXT")
    private String answer;

    private Integer score;

    @Column(length = 30)
    private String verdict;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(columnDefinition = "TEXT")
    private String strengthsText;

    @Column(columnDefinition = "TEXT")
    private String improvementsText;

    @Column(columnDefinition = "TEXT")
    private String modelAnswer;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime answeredAt;

    public boolean isAnswered() {
        return answeredAt != null;
    }
}
