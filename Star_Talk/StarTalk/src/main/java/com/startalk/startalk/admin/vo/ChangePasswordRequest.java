package com.startalk.startalk.admin.vo;

import lombok.Data;

import java.io.Serializable;

@Data
public class ChangePasswordRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private String oldPassword;
    private String newPassword;
}
