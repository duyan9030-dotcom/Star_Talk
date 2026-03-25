package com.startalk.startalk.word.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.startalk.startalk.word.entity.UserWordFavorite;
import com.startalk.startalk.word.entity.UserWordRecord;
import com.startalk.startalk.word.entity.Word;
import com.startalk.startalk.word.mapper.UserWordFavoriteMapper;
import com.startalk.startalk.word.mapper.UserWordRecordMapper;
import com.startalk.startalk.word.mapper.WordMapper;
import com.startalk.startalk.word.service.WordService;
import com.startalk.startalk.word.vo.WordStudyRequest;
import com.startalk.startalk.word.vo.WordTestQuestion;
import com.startalk.startalk.word.vo.WordVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WordServiceImpl implements WordService {

    @Autowired
    private WordMapper wordMapper;

    @Autowired
    private UserWordRecordMapper userWordRecordMapper;

    @Autowired
    private UserWordFavoriteMapper userWordFavoriteMapper;

    @Override
    public List<WordVO> getWordList(String category, Integer difficulty) {
        LambdaQueryWrapper<Word> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(category)) {
            wrapper.eq(Word::getCategory, category);
        }
        if (difficulty != null) {
            wrapper.eq(Word::getDifficulty, difficulty);
        }
        wrapper.orderByAsc(Word::getWord);
        List<Word> words = wordMapper.selectList(wrapper);
        return words.stream().map(this::convertToVO).collect(Collectors.toList());
    }

    @Override
    public WordVO getWordById(Long wordId) {
        Word word = wordMapper.selectById(wordId);
        if (word == null) {
            return null;
        }
        return convertToVO(word);
    }

    @Override
    @Transactional
    public WordVO recordStudy(Long userId, WordStudyRequest request) {
        Word word = wordMapper.selectById(request.getWordId());
        if (word == null) {
            return null;
        }

        UserWordRecord record = userWordRecordMapper.selectByUserIdAndWordId(userId, request.getWordId());
        if (record == null) {
            record = new UserWordRecord();
            record.setUserId(userId);
            record.setWordId(request.getWordId());
            record.setStudyCount(1);
            record.setCorrectCount(request.getScore() >= 60 ? 1 : 0);
            record.setMasterLevel(calculateMasterLevel(request.getScore()));
            record.setLastStudyTime(LocalDateTime.now());
            record.setNextReviewTime(calculateNextReviewTime(record.getMasterLevel()));
            userWordRecordMapper.insert(record);
        } else {
            record.setStudyCount(record.getStudyCount() + 1);
            if (request.getScore() >= 60) {
                record.setCorrectCount(record.getCorrectCount() + 1);
            }
            record.setMasterLevel(calculateMasterLevel(
                    (record.getCorrectCount() * 100) / record.getStudyCount()));
            record.setLastStudyTime(LocalDateTime.now());
            record.setNextReviewTime(calculateNextReviewTime(record.getMasterLevel()));
            userWordRecordMapper.updateById(record);
        }

        WordVO vo = convertToVO(word);
        vo.setMasterLevel(record.getMasterLevel());
        return vo;
    }

    @Override
    public List<WordVO> getFavoriteWords(Long userId) {
        List<UserWordFavorite> favorites = userWordFavoriteMapper.selectByUserId(userId);
        if (favorites == null || favorites.isEmpty()) {
            return new ArrayList<>();
        }
        List<Long> wordIds = favorites.stream()
                .map(UserWordFavorite::getWordId)
                .collect(Collectors.toList());
        List<Word> words = wordMapper.selectBatchIds(wordIds);
        return words.stream().map(this::convertToVO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void addFavorite(Long userId, Long wordId) {
        Boolean exists = userWordFavoriteMapper.exists(userId, wordId);
        if (!exists) {
            UserWordFavorite favorite = new UserWordFavorite();
            favorite.setUserId(userId);
            favorite.setWordId(wordId);
            userWordFavoriteMapper.insert(favorite);
        }
    }

    @Override
    @Transactional
    public void removeFavorite(Long userId, Long wordId) {
        LambdaQueryWrapper<UserWordFavorite> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserWordFavorite::getUserId, userId)
                .eq(UserWordFavorite::getWordId, wordId);
        userWordFavoriteMapper.delete(wrapper);
    }

    @Override
    public List<WordTestQuestion> getTestQuestions(Long userId, Integer count) {
        List<Word> words = wordMapper.selectList(
                new LambdaQueryWrapper<Word>().orderByAsc(Word::getId).last("LIMIT " + count));
        List<WordTestQuestion> questions = new ArrayList<>();
        for (Word word : words) {
            WordTestQuestion q = new WordTestQuestion();
            q.setWordId(word.getId());
            q.setQuestionType("LISTEN_CHOICE");
            q.setQuestion("Listen and choose the correct meaning");
            q.setAudioUrl(word.getPhoneticAudio());
            questions.add(q);
        }
        return questions;
    }

    @Override
    @Transactional
    public Integer submitTest(Long userId, List<WordTestQuestion> answers) {
        int correctCount = 0;
        for (WordTestQuestion answer : answers) {
            Word word = wordMapper.selectById(answer.getWordId());
            if (word != null) {
                WordStudyRequest studyRequest = new WordStudyRequest();
                studyRequest.setWordId(answer.getWordId());
                studyRequest.setScore(answer.getQuestion().equals(word.getMeaning()) ? 100 : 0);
                recordStudy(userId, studyRequest);
                if (studyRequest.getScore() >= 60) {
                    correctCount++;
                }
            }
        }
        return (correctCount * 100) / answers.size();
    }

    private WordVO convertToVO(Word word) {
        WordVO vo = new WordVO();
        BeanUtils.copyProperties(word, vo);
//        vo.setFavorite(false);
        vo.setMasterLevel(0);
        return vo;
    }

    private Integer calculateMasterLevel(Integer score) {
        if (score >= 90) return 5;
        if (score >= 80) return 4;
        if (score >= 70) return 3;
        if (score >= 60) return 2;
        return 1;
    }

    // ... existing code ...

    private LocalDateTime calculateNextReviewTime(Integer masterLevel) {
        int days;
        switch (masterLevel) {
            case 1:
                days = 1;
                break;
            case 2:
                days = 2;
                break;
            case 3:
                days = 4;
                break;
            case 4:
                days = 7;
                break;
            default:
                days = 14;
                break;
        }
        return LocalDateTime.now().plusDays(days);
    }
}
