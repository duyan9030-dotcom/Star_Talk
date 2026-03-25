package com.startalk.startalk.conversation.controller;

import com.startalk.startalk.conversation.service.ConversationService;
import com.startalk.startalk.conversation.vo.*;
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
        return Result.success(conversationService.getUserSessions(userId));
    }

    @PostMapping("/session/create")
    public Result<SessionVO> createSession(@RequestParam Long sceneId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(conversationService.createSession(userId, sceneId));
    }

    @PostMapping("/message/send")
    public Result<SendMessageResponse> sendMessage(@RequestBody SendMessageRequest request, HttpServletRequest httpRequest) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        return Result.success(conversationService.sendMessage(userId, request));
    }

    @PostMapping("/session/end/{sessionId}")
    public Result<Void> endSession(@PathVariable Long sessionId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
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
        return Result.success(conversationService.generateFeedback(userId, sessionId));
    }
}