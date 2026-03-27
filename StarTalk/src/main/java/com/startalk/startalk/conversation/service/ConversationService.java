package com.startalk.startalk.conversation.service;

import com.startalk.startalk.conversation.entity.ConversationScene;
import com.startalk.startalk.conversation.vo.*;

import java.util.List;

public interface ConversationService {

    List<SceneVO> getSceneList();

    ConversationScene getSceneById(Long sceneId);

    SessionVO createSession(Long userId, Long sceneId);

    SessionVO getSessionById(Long sessionId);

    List<SessionVO> getUserSessions(Long userId);

    SendMessageResponse sendMessage(Long userId, SendMessageRequest request);

    String speechToText(Long userId, String audioUrl, byte[] audioData);

    FeedbackVO getSessionFeedback(Long sessionId);

    FeedbackVO generateFeedback(Long userId, Long sessionId);

    void endSession(Long userId, Long sessionId);
}