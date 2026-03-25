package com.startalk.startalk.parent.vo;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ChildInfoVO {
    private Long childId;
    private String nickname;
    private String avatar;
    private Integer age;
    private String grade;
    private Integer totalStudyMinutes;
    private Integer totalConversations;
    private Integer totalWordsLearned;
    private Integer totalPoints;
    private List<DailyStatsVO> weeklyStats;
}