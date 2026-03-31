package com.startalk.startalk.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.startalk.startalk.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserManageMapper extends BaseMapper<User> {
}
