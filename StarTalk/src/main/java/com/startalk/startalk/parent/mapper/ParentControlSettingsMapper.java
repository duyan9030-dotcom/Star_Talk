package com.startalk.startalk.parent.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.startalk.startalk.parent.entity.ParentControlSettings;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ParentControlSettingsMapper extends BaseMapper<ParentControlSettings> {

    ParentControlSettings selectByChildId(@Param("childId") Long childId);
}