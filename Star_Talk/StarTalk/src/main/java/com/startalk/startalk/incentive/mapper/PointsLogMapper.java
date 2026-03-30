package com.startalk.startalk.incentive.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.startalk.startalk.incentive.entity.PointsLog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PointsLogMapper extends BaseMapper<PointsLog> {

    List<PointsLog> selectByUserId(@Param("userId") Long userId);

    Integer countTodayBySource(@Param("userId") Long userId, @Param("source") String source);
}