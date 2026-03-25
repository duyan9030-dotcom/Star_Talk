package com.startalk.startalk.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.startalk.startalk.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper extends BaseMapper<User> {

    User selectByOpenid(@Param("openid") String openid);

    User selectByPhone(@Param("phone") String phone);

    User selectByUnionid(@Param("unionid") String unionid);
}