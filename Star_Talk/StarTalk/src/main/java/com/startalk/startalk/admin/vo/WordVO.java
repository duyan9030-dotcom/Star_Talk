package com.startalk.startalk.admin.vo;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class WordVO implements Serializable {
    private static final long serialVersionUID = 1L;

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
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
