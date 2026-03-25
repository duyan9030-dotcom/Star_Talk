package com.startalk.startalk.ai.service.impl;

import com.startalk.startalk.ai.config.AiConfig;
import com.startalk.startalk.ai.service.ChatMessage;
import com.startalk.startalk.ai.service.LlmService;
import com.startalk.startalk.exception.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class ChatGLMLlmServiceImpl implements LlmService {

    @Autowired
    private AiConfig aiConfig;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String chat(List<ChatMessage> messages) {
        try {
            String apiKey = aiConfig.getChatglm().getApiKey();
            if (apiKey == null || apiKey.isEmpty() || apiKey.contains("your-chatglm")) {
                return getMockResponse(messages);
            }
            return callChatGLM(buildMessages(messages), null);
        } catch (Exception e) {
            throw new BusinessException("ChatGLM LLM调用失败: " + e.getMessage());
        }
    }

    @Override
    public String chatWithPrompt(String prompt, List<ChatMessage> history) {
        try {
            String apiKey = aiConfig.getChatglm().getApiKey();
            if (apiKey == null || apiKey.isEmpty() || apiKey.contains("your-chatglm")) {
                return getMockResponse(history);
            }
            List<Map<String, Object>> msgs = new ArrayList<>();
            if (prompt != null) {
                Map<String, Object> systemMsg = new HashMap<>();
                systemMsg.put("role", "system");
                systemMsg.put("content", prompt);
                msgs.add(systemMsg);
            }
            if (history != null) {
                for (ChatMessage msg : history) {
                    Map<String, Object> m = new HashMap<>();
                    m.put("role", convertRole(msg.getRole()));
                    m.put("content", msg.getContent());
                    msgs.add(m);
                }
            }
            return callChatGLM(msgs, prompt);
        } catch (Exception e) {
            throw new BusinessException("ChatGLM LLM调用失败: " + e.getMessage());
        }
    }

    private String callChatGLM(List<Map<String, Object>> messages, String systemPrompt) {
        try {
            String apiKey = aiConfig.getChatglm().getApiKey();
            String model = aiConfig.getChatglm().getModel();
            String baseUrl = aiConfig.getChatglm().getBaseUrl();

            System.out.println("=== ChatGLM API 调用 ===");
            System.out.println("API Key: " + apiKey);
            System.out.println("Model: " + model);
            System.out.println("Base URL: " + baseUrl);
            System.out.println("Messages: " + messages);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("model", model);
            body.put("messages", messages);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            String url = baseUrl + "/chat/completions";
            System.out.println("Request URL: " + url);

            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            System.out.println("Response: " + response);

            if (response.getBody() != null && response.getBody().containsKey("choices")) {
                List choices = (List) response.getBody().get("choices");
                if (!choices.isEmpty()) {
                    Map choice = (Map) choices.get(0);
                    Map message = (Map) choice.get("message");
                    return (String) message.get("content");
                }
            }
            return "Sorry, I couldn't generate a response.";
        } catch (Exception e) {
            System.out.println("=== ChatGLM API 错误 ===");
            e.printStackTrace();
            return getMockResponse(null);
        }
    }

    private List<Map<String, Object>> buildMessages(List<ChatMessage> messages) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (ChatMessage msg : messages) {
            Map<String, Object> m = new HashMap<>();
            m.put("role", convertRole(msg.getRole()));
            m.put("content", msg.getContent());
            result.add(m);
        }
        return result;
    }

    private String convertRole(String role) {
        switch (role.toUpperCase()) {
            case "USER":
                return "user";
            case "AI":
            case "ASSISTANT":
                return "assistant";
            case "SYSTEM":
                return "system";
            default:
                return role.toLowerCase();
        }
    }

    private String getMockResponse(List<ChatMessage> messages) {
        if (messages == null || messages.isEmpty()) {
            return "Hello! I'm ChatGLM. How can I help you practice English today?";
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