package com.startalk.startalk.ai.service.impl;

import com.startalk.startalk.ai.service.ChatMessage;
import com.startalk.startalk.ai.service.LlmService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MockLlmServiceImpl implements LlmService {

    @Override
    public String chat(List<ChatMessage> messages) {
        return getMockResponse(messages);
    }

    @Override
    public String chatWithPrompt(String prompt, List<ChatMessage> history) {
        return getMockResponse(history);
    }

    private String getMockResponse(List<ChatMessage> messages) {
        if (messages == null || messages.isEmpty()) {
            return "Hello! How can I help you practice English today?";
        }
        ChatMessage lastMessage = messages.get(messages.size() - 1);
        String userInput = lastMessage.getContent().toLowerCase();

        if (userInput.contains("order") || userInput.contains("food")) {
            return "Great! You want to order some food. What would you like to have today? We have delicious burgers, pizza, salads, and more. May I take your order?";
        } else if (userInput.contains("where") || userInput.contains("direction")) {
            return "Of course! I'd be happy to help you with directions. Where would you like to go? Are you looking for the nearest subway station, a hospital, or a shopping mall?";
        } else if (userInput.contains("introduce") || userInput.contains("myself") || userInput.contains("name")) {
            return "Nice to meet you! My name is Emma. I'm 10 years old and I love playing soccer and reading books. What about you? Could you introduce yourself?";
        } else if (userInput.contains("buy") || userInput.contains("shop")) {
            return "Welcome to our store! We have many nice things here. Are you looking for something specific today? Let me know if you need any help!";
        } else if (userInput.contains("help")) {
            return "I'd be happy to help you practice English! We can talk about everyday topics like ordering food, asking for directions, shopping, or introducing yourself. What would you like to practice?";
        } else if (userInput.contains("thank")) {
            return "You're welcome! It's great to see you practicing English. Is there anything else you'd like to talk about?";
        } else {
            return "That's wonderful! You're doing great with your English. Could you tell me more about that? Keep practicing!";
        }
    }
}