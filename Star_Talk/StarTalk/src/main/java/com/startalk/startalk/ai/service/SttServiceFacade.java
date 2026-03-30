package com.startalk.startalk.ai.service;

import com.startalk.startalk.ai.config.AiConfig;
import com.startalk.startalk.ai.service.impl.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SttServiceFacade {

    @Autowired
    private AiConfig aiConfig;

    @Autowired
    private MockSttServiceImpl mockSttService;

    @Autowired
    private XunfeiSttServiceImpl xunfeiSttService;

    private SttService getSttService() {
        if (isXunfeiConfigured()) {
            return xunfeiSttService;
        }
        String provider = aiConfig.getProvider();
        switch (provider.toLowerCase()) {
            case "xunfei":
                return xunfeiSttService;
            case "mock":
            default:
                return mockSttService;
        }
    }

    private boolean isXunfeiConfigured() {
        try {
            String appid = aiConfig.getXunfei().getAppid();
            String apiKey = aiConfig.getXunfei().getApiKey();
            return appid != null && !appid.isEmpty() && !appid.contains("your")
                && apiKey != null && !apiKey.isEmpty() && !apiKey.contains("your");
        } catch (Exception e) {
            return false;
        }
    }

    public String speechToText(String audioUrl) {
        return getSttService().speechToText(audioUrl);
    }

    public String speechToText(byte[] audioData) {
        return getSttService().speechToText(audioData);
    }

    public String speechToTextBase64(String base64Audio) {
        return xunfeiSttService.speechToTextBase64(base64Audio);
    }

    public String getProviderName() {
        String provider = aiConfig.getProvider();
        switch (provider.toLowerCase()) {
            case "xunfei":
                return "科大讯飞 STT";
            case "mock":
            default:
                return "Mock (模拟)";
        }
    }
}