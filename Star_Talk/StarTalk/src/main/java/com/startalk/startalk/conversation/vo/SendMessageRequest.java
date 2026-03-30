package com.startalk.startalk.conversation.vo;

import lombok.Data;

import java.util.List;

@Data
public class SendMessageRequest {
    private Long sessionId;
    private String content;
    private String audioUrl;
    private String audioText;
    private Integer speechSpeed;
}