package com.codeduo.problem.entity;

import com.codeduo.lesson.entity.Lesson;
import com.codeduo.problem.type.Language;
import com.codeduo.problem.type.ProblemType;
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
public class Problem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Lesson lesson;

    @Enumerated(EnumType.STRING)
    private ProblemType type;

    @Enumerated(EnumType.STRING)
    private Language language;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private int difficulty;

    @Column(columnDefinition = "TEXT")
    private String answer;

    @Column(columnDefinition = "TEXT")
    private String codeTemplate;

    @Column(columnDefinition = "TEXT")
    private String testInput;

    @Column(columnDefinition = "TEXT")
    private String expectedOutput;

    @Column(columnDefinition = "TEXT")
    private String rubric;

    @Column(columnDefinition = "TEXT")
    private String optionsJson;

    @Column(length = 1000)
    private String hint;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(length = 1000)
    private String tagsJson;

    @Column(columnDefinition = "TEXT")
    private String testCasesJson;

    private int orderIndex;
    @CreationTimestamp private LocalDateTime createdAt;
    @UpdateTimestamp private LocalDateTime updatedAt;
}
