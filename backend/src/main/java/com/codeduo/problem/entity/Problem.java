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

    @Column(length = 4000)
    private String description;

    private int difficulty;

    @Column(length = 4000)
    private String answer;

    @Column(length = 4000)
    private String codeTemplate;

    @Column(length = 4000)
    private String testInput;

    @Column(length = 4000)
    private String expectedOutput;

    @Column(length = 4000)
    private String rubric;

    @Column(length = 4000)
    private String optionsJson;

    @Column(length = 1000)
    private String hint;

    @Column(length = 4000)
    private String explanation;

    @Column(length = 1000)
    private String tagsJson;

    @Column(length = 4000)
    private String testCasesJson;

    private int orderIndex;
    @CreationTimestamp private LocalDateTime createdAt;
    @UpdateTimestamp private LocalDateTime updatedAt;
}
