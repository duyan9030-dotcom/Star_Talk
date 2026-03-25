package com.startalk.startalk.ai.service;

import lombok.Data;

@Data
public class ChatMessage {
    private String role;
    private String content;

    public ChatMessage() {}

    public ChatMessage(String role, String content) {
        this.role = role;
        this.content = content;
    }
}