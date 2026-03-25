package com.startalk.startalk.word.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("word")
public class Word implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private String word;

    private String phonetic;

    private String phoneticAudio;

    private String meaning;

    private String partOfSpeech;

    private String exampleSentence;

    private String exampleTranslation;

    private String exampleAudio;

    private String imageUrl;

    private Integer difficulty;

    private String category;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    private Integer deleted;
}