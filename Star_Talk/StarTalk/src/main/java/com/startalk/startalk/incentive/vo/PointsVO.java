package com.startalk.startalk.incentive.vo;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PointsVO {
    private Long id;
    private Long userId;
    private Integer totalPoints;
    private Integer availablePoints;
    private List<PointsLogVO> recentLogs;
}