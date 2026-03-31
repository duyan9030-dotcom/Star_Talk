package com.startalk.startalk.admin.vo;

import com.startalk.startalk.entity.User;
import com.startalk.startalk.enums.UserRole;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class UserListVO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String phone;
    private String nickname;
    private String avatar;
    private Integer age;
    private String grade;
    private UserRole role;
    private Integer status;
    private LocalDateTime createTime;
}
