package com.startalk.startalk.enums;

public enum LoginType {
    WECHAT("WECHAT", "微信登录"),
    PHONE("PHONE", "手机号登录");

    private final String code;
    private final String description;

    LoginType(String code, String description) {
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