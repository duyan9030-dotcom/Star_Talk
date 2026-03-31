package com.startalk.startalk.admin.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.startalk.startalk.admin.mapper.SceneManageMapper;
import com.startalk.startalk.admin.vo.PageVO;
import com.startalk.startalk.admin.vo.SceneVO;
import com.startalk.startalk.admin.vo.WordVO;
import com.startalk.startalk.conversation.entity.ConversationScene;
import com.startalk.startalk.exception.BusinessException;
import com.startalk.startalk.word.entity.Word;
import com.startalk.startalk.word.mapper.WordMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class AdminWordService extends ServiceImpl<WordMapper, Word> {

    public PageVO<WordVO> getWordList(Integer pageNum, Integer pageSize, String category, Integer difficulty, String keyword) {
        Page<Word> page = new Page<>(pageNum, pageSize);
        var wrapper = this.lambdaQuery()
                // .like(keyword != null && !keyword.isEmpty(), Word::getWord, keyword) // 注释掉或删除
                // .eq(category != null && !category.isEmpty(), Word::getCategory, category) // 注释掉或删除
                // .eq(difficulty != null, Word::getDifficulty, difficulty) // 注释掉或删除
                .orderByDesc(Word::getCreateTime)
                .getWrapper();

        Page<Word> result = this.page(page, wrapper);

        PageVO<WordVO> pageVO = new PageVO<>();
        pageVO.setTotal(result.getTotal());
        pageVO.setRecords(result.getRecords().stream().map(this::convertToWordVO).collect(Collectors.toList()));
        pageVO.setPageNum((long) pageNum);
        pageVO.setPageSize((long) pageSize);
        return pageVO;
    }

    public WordVO getWordDetail(Long wordId) {
        Word word = this.getById(wordId);
        if (word == null) {
            throw new BusinessException(404, "单词不存在");
        }
        return convertToWordVO(word);
    }

    public void createWord(Word word) {
        this.save(word);
    }

    public void updateWord(Long wordId, Word word) {
        Word existing = this.getById(wordId);
        if (existing == null) {
            throw new BusinessException(404, "单词不存在");
        }
        word.setId(wordId);
        this.updateById(word);
    }

    public void deleteWord(Long wordId) {
        if (!this.removeById(wordId)) {
            throw new BusinessException(404, "单词不存在");
        }
    }

    private WordVO convertToWordVO(Word word) {
        WordVO vo = new WordVO();
        vo.setId(word.getId());
        vo.setWord(word.getWord());
        vo.setPhonetic(word.getPhonetic());
        vo.setPhoneticAudio(word.getPhoneticAudio());
        vo.setMeaning(word.getMeaning());
        vo.setPartOfSpeech(word.getPartOfSpeech());
        vo.setExampleSentence(word.getExampleSentence());
        vo.setExampleTranslation(word.getExampleTranslation());
        vo.setExampleAudio(word.getExampleAudio());
        vo.setImageUrl(word.getImageUrl());
        vo.setDifficulty(word.getDifficulty());
        vo.setCategory(word.getCategory());
        vo.setCreateTime(word.getCreateTime());
        vo.setUpdateTime(word.getUpdateTime());
        return vo;
    }
}
