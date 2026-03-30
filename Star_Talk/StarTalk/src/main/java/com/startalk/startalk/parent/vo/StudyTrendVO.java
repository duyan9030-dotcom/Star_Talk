package com.startalk.startalk.parent.vo;

import lombok.Data;

import java.util.List;

@Data
public class StudyTrendVO {
    private List<DailyStatsVO> dailyData;
    private Integer weeklyTotal;
    private Integer dailyAverage;
}