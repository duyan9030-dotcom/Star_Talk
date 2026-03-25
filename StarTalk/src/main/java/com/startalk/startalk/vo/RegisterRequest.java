package com.startalk.startalk.vo;

import com.startalk.startalk.enums.UserRole;
import lombok.Data;

@Data
public class RegisterRequest {
    private String phone;
    private String smsCode;
    private String nickname;
    private UserRole role;
    private Integer age;
    private String grade;
}