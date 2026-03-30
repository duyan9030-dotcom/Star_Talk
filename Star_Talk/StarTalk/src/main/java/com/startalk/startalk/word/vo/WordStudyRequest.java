package com.startalk.startalk.word.vo;

import lombok.Data;

@Data
public class WordStudyRequest {
    private Long wordId;
    private Integer score;
    private String audioUrl;
}