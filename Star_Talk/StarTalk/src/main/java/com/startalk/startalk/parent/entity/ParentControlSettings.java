package com.startalk.startalk.parent.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("parent_control_settings")
public class ParentControlSettings implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long parentId;

    private Long childId;

    private Integer dailyLimitMinutes;

    private String allowedTimeStart;

    private String allowedTimeEnd;

    private Boolean isLocked;

    private String unlockPassword;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    private Integer deleted;
}