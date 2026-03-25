package com.startalk.startalk.word.service;

import com.startalk.startalk.word.vo.WordStudyRequest;
import com.startalk.startalk.word.vo.WordTestQuestion;
import com.startalk.startalk.word.vo.WordVO;

import java.util.List;

public interface WordService {

    List<WordVO> getWordList(String category, Integer difficulty);

    WordVO getWordById(Long wordId);

    WordVO recordStudy(Long userId, WordStudyRequest request);

    List<WordVO> getFavoriteWords(Long userId);

    void addFavorite(Long userId, Long wordId);

    void removeFavorite(Long userId, Long wordId);

    List<WordTestQuestion> getTestQuestions(Long userId, Integer count);

    Integer submitTest(Long userId, List<WordTestQuestion> answers);
}