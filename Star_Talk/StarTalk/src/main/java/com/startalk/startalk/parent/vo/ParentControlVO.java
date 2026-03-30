package com.startalk.startalk.parent.vo;

import lombok.Data;

@Data
public class ParentControlVO {
    private Long childId;
    private Integer dailyLimitMinutes;
    private String allowedTimeStart;
    private String allowedTimeEnd;
    private Boolean isLocked;
}