package com.startalk.startalk.ai.service;

public interface SttService {

    String speechToText(String audioUrl);

    String speechToText(byte[] audioData);
}