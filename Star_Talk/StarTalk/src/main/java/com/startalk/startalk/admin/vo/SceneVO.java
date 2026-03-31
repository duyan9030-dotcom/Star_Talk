package com.startalk.startalk.admin.vo;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class SceneVO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String name;
    private String nameEn;
    private String description;
    private String prompt;
    private String icon;
    private Integer difficulty;
    private Integer sort;
    private Integer status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
