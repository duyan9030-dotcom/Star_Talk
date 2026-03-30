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
public class OpenAiLlmServiceImpl implements LlmService {

    @Autowired
    private AiConfig aiConfig;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String chat(List<ChatMessage> messages) {
        try {
            String apiKey = aiConfig.getOpenai().getApiKey();
            if (apiKey == null || apiKey.isEmpty() || apiKey.contains("your-openai")) {
                return getMockResponse(messages);
            }
            return callOpenAi(buildMessages(messages), null);
        } catch (Exception e) {
            throw new BusinessException("OpenAI LLM调用失败: " + e.getMessage());
        }
    }

    @Override
    public String chatWithPrompt(String prompt, List<ChatMessage> history) {
        try {
            String apiKey = aiConfig.getOpenai().getApiKey();
            if (apiKey == null || apiKey.isEmpty() || apiKey.contains("your-openai")) {
                return getMockResponse(history);
            }
            List<Map<String, String>> msgs = new ArrayList<>();
            if (prompt != null) {
                msgs.add(Map.of("role", "system", "content", prompt));
            }
            if (history != null) {
                for (ChatMessage msg : history) {
                    msgs.add(Map.of("role", msg.getRole(), "content", msg.getContent()));
                }
            }
            return callOpenAi(msgs, prompt);
        } catch (Exception e) {
            throw new BusinessException("OpenAI LLM调用失败: " + e.getMessage());
        }
    }

    private String callOpenAi(List<Map<String, String>> messages, String systemPrompt) {
        try {
            String baseUrl = aiConfig.getOpenai().getBaseUrl();
            String model = aiConfig.getOpenai().getModel();
            String apiKey = aiConfig.getOpenai().getApiKey();
            Double temperature = aiConfig.getOpenai().getTemperature();
            Integer maxTokens = aiConfig.getOpenai().getMaxTokens();
            Double topP = aiConfig.getOpenai().getTopP();

            // 处理环境变量
            if (apiKey != null && apiKey.startsWith("$")) {
                apiKey = System.getenv(apiKey.substring(1));
            }

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
            
            // 设置参数
            if (temperature != null) {
                body.put("temperature", temperature);
            }
            if (maxTokens != null) {
                body.put("max_tokens", maxTokens);
            }
            if (topP != null) {
                body.put("top_p", topP);
            }

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            // 构建 URL - 支持 NVIDIA 风格的完整 base_url
            String url = baseUrl.endsWith("/") ? baseUrl + "chat/completions" : baseUrl + "/chat/completions";
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

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
            return "Hello! I'm GPT. How can I help you practice English today?";
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