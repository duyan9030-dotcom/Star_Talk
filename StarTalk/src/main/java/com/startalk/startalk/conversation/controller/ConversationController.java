package com.startalk.startalk.conversation.controller;

import com.startalk.startalk.conversation.service.ConversationService;
import com.startalk.startalk.conversation.vo.*;
import com.startalk.startalk.conversation.vo.SpeechToTextRequest;
import com.startalk.startalk.vo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/conversation")
public class ConversationController {

    @Autowired
    private ConversationService conversationService;

    @GetMapping("/scenes")
    public Result<List<SceneVO>> getSceneList() {
        return Result.success(conversationService.getSceneList());
    }

    @GetMapping("/session/{sessionId}")
    public Result<SessionVO> getSession(@PathVariable Long sessionId) {
        return Result.success(conversationService.getSessionById(sessionId));
    }

    @GetMapping("/sessions")
    public Result<List<SessionVO>> getUserSessions(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        // 开发环境：如果没有 userId，使用默认值 1
        if (userId == null) {
            userId = 1L;
        }
        return Result.success(conversationService.getUserSessions(userId));
    }

    @PostMapping("/session/create")
    public Result<SessionVO> createSession(@RequestParam Long sceneId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        // 开发环境：如果没有 userId，使用默认值 1
        if (userId == null) {
            userId = 1L;
        }
        return Result.success(conversationService.createSession(userId, sceneId));
    }

    @PostMapping("/message/send")
    public Result<SendMessageResponse> sendMessage(@RequestBody SendMessageRequest request, HttpServletRequest httpRequest) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        // 开发环境：如果没有 userId，使用默认值 1
        if (userId == null) {
            userId = 1L;
        }
        return Result.success(conversationService.sendMessage(userId, request));
    }

    @PostMapping("/speech-to-text")
    public Result<String> speechToText(@RequestBody SpeechToTextRequest request, HttpServletRequest httpRequest) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        if (userId == null) {
            userId = 1L;
        }

        String audioBase64 = request.getAudioBase64();
        String audioUrl = request.getAudioUrl();

        byte[] audioData = null;
        if (audioBase64 != null && !audioBase64.isEmpty()) {
            String base64 = audioBase64;
            if (base64.startsWith("data:")) {
                int comma = base64.indexOf(',');
                if (comma > 0) {
                    base64 = base64.substring(comma + 1);
                }
            }
            audioData = java.util.Base64.getDecoder().decode(base64);
        }

        String text = conversationService.speechToText(userId, audioUrl, audioData);
        return Result.success(text);
    }

    @PostMapping("/session/end/{sessionId}")
    public Result<Void> endSession(@PathVariable Long sessionId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        // 开发环境：如果没有 userId，使用默认值 1
        if (userId == null) {
            userId = 1L;
        }
        conversationService.endSession(userId, sessionId);
        return Result.success();
    }

    @GetMapping("/feedback/{sessionId}")
    public Result<FeedbackVO> getFeedback(@PathVariable Long sessionId) {
        return Result.success(conversationService.getSessionFeedback(sessionId));
    }

    @PostMapping("/feedback/generate/{sessionId}")
    public Result<FeedbackVO> generateFeedback(@PathVariable Long sessionId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        // 开发环境：如果没有 userId，使用默认值 1
        if (userId == null) {
            userId = 1L;
        }
        return Result.success(conversationService.generateFeedback(userId, sessionId));
    }
}