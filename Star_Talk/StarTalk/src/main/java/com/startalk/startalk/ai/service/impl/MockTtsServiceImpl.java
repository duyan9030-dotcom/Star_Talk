package com.startalk.startalk.ai.service.impl;

import com.startalk.startalk.ai.service.TtsService;
import com.startalk.startalk.exception.BusinessException;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;

@Service
public class MockTtsServiceImpl implements TtsService {

    @Override
    public String textToSpeech(String text, String speed) {
        if (text == null || text.isEmpty()) {
            return "Mock TTS: No text provided";
        }
        try {
            String encoded = URLEncoder.encode(text, "UTF-8");
            return "https://tts.example.com/mock/audio.mp3?text=" + encoded + "&speed=" + (speed != null ? speed : "medium");
        } catch (Exception e) {
            throw new BusinessException("TTS生成失败: " + e.getMessage());
        }
    }

    @Override
    public String textToSpeech(String text) {
        return textToSpeech(text, "medium");
    }
}