package com.startalk.startalk.vo;

import lombok.Data;

@Data
public class LoginRequest {
    private String code;
    private String phone;
    private String smsCode;
    private String password;
    private Integer loginType;
}