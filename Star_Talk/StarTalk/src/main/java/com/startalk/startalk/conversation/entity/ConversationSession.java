package com.startalk.startalk.conversation.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("conversation_session")
public class ConversationSession implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private Long sceneId;

    private String sceneName;

    private Integer status;

    private Integer messageCount;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Integer duration;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    private Integer deleted;
}