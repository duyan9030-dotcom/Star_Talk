package com.startalk.startalk.ai.service;

import com.startalk.startalk.ai.config.AiConfig;
import com.startalk.startalk.ai.service.impl.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TtsServiceFacade {

    @Autowired
    private AiConfig aiConfig;

    @Autowired
    private MockTtsServiceImpl mockTtsService;

    @Autowired
    private XunfeiTtsServiceImpl xunfeiTtsService;

    private TtsService getTtsService() {
        boolean configured = isXunfeiConfigured();
        System.out.println("=== TTS Service 选择 ===");
        System.out.println("讯飞配置检测: " + configured);
        if (configured) {
            return xunfeiTtsService;
        }
        String provider = aiConfig.getProvider();
        System.out.println("当前 provider: " + provider);
        switch (provider.toLowerCase()) {
            case "xunfei":
                return xunfeiTtsService;
            case "mock":
            default:
                return mockTtsService;
        }
    }

    private boolean isXunfeiConfigured() {
        try {
            String appid = aiConfig.getXunfei().getAppid();
            String apiKey = aiConfig.getXunfei().getApiKey();
            boolean result = appid != null && !appid.isEmpty() && !appid.contains("your")
                && apiKey != null && !apiKey.isEmpty() && !apiKey.contains("your");
            System.out.println("APPID: " + appid + ", APIKey: " + apiKey);
            return result;
        } catch (Exception e) {
            System.out.println("讯飞配置检测异常: " + e.getMessage());
            return false;
        }
    }

    public String textToSpeech(String text, String speed) {
        return getTtsService().textToSpeech(text, speed);
    }

    public String textToSpeech(String text) {
        return getTtsService().textToSpeech(text);
    }

    public String getProviderName() {
        String provider = aiConfig.getProvider();
        switch (provider.toLowerCase()) {
            case "xunfei":
                return "科大讯飞 TTS";
            case "mock":
            default:
                return "Mock (模拟)";
        }
    }
}