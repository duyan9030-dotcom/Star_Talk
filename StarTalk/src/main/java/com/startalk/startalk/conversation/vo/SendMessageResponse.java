package com.startalk.startalk.conversation.vo;

import lombok.Data;

@Data
public class SendMessageResponse {
    private Long messageId;
    private String content;
    private String audioUrl;
    private String audioText;
    private Integer duration;
}