package com.startalk.startalk.center.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.startalk.startalk.center.entity.Feedback;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CenterFeedbackMapper extends BaseMapper<Feedback> {

    List<Feedback> selectByUserId(@Param("userId") Long userId);
}