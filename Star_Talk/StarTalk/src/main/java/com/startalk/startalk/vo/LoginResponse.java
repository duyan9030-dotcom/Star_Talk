package com.startalk.startalk.vo;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private UserVO user;
    private Boolean isNewUser;
}