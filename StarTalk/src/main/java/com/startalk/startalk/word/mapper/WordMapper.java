package com.startalk.startalk.word.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.startalk.startalk.word.entity.Word;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface WordMapper extends BaseMapper<Word> {

    List<Word> selectByCategory(@Param("category") String category);

    List<Word> selectByDifficulty(@Param("difficulty") Integer difficulty);
}