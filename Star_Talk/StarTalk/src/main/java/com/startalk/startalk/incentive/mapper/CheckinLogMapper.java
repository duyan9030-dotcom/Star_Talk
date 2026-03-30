package com.startalk.startalk.incentive.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.startalk.startalk.incentive.entity.CheckinLog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface CheckinLogMapper extends BaseMapper<CheckinLog> {

    CheckinLog selectByUserIdAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);

    List<CheckinLog> selectByUserIdAndMonth(@Param("userId") Long userId, @Param("year") Integer year, @Param("month") Integer month);

    Integer countConsecutiveDays(@Param("userId") Long userId);
}