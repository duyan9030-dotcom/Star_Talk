package com.startalk.startalk.ai.service.impl;

import com.startalk.startalk.ai.config.AiConfig;
import com.startalk.startalk.ai.service.TtsService;
import com.startalk.startalk.exception.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.Base64;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

@Service
public class XunfeiTtsServiceImpl implements TtsService {

    @Autowired
    private AiConfig aiConfig;

    @Override
    public String textToSpeech(String text, String speed) {
        try {
            String appid = aiConfig.getXunfei().getAppid();
            String apiKey = aiConfig.getXunfei().getApiKey();
            String apiSecret = aiConfig.getXunfei().getApiSecret();

            if (appid == null || appid.isEmpty() || apiKey == null || apiKey.isEmpty()) {
                return generateMockTtsUrl(text, speed);
            }

            return callXunfeiTtsWebSocket(text, speed, appid, apiKey, apiSecret);
        } catch (Exception e) {
            throw new BusinessException("语音合成失败: " + e.getMessage());
        }
    }

    @Override
    public String textToSpeech(String text) {
        return textToSpeech(text, "50");
    }

    private String callXunfeiTtsWebSocket(String text, String speed, String appid, String apiKey, String apiSecret) {
        try {
            System.out.println("=== 讯飞 TTS WebSocket 调用 ===");

            String hostUrl = aiConfig.getXunfei().getTtsUrl().replace("wss://", "wss://").replace("ws://", "ws://");
            String wsUrl = buildWsUrl(hostUrl, appid, apiKey, apiSecret);

            System.out.println("WebSocket URL: " + wsUrl);

            List<byte[]> audioChunks = new ArrayList<>();
            CountDownLatch latch = new CountDownLatch(1);
            Exception[] error = new Exception[1];

            WebSocketClient client = new WebSocketClient(new URI(wsUrl)) {
                @Override
                public void onOpen(ServerHandshake handshakedata) {
                    System.out.println("WebSocket 连接打开");
                    try {
                        String request = buildTtsRequest(text, speed, appid);
                        System.out.println("发送 TTS 请求: " + request);
                        send(request);
                    } catch (Exception e) {
                        error[0] = e;
                        latch.countDown();
                    }
                }

                @Override
                public void onMessage(String message) {
                    System.out.println("收到消息: " + message);
                    try {
                        if (message.contains("\"code\":")) {
                            if (message.contains("\"code\":0") || message.contains("\"code\": 0")) {
                            } else {
                                error[0] = new BusinessException("TTS错误: " + message);
                                latch.countDown();
                            }
                        }
                        if (message.contains("\"data\":")) {
                            int dataIndex = message.indexOf("\"data\":") + 8;
                            int endIndex = message.indexOf("\"", dataIndex);
                            if (endIndex == -1) endIndex = message.length();
                            String base64Audio = message.substring(dataIndex, endIndex).trim();
                            if (!base64Audio.isEmpty()) {
                                audioChunks.add(Base64.getDecoder().decode(base64Audio));
                            }
                        }
                        if (message.contains("\"status\":2") || message.contains("\"status\": 2")) {
                            close();
                            latch.countDown();
                        }
                    } catch (Exception e) {
                        error[0] = e;
                        latch.countDown();
                    }
                }

                @Override
                public void onClose(int code, String reason, boolean remote) {
                    System.out.println("WebSocket 关闭: " + code + " " + reason);
                    latch.countDown();
                }

                @Override
                public void onError(Exception ex) {
                    System.out.println("WebSocket 错误: " + ex.getMessage());
                    error[0] = ex;
                    latch.countDown();
                }
            };

            client.connect();
            boolean completed = latch.await(30, TimeUnit.SECONDS);

            if (error[0] != null) {
                throw error[0];
            }

            if (!completed) {
                client.close();
                throw new BusinessException("TTS 请求超时");
            }

            if (audioChunks.isEmpty()) {
                return generateMockTtsUrl(text, speed);
            }

            byte[] allAudio = new byte[0];
            for (byte[] chunk : audioChunks) {
                byte[] temp = new byte[allAudio.length + chunk.length];
                System.arraycopy(allAudio, 0, temp, 0, allAudio.length);
                System.arraycopy(chunk, 0, temp, allAudio.length, chunk.length);
                allAudio = temp;
            }

            System.out.println("音频数据大小: " + allAudio.length + " bytes");
            String base64Audio = Base64.getEncoder().encodeToString(allAudio);
            return "data:audio/mp3;base64," + base64Audio;

        } catch (Exception e) {
            System.out.println("=== 讯飞TTS错误 ===");
            e.printStackTrace();
            return generateMockTtsUrl(text, speed);
        }
    }

    private String buildWsUrl(String hostUrl, String appid, String apiKey, String apiSecret) {
        try {
            long ts = System.currentTimeMillis() / 1000;
            String host = hostUrl.replace("wss://", "").replace("ws://", "").split("/")[0];
            String dateStr = new java.text.SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss Z", java.util.Locale.US).format(new Date(ts * 1000));
            String signatureOrigin = "host: " + host + "\n" +
                                    "date: " + dateStr + "\n" +
                                    "GET /v2/tts HTTP/1.1";

            System.out.println("=== 讯飞签名调试 ===");
            System.out.println("APPID: " + appid);
            System.out.println("API Key: " + apiKey);
            System.out.println("API Secret: " + apiSecret);
            System.out.println("Host: " + host);
            System.out.println("Date: " + dateStr);
            System.out.println("Timestamp: " + ts);
            System.out.println("Signature Origin:\n" + signatureOrigin);

            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(apiSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(signatureOrigin.getBytes(StandardCharsets.UTF_8));
            String signature = Base64.getEncoder().encodeToString(hash);
            System.out.println("Signature (base64): " + signature);

            String authorizationOrigin = "api_key=\"" + apiKey + "\", algorithm=\"hmac-sha256\", headers=\"host date request-line\", signature=\"" + signature + "\"";
            System.out.println("Authorization Origin: " + authorizationOrigin);

            String encodedAuth = Base64.getEncoder().encodeToString(authorizationOrigin.getBytes(StandardCharsets.UTF_8));
            System.out.println("Encoded Auth: " + encodedAuth);

            String wsUrl = hostUrl + "?authorization=" + encodedAuth + "&date=" + URLEncoder.encode(dateStr, "UTF-8") + "&host=" + host;
            System.out.println("最终WS URL: " + wsUrl);
            System.out.println("====================");

            return wsUrl;
        } catch (Exception e) {
            System.out.println("构建WS URL失败: " + e.getMessage());
            e.printStackTrace();
            return hostUrl;
        }
    }

    private String buildTtsRequest(String text, String speed, String appid) {
        Map<String, Object> request = new HashMap<>();
        request.put("appid", appid);
        request.put("timestamp", System.currentTimeMillis() / 1000);

        Map<String, Object> business = new HashMap<>();
        business.put("aue", "lame");
        business.put("auf", "audio/L16;rate=16000");
        business.put("vcn", aiConfig.getXunfei().getTtsVoice() != null ? aiConfig.getXunfei().getTtsVoice() : "xiaoyan");
        business.put("speed", speed != null ? speed : "50");
        business.put("pitch", "50");
        business.put("volume", "50");
        business.put("tte", "utf8");

        Map<String, Object> data = new HashMap<>();
        data.put("status", 2);
        data.put("text", Base64.getEncoder().encodeToString(text.getBytes(StandardCharsets.UTF_8)));

        request.put("business", business);
        request.put("data", data);

        return new com.alibaba.fastjson.JSONObject(request).toString();
    }

    private String generateMockTtsUrl(String text, String speed) {
        try {
            return "https://tts.example.com/audio?text=" + URLEncoder.encode(text, "UTF-8") + "&speed=" + speed;
        } catch (Exception e) {
            return "https://tts.example.com/audio?text=" + text;
        }
    }
}