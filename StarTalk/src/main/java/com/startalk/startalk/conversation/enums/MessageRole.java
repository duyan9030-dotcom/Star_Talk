package com.startalk.startalk.conversation.enums;

public enum MessageRole {
    USER("USER", "用户"),
    AI("AI", "AI助手"),
    SYSTEM("SYSTEM", "系统");

    private final String code;
    private final String description;

    MessageRole(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }
}