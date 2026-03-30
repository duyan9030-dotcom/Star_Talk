package com.startalk.startalk.controller;

import com.startalk.startalk.ai.service.SttServiceFacade;
import com.startalk.startalk.ai.service.TtsServiceFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private TtsServiceFacade ttsServiceFacade;

    @Autowired
    private SttServiceFacade sttServiceFacade;

    @GetMapping("/hash/{password}")
    public String hashPassword(@PathVariable String password) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.encode(password);
    }

    @GetMapping("/tts/{text}")
    public String testTts(@PathVariable String text) {
        String audioUrl = ttsServiceFacade.textToSpeech(text, "50");
        return "TTS音频URL: " + audioUrl;
    }

    @PostMapping("/tts")
    public String testTtsPost(@RequestParam String text) {
        String audioUrl = ttsServiceFacade.textToSpeech(text, "50");
        return "TTS音频URL: " + audioUrl;
    }

    @PostMapping("/stt")
    public String testStt(@RequestBody java.util.Map<String, String> body) {
        String audio = body.get("audio");
        String result = sttServiceFacade.speechToTextBase64(audio);
        return "STT识别结果: " + result;
    }
}