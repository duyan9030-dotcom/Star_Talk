package com.startalk.startalk.word.vo;

import lombok.Data;

@Data
public class WordVO {
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
    private Boolean isFavorite;
    private Integer masterLevel;
}