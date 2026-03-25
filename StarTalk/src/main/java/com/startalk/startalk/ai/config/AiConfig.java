package com.startalk.startalk.ai.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "ai")
public class AiConfig {
    private String provider = "mock";
    private DashScope dashscope = new DashScope();
    private OpenAi openai = new OpenAi();
    private Gemini gemini = new Gemini();
    private ChatGLM chatglm = new ChatGLM();
    private Xunfei xunfei = new Xunfei();

    @Data
    public static class DashScope {
        private String apiKey;
        private String model = "qwen-turbo";
    }

    @Data
    public static class OpenAi {
        private String apiKey;
        private String model = "gpt-3.5-turbo";
        private String baseUrl = "https://api.openai.com";
    }

    @Data
    public static class Gemini {
        private String apiKey;
        private String model = "gemini-pro";
    }

    @Data
    public static class ChatGLM {
        private String apiKey;
        private String model = "glm-4";
        private String baseUrl = "https://open.bigmodel.cn/api/paas/v4";
    }

    @Data
    public static class Xunfei {
        private String appid;
        private String apiKey;
        private String apiSecret;
        private String sttUrl;
        private String ttsUrl;
        private String ttsVoice;
    }
}