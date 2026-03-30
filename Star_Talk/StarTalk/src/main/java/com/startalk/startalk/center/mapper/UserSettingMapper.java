package com.startalk.startalk.center.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.startalk.startalk.center.entity.UserSetting;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserSettingMapper extends BaseMapper<UserSetting> {

    UserSetting selectByUserId(@Param("userId") Long userId);
}