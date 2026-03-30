package com.startalk.startalk.ai.service.impl;

import com.startalk.startalk.ai.service.SttService;
import com.startalk.startalk.exception.BusinessException;
import org.springframework.stereotype.Service;

@Service
public class MockSttServiceImpl implements SttService {

    @Override
    public String speechToText(String audioUrl) {
        if (audioUrl == null || audioUrl.isEmpty()) {
            return "Mock STT: No audio URL provided";
        }
        return "Mock STT result from: " + audioUrl;
    }

    @Override
    public String speechToText(byte[] audioData) {
        if (audioData == null || audioData.length == 0) {
            return "Mock STT: No audio data provided";
        }
        return "Mock STT result from audio data (" + audioData.length + " bytes)";
    }
}