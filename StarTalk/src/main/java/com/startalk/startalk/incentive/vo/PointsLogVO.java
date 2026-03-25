package com.startalk.startalk.incentive.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PointsLogVO {
    private Long id;
    private Long userId;
    private Integer points;
    private String type;
    private String source;
    private String description;
    private LocalDateTime createTime;
}