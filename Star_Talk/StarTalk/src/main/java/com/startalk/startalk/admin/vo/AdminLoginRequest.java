package com.startalk.startalk.admin.vo;

import lombok.Data;

import java.io.Serializable;

@Data
public class AdminLoginRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private String username;
    private String password;
}
