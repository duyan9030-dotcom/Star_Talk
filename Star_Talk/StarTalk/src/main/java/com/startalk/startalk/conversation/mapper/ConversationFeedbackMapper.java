package com.startalk.startalk.conversation.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.startalk.startalk.conversation.entity.ConversationFeedback;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ConversationFeedbackMapper extends BaseMapper<ConversationFeedback> {

    ConversationFeedback selectBySessionId(@Param("sessionId") Long sessionId);
}