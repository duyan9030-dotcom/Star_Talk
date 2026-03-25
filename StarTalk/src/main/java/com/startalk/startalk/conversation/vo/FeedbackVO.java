package com.startalk.startalk.conversation.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FeedbackVO {
    private Long id;
    private Long sessionId;
    private String feedback;
    private Integer overallScore;
    private String grammarIssues;
    private String pronunciationIssues;
    private String suggestions;
    private LocalDateTime createTime;
}