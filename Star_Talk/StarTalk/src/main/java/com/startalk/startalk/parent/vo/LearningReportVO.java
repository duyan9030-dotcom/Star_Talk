package com.startalk.startalk.parent.vo;

import lombok.Data;

@Data
public class LearningReportVO {
    private Long childId;
    private String childName;
    private Integer totalStudyMinutes;
    private Integer totalConversations;
    private Integer totalWordsLearned;
    private Integer averageScore;
    private StudyTrendVO studyTrend;
    private ScoreTrendVO scoreTrend;
}