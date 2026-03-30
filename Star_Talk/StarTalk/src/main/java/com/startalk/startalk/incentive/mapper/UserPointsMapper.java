package com.startalk.startalk.incentive.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.startalk.startalk.incentive.entity.UserPoints;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserPointsMapper extends BaseMapper<UserPoints> {

    UserPoints selectByUserId(@Param("userId") Long userId);
}