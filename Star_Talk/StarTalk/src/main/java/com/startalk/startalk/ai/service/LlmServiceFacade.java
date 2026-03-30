package com.startalk.startalk.ai.service;

import com.startalk.startalk.ai.config.AiConfig;
import com.startalk.startalk.ai.service.impl.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LlmServiceFacade {

    @Autowired
    private AiConfig aiConfig;

    @Autowired
    private MockLlmServiceImpl mockLlmService;

    @Autowired
    private OpenAiLlmServiceImpl openAiLlmService;

    @Autowired
    private DashScopeLlmServiceImpl dashScopeLlmService;

    @Autowired
    private GeminiLlmServiceImpl geminiLlmService;

    @Autowired
    private ChatGLMLlmServiceImpl chatGlmLlmService;

    private LlmService getLlmService() {
        String provider = aiConfig.getProvider();
        switch (provider.toLowerCase()) {
            case "openai":
                return openAiLlmService;
            case "dashscope":
            case "qwen":
                return dashScopeLlmService;
            case "gemini":
                return geminiLlmService;
            case "chatglm":
            case "zhipu":
                return chatGlmLlmService;
            case "mock":
            default:
                return mockLlmService;
        }
    }

    public String chat(List<ChatMessage> messages) {
        return getLlmService().chat(messages);
    }

    public String chatWithPrompt(String prompt, List<ChatMessage> history) {
        return getLlmService().chatWithPrompt(prompt, history);
    }

    public String getProviderName() {
        String provider = aiConfig.getProvider();
        switch (provider.toLowerCase()) {
            case "openai":
                return "OpenAI GPT";
            case "dashscope":
            case "qwen":
                return "通义千问";
            case "gemini":
                return "Google Gemini";
            case "chatglm":
            case "zhipu":
                return "智谱 ChatGLM";
            case "mock":
            default:
                return "Mock (模拟)";
        }
    }
}