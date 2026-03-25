package com.startalk.startalk.center.vo;

import lombok.Data;

@Data
public class UserInfoVO {
    private Long id;
    private String nickname;
    private String avatar;
    private Integer age;
    private String grade;
    private String role;
    private Integer totalStudyMinutes;
    private Integer totalWordsLearned;
    private Integer totalConversations;
    private Integer totalPoints;
}