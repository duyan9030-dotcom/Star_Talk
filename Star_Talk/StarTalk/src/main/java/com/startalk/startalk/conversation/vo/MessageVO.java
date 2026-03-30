package com.startalk.startalk.conversation.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageVO {
    private Long id;
    private Long sessionId;
    private String role;
    private String content;
    private String audioUrl;
    private String audioText;
    private Integer duration;
    private LocalDateTime createTime;
}