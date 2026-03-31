package com.startalk.startalk.admin.vo;

import lombok.Data;

import java.io.Serializable;

@Data
public class AdminLoginResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private String token;
    private Long adminId;
    private String username;
    private String nickname;
    private String avatar;
}
