package com.startalk.startalk.center.vo;

import lombok.Data;

@Data
public class UserSettingVO {
    private Long id;
    private Long userId;
    private String language;
    private Boolean notificationEnabled;
    private Integer dailyLimit;
    private String allowedTimeStart;
    private String allowedTimeEnd;
}