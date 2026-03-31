package com.startalk.startalk.admin.vo;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class PageVO<T> implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long total;
    private List<T> records;
    private Long pageNum;
    private Long pageSize;
}
