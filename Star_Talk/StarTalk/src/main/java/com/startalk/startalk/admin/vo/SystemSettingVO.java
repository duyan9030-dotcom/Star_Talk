package com.startalk.startalk.admin.vo;

import lombok.Data;

import java.io.Serializable;

@Data
public class SystemSettingVO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String settingKey;
    private String settingValue;
    private String description;
    private String group;
    private Integer sort;
}
