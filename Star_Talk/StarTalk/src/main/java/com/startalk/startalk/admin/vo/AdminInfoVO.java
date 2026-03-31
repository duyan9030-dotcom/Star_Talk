package com.startalk.startalk.admin.vo;

import lombok.Data;

import java.io.Serializable;

@Data
public class AdminInfoVO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String username;
    private String nickname;
    private String avatar;
    private String phone;
    private String email;
}
