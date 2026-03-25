package com.startalk.startalk.incentive.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.startalk.startalk.incentive.entity.UserRewardRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserRewardRecordMapper extends BaseMapper<UserRewardRecord> {

    List<UserRewardRecord> selectByUserId(@Param("userId") Long userId);
}