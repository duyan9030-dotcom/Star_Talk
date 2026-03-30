package com.startalk.startalk.incentive.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RewardVO {
    private Long id;
    private String name;
    private String icon;
    private String description;
    private Integer points;
    private Integer stock;
    private Integer type;
    private Boolean exchanged;
    private LocalDateTime exchangeTime;
}