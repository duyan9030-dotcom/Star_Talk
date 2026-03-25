package com.startalk.startalk.word.vo;

import lombok.Data;

@Data
public class WordTestQuestion {
    private Long wordId;
    private String questionType;
    private String question;
    private String imageUrl;
    private String audioUrl;
}