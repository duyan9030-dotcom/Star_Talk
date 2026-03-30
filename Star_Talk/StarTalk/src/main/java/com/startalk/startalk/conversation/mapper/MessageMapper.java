package com.startalk.startalk.conversation.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.startalk.startalk.conversation.entity.ConversationMessage;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MessageMapper extends BaseMapper<ConversationMessage> {

    List<ConversationMessage> selectBySessionId(@Param("sessionId") Long sessionId);
}