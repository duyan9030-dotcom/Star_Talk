package com.startalk.startalk.ai.service.impl;

import com.startalk.startalk.ai.service.ChatMessage;
import com.startalk.startalk.ai.service.LlmService;
import com.startalk.startalk.exception.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.*;

@Service
public class TongyiLlmServiceImpl implements LlmService {

    @Value("${ai.dashscope.api-key:}")
    private String apiKey;

    @Value("${ai.dashscope.model:qwen-turbo}")
    private String model;

    @Value("${ai.dashscope.url:https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation}")
    private String url;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String chat(List<ChatMessage> messages) {
        try {
            if (apiKey == null || apiKey.isEmpty()) {
                return getMockResponse(messages);
            }
            return callDashScope(buildMessages(messages), null);
        } catch (Exception e) {
            throw new BusinessException("LLM调用失败: " + e.getMessage());
        }
    }

    @Override
    public String chatWithPrompt(String prompt, List<ChatMessage> history) {
        try {
            if (apiKey == null || apiKey.isEmpty()) {
                return getMockResponse(history);
            }
            List<Map<String, String>> msgs = new ArrayList<>();
            msgs.add(Map.of("role", "system", "content", prompt));
            if (history != null) {
                for (ChatMessage msg : history) {
                    msgs.add(Map.of("role", msg.getRole(), "content", msg.getContent()));
                }
            }
            return callDashScope(msgs, prompt);
        } catch (Exception e) {
            throw new BusinessException("LLM调用失败: " + e.getMessage());
        }
    }

    private String callDashScope(List<Map<String, String>> messages, String systemPrompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("model", model);

            List<Map<String, String>> msgs = new ArrayList<>();
            if (systemPrompt != null) {
                msgs.add(Map.of("role", "system", "content", systemPrompt));
            }
            msgs.addAll(messages);
            body.put("messages", msgs);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            if (response.getBody() != null && response.getBody().containsKey("output")) {
                Map output = (Map) response.getBody().get("output");
                return (String) output.get("text");
            }
            return "Sorry, I couldn't generate a response.";
        } catch (Exception e) {
            return getMockResponse(null);
        }
    }

    private List<Map<String, String>> buildMessages(List<ChatMessage> messages) {
        List<Map<String, String>> result = new ArrayList<>();
        for (ChatMessage msg : messages) {
            result.add(Map.of("role", msg.getRole(), "content", msg.getContent()));
        }
        return result;
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
        } else {
            return "That's wonderful! You're doing great with your English. Could you tell me more about that? Keep practicing!";
        }
    }
}