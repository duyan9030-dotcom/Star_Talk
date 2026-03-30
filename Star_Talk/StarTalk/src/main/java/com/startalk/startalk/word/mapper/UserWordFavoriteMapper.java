package com.startalk.startalk.word.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.startalk.startalk.word.entity.UserWordFavorite;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserWordFavoriteMapper extends BaseMapper<UserWordFavorite> {

    List<UserWordFavorite> selectByUserId(@Param("userId") Long userId);

    Boolean exists(@Param("userId") Long userId, @Param("wordId") Long wordId);
}