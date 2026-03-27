package com.startalk.startalk.conversation.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.startalk.startalk.ai.service.ChatMessage;
import com.startalk.startalk.ai.service.LlmServiceFacade;
import com.startalk.startalk.ai.service.TtsServiceFacade;
import com.startalk.startalk.conversation.entity.ConversationFeedback;
import com.startalk.startalk.conversation.entity.ConversationMessage;
import com.startalk.startalk.conversation.entity.ConversationScene;
import com.startalk.startalk.conversation.entity.ConversationSession;
import com.startalk.startalk.conversation.enums.MessageRole;
import com.startalk.startalk.conversation.enums.SessionStatus;
import com.startalk.startalk.conversation.mapper.ConversationFeedbackMapper;
import com.startalk.startalk.conversation.mapper.MessageMapper;
import com.startalk.startalk.conversation.mapper.SceneMapper;
import com.startalk.startalk.conversation.mapper.SessionMapper;
import com.startalk.startalk.conversation.service.ConversationService;
import com.startalk.startalk.conversation.vo.*;
import com.startalk.startalk.exception.BusinessException;
import com.startalk.startalk.mapper.UserMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConversationServiceImpl implements ConversationService {

    @Autowired
    private SceneMapper sceneMapper;

    @Autowired
    private SessionMapper sessionMapper;

    @Autowired
    private MessageMapper messageMapper;

    @Autowired
    private ConversationFeedbackMapper feedbackMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private LlmServiceFacade llmService;

    @Autowired
    private TtsServiceFacade ttsService;

    @Autowired
    @org.springframework.beans.factory.annotation.Qualifier("xunfeiSttServiceImpl")
    private com.startalk.startalk.ai.service.SttService sttService;

    @Override
    public List<SceneVO> getSceneList() {
        LambdaQueryWrapper<ConversationScene> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ConversationScene::getStatus, 1)
                .orderByAsc(ConversationScene::getSort);
        List<ConversationScene> scenes = sceneMapper.selectList(wrapper);
        return scenes.stream().map(this::convertToSceneVO).collect(Collectors.toList());
    }

    @Override
    public ConversationScene getSceneById(Long sceneId) {
        return sceneMapper.selectById(sceneId);
    }

    @Override
    @Transactional
    public SessionVO createSession(Long userId, Long sceneId) {
        ConversationScene scene = sceneMapper.selectById(sceneId);
        if (scene == null) {
            throw new BusinessException("场景不存在");
        }

        // 检查并自动结束已存在的活跃会话
        ConversationSession activeSession = sessionMapper.selectActiveByUserId(userId);
        if (activeSession != null) {
            // 自动结束旧的活跃会话
            System.out.println("[CreateSession] Found active session: " + activeSession.getId() + ", auto-ending it");
            activeSession.setStatus(SessionStatus.COMPLETED.getCode());
            activeSession.setEndTime(LocalDateTime.now());
            if (activeSession.getStartTime() != null) {
                long minutes = java.time.Duration.between(activeSession.getStartTime(), activeSession.getEndTime()).toMinutes();
                activeSession.setDuration((int) minutes);
            }
            sessionMapper.updateById(activeSession);
            System.out.println("[CreateSession] Previous session ended: " + activeSession.getId());
        }

        ConversationSession session = new ConversationSession();
        session.setUserId(userId);
        session.setSceneId(sceneId);
        session.setSceneName(scene.getNameEn());
        session.setStatus(SessionStatus.ACTIVE.getCode());
        session.setMessageCount(0);
        session.setStartTime(LocalDateTime.now());
        sessionMapper.insert(session);

        String systemPrompt = buildSystemPrompt(scene);
        ConversationMessage systemMsg = new ConversationMessage();
        systemMsg.setSessionId(session.getId());
        systemMsg.setUserId(userId);
        systemMsg.setRole(MessageRole.SYSTEM.getCode());
        systemMsg.setContent(systemPrompt);
        messageMapper.insert(systemMsg);

        return convertToSessionVO(session);
    }

    @Override
    public SessionVO getSessionById(Long sessionId) {
        ConversationSession session = sessionMapper.selectById(sessionId);
        if (session == null) {
            throw new BusinessException("会话不存在");
        }
        return convertToSessionVO(session);
    }

    @Override
    public List<SessionVO> getUserSessions(Long userId) {
        List<ConversationSession> sessions = sessionMapper.selectByUserId(userId);
        return sessions.stream().map(this::convertToSessionVO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SendMessageResponse sendMessage(Long userId, SendMessageRequest request) {
        Long sessionId = request.getSessionId();
        ConversationSession session = sessionMapper.selectById(sessionId);
        if (session == null) {
            throw new BusinessException("会话不存在");
        }
        if (!session.getUserId().equals(userId)) {
            throw new BusinessException("无权限操作");
        }
        if (SessionStatus.fromCode(session.getStatus()) != SessionStatus.ACTIVE) {
            throw new BusinessException("会话已结束");
        }

        String userContent = request.getContent();
        if (StringUtils.hasText(request.getAudioText())) {
            userContent = request.getAudioText();
        }

        ConversationMessage userMessage = new ConversationMessage();
        userMessage.setSessionId(sessionId);
        userMessage.setUserId(userId);
        userMessage.setRole(MessageRole.USER.getCode());
        userMessage.setContent(userContent);
        if (StringUtils.hasText(request.getAudioUrl())) {
            userMessage.setAudioUrl(request.getAudioUrl());
        }
        if (StringUtils.hasText(request.getAudioText())) {
            userMessage.setAudioText(request.getAudioText());
        }
        messageMapper.insert(userMessage);

        session.setMessageCount(session.getMessageCount() + 1);
        sessionMapper.updateById(session);

        List<ConversationMessage> historyMessages = messageMapper.selectBySessionId(sessionId);
        List<ChatMessage> chatHistory = historyMessages.stream()
                .filter(m -> !MessageRole.SYSTEM.getCode().equals(m.getRole()))
                .map(m -> new ChatMessage(m.getRole(), m.getContent()))
                .collect(Collectors.toList());

        ConversationScene scene = sceneMapper.selectById(session.getSceneId());
        String aiResponse = llmService.chatWithPrompt(buildSystemPrompt(scene), chatHistory);

        String audioUrl = ttsService.textToSpeech(aiResponse, request.getSpeechSpeed() != null ? "slow" : "medium");

        ConversationMessage aiMessage = new ConversationMessage();
        aiMessage.setSessionId(sessionId);
        aiMessage.setUserId(userId);
        aiMessage.setRole(MessageRole.AI.getCode());
        aiMessage.setContent(aiResponse);
        aiMessage.setAudioUrl(audioUrl);
        messageMapper.insert(aiMessage);

        session.setMessageCount(session.getMessageCount() + 1);
        sessionMapper.updateById(session);

        SendMessageResponse response = new SendMessageResponse();
        response.setMessageId(aiMessage.getId());
        response.setContent(aiResponse);
        response.setAudioUrl(audioUrl);
        response.setAudioText(aiResponse);
        return response;
    }

    @Override
    public String speechToText(Long userId, String audioUrl, byte[] audioData) {
        if (userId == null || userId <= 0) {
            throw new BusinessException("用户未登录或非法用户");
        }
        if ((audioUrl == null || audioUrl.isEmpty()) && (audioData == null || audioData.length == 0)) {
            throw new BusinessException("没有传入音频内容");
        }

        if (audioData != null && audioData.length > 0) {
            return sttService.speechToText(audioData);
        }

        if (audioUrl != null && !audioUrl.isEmpty()) {
            return sttService.speechToText(audioUrl);
        }

        return "";
    }

    @Override
    public FeedbackVO getSessionFeedback(Long sessionId) {
        ConversationFeedback feedback = feedbackMapper.selectBySessionId(sessionId);
        if (feedback == null) {
            return null;
        }
        return convertToFeedbackVO(feedback);
    }

    @Override
    @Transactional
    public FeedbackVO generateFeedback(Long userId, Long sessionId) {
        ConversationSession session = sessionMapper.selectById(sessionId);
        if (session == null) {
            throw new BusinessException("会话不存在");
        }
        if (!session.getUserId().equals(userId)) {
            throw new BusinessException("无权限操作");
        }

        ConversationFeedback existingFeedback = feedbackMapper.selectBySessionId(sessionId);
        if (existingFeedback != null) {
            return convertToFeedbackVO(existingFeedback);
        }

        List<ConversationMessage> messages = messageMapper.selectBySessionId(sessionId);
        List<ChatMessage> userMessages = messages.stream()
                .filter(m -> MessageRole.USER.getCode().equals(m.getRole()))
                .map(m -> new ChatMessage(m.getRole(), m.getContent()))
                .collect(Collectors.toList());

        StringBuilder contentBuilder = new StringBuilder();
        for (ChatMessage msg : userMessages) {
            contentBuilder.append(msg.getContent()).append("\n");
        }

        String feedbackPrompt = String.format(
                "As an English teacher, please provide feedback on this conversation practice. " +
                "Analyze the following user messages and provide:\n" +
                "1. Overall score (0-100)\n" +
                "2. Grammar issues found\n" +
                "3. Pronunciation issues (if any)\n" +
                "4. Suggestions for improvement\n\n" +
                "User messages:\n%s\n" +
                "Format your response as JSON with keys: overallScore, grammarIssues, pronunciationIssues, suggestions",
                contentBuilder.toString()
        );

        String llmFeedback = llmService.chat(List.of(new ChatMessage("user", feedbackPrompt)));

        ConversationFeedback feedback = new ConversationFeedback();
        feedback.setSessionId(sessionId);
        feedback.setUserId(userId);
        feedback.setFeedback(llmFeedback);
        feedback.setOverallScore(calculateScore(llmFeedback));
        feedbackMapper.insert(feedback);

        return convertToFeedbackVO(feedback);
    }

    @Override
    @Transactional
    public void endSession(Long userId, Long sessionId) {
        ConversationSession session = sessionMapper.selectById(sessionId);
        if (session == null) {
            throw new BusinessException("会话不存在");
        }
        if (!session.getUserId().equals(userId)) {
            throw new BusinessException("无权限操作");
        }

        session.setStatus(SessionStatus.COMPLETED.getCode());
        session.setEndTime(LocalDateTime.now());
        if (session.getStartTime() != null) {
            long minutes = java.time.Duration.between(session.getStartTime(), session.getEndTime()).toMinutes();
            session.setDuration((int) minutes);
        }
        sessionMapper.updateById(session);
    }

    private String buildSystemPrompt(ConversationScene scene) {
        return String.format(
                "You are a friendly English conversation partner for a child. " +
                "The topic is: %s. %s. " +
                "Keep responses short and simple (1-3 sentences). " +
                "Be encouraging and patient. " +
                "If the child makes grammar mistakes, gently correct them in your next response. " +
                "Speak as a helpful friend, not a strict teacher.",
                scene.getNameEn(),
                scene.getPrompt()
        );
    }

    private SceneVO convertToSceneVO(ConversationScene scene) {
        SceneVO vo = new SceneVO();
        vo.setId(scene.getId());
        vo.setName(scene.getName());
        vo.setNameEn(scene.getNameEn());
        vo.setDescription(scene.getDescription());
        vo.setIcon(scene.getIcon());
        vo.setDifficulty(scene.getDifficulty());
        return vo;
    }

    private SessionVO convertToSessionVO(ConversationSession session) {
        SessionVO vo = new SessionVO();
        BeanUtils.copyProperties(session, vo);
        List<ConversationMessage> messages = messageMapper.selectBySessionId(session.getId());
        vo.setMessages(messages.stream().map(this::convertToMessageVO).collect(Collectors.toList()));
        return vo;
    }

    private MessageVO convertToMessageVO(ConversationMessage message) {
        MessageVO vo = new MessageVO();
        BeanUtils.copyProperties(message, vo);
        return vo;
    }

    private FeedbackVO convertToFeedbackVO(ConversationFeedback feedback) {
        FeedbackVO vo = new FeedbackVO();
        BeanUtils.copyProperties(feedback, vo);
        return vo;
    }

    private int calculateScore(String feedback) {
        if (feedback == null) return 70;
        int score = 70;
        if (feedback.contains("excellent") || feedback.contains("great")) score = 90;
        else if (feedback.contains("good")) score = 80;
        else if (feedback.contains("needs work")) score = 60;
        return score;
    }
}