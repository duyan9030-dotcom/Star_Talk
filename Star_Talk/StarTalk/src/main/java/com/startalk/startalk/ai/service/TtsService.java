package com.startalk.startalk.ai.service;

public interface TtsService {

    String textToSpeech(String text, String speed);

    String textToSpeech(String text);
}