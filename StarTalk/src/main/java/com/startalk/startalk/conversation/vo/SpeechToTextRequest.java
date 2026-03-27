package com.startalk.startalk.conversation.vo;

import lombok.Data;

@Data
public class SpeechToTextRequest {
    private String audioBase64;
    private String audioUrl;
    private String mimeType;
}
