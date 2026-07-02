package com.codeduo.submission.entity;

import com.codeduo.problem.entity.Problem;
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
public class Submission {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User user;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Problem problem;
    @Column(columnDefinition = "TEXT")
    private String submittedAnswer;
    private boolean correct;
    private int score;
    private Long runtimeMs;
    private Long memoryKb;
    @Column(columnDefinition = "TEXT")
    private String aiReview;
    @Column(length = 1000)
    private String resultMessage;
    @Column(columnDefinition = "TEXT")
    private String testResultsJson;
    @CreationTimestamp private LocalDateTime createdAt;
}
