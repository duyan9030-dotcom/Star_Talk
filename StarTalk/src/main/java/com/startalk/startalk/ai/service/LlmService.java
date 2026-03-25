package com.startalk.startalk.ai.service;

import java.util.List;

public interface LlmService {

    String chat(List<ChatMessage> messages);

    String chatWithPrompt(String prompt, List<ChatMessage> history);
}