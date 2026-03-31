package com.startalk.startalk.conversation.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.startalk.startalk.conversation.entity.ConversationSession;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SessionMapper extends BaseMapper<ConversationSession> {

    List<ConversationSession> selectByUserId(@Param("userId") Long userId);

    ConversationSession selectActiveByUserId(@Param("userId") Long userId);

    Long selectTodayCount();
}