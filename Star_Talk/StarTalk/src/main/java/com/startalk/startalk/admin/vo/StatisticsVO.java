package com.startalk.startalk.admin.vo;

import lombok.Data;

import java.io.Serializable;
import java.util.Map;

@Data
public class StatisticsVO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long totalUsers;
    private Long totalStudents;
    private Long totalParents;
    private Long totalWords;
    private Long totalScenes;
    private Long totalConversations;
    private Long todayConversations;
    private Long totalCheckins;
    private Long todayCheckins;
    private Long totalPoints;
    private Map<String, Long> userGrowth;
    private Map<String, Long> conversationGrowth;
}
