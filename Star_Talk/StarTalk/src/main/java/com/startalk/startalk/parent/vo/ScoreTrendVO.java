package com.startalk.startalk.parent.vo;

import lombok.Data;

import java.util.List;

@Data
public class ScoreTrendVO {
    private List<DailyStatsVO> dailyData;
    private Integer averageScore;
    private Integer highestScore;
    private Integer lowestScore;
}