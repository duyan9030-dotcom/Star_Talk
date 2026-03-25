package com.startalk.startalk.incentive.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BadgeVO {
    private Long id;
    private String name;
    private String icon;
    private String description;
    private Boolean owned;
    private LocalDateTime obtainTime;
}