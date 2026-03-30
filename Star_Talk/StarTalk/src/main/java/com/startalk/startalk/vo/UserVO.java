package com.startalk.startalk.vo;

import com.startalk.startalk.enums.UserRole;
import lombok.Data;

@Data
public class UserVO {
    private Long id;
    private String openid;
    private String unionid;
    private String phone;
    private String nickname;
    private String avatar;
    private Integer age;
    private String grade;
    private UserRole role;
    private Integer status;
}