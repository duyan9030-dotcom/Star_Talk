package com.startalk.startalk.conversation.enums;

public enum SessionStatus {
    ACTIVE(1, "进行中"),
    COMPLETED(2, "已完成"),
    CANCELLED(3, "已取消");

    private final Integer code;
    private final String description;

    SessionStatus(Integer code, String description) {
        this.code = code;
        this.description = description;
    }

    public Integer getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static SessionStatus fromCode(Integer code) {
        for (SessionStatus status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        return null;
    }
}