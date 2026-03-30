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
public class GeminiLlmServiceImpl implements LlmService {

    @Autowired
    private AiConfig aiConfig;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String chat(List<ChatMessage> messages) {
        try {
            String apiKey = aiConfig.getGemini().getApiKey();
            if (apiKey == null || apiKey.isEmpty() || apiKey.contains("your-gemini")) {
                return getMockResponse(messages);
            }
            return callGemini(buildContents(messages), null);
        } catch (Exception e) {
            throw new BusinessException("Gemini LLM调用失败: " + e.getMessage());
        }
    }

    @Override
    public String chatWithPrompt(String prompt, List<ChatMessage> history) {
        try {
            String apiKey = aiConfig.getGemini().getApiKey();
            if (apiKey == null || apiKey.isEmpty() || apiKey.contains("your-gemini")) {
                return getMockResponse(history);
            }
            List<Map<String, String>> contents = new ArrayList<>();
            if (history != null) {
                for (ChatMessage msg : history) {
                    contents.add(Map.of("role", msg.getRole(), "parts", "[{\"text\": \"" + msg.getContent() + "\"}]"));
                }
            }
            return callGemini(contents, prompt);
        } catch (Exception e) {
            throw new BusinessException("Gemini LLM调用失败: " + e.getMessage());
        }
    }

    private String callGemini(List<Map<String, String>> contents, String systemPrompt) {
        try {
            String apiKey = aiConfig.getGemini().getApiKey();
            String model = aiConfig.getGemini().getModel();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = new HashMap<>();
            body.put("contents", contents);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey;
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            if (response.getBody() != null && response.getBody().containsKey("candidates")) {
                List candidates = (List) response.getBody().get("candidates");
                if (!candidates.isEmpty()) {
                    Map candidate = (Map) candidates.get(0);
                    Map content = (Map) candidate.get("content");
                    List parts = (List) content.get("parts");
                    if (!parts.isEmpty()) {
                        Map part = (Map) parts.get(0);
                        return (String) part.get("text");
                    }
                }
            }
            return "Sorry, I couldn't generate a response.";
        } catch (Exception e) {
            return getMockResponse(null);
        }
    }

    private List<Map<String, String>> buildContents(List<ChatMessage> messages) {
        List<Map<String, String>> result = new ArrayList<>();
        for (ChatMessage msg : messages) {
            result.add(Map.of("role", msg.getRole(), "parts", "[{\"text\": \"" + msg.getContent() + "\"}]"));
        }
        return result;
    }

    private String getMockResponse(List<ChatMessage> messages) {
        if (messages == null || messages.isEmpty()) {
            return "Hello! I'm Gemini. How can I help you practice English today?";
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