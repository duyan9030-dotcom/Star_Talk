package com.startalk.startalk.conversation.vo;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class SessionVO {
    private Long id;
    private Long userId;
    private Long sceneId;
    private String sceneName;
    private Integer status;
    private Integer messageCount;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer duration;
    private List<MessageVO> messages;
}