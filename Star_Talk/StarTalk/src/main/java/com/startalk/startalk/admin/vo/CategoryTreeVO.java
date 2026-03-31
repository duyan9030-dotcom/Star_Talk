package com.startalk.startalk.admin.vo;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class CategoryTreeVO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String name;
    private String nameEn;
    private Long parentId;
    private Integer sort;
    private Integer status;
    private List<CategoryTreeVO> children;
}
