package com.startalk.startalk.parent.vo;

import lombok.Data;

import java.time.LocalDate;

@Data
public class DailyStatsVO {
    private LocalDate date;
    private Integer studyMinutes;
    private Integer conversationCount;
    private Integer wordsLearned;
    private Integer score;
}