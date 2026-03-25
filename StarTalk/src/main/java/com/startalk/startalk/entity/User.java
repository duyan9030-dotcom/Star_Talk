package com.startalk.startalk.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.startalk.startalk.enums.UserRole;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("sys_user")
public class User implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private String openid;

    private String unionid;

    private String phone;

    private String nickname;

    private String avatar;

    private Integer age;

    private String grade;

    @TableField("`role`")
    private UserRole role;

    private Integer status;

    @TableField(select = false)
    private String password;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    private Integer deleted;
}