package com.startalk.startalk.word.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.startalk.startalk.word.entity.UserWordRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserWordRecordMapper extends BaseMapper<UserWordRecord> {

    UserWordRecord selectByUserIdAndWordId(@Param("userId") Long userId, @Param("wordId") Long wordId);

    List<UserWordRecord> selectMasteredWords(@Param("userId") Long userId);

    Integer countMasteredWords(@Param("userId") Long userId);
}