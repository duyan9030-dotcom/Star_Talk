package com.startalk.startalk.ai.service.impl;

import com.alibaba.fastjson.JSON;
import com.startalk.startalk.ai.config.AiConfig;
import com.startalk.startalk.ai.service.SttService;
import com.startalk.startalk.exception.BusinessException;
import okhttp3.*;
import org.springframework.context.annotation.Primary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URL;
import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

@Service
@Primary
public class XunfeiSttServiceImpl implements SttService {

    @Autowired
    private AiConfig aiConfig;

    private static final int StatusFirstFrame = 0;
    private static final int StatusContinueFrame = 1;
    private static final int StatusLastFrame = 2;

    @Override
    public String speechToText(String audioUrl) {
        return "STT from URL: " + audioUrl;
    }

    @Override
    public String speechToText(byte[] audioData) {
        try {
            String appid = aiConfig.getXunfei().getAppid();
            String apiKey = aiConfig.getXunfei().getApiKey();
            String apiSecret = aiConfig.getXunfei().getApiSecret();

            if (appid == null || appid.isEmpty() || apiKey == null || apiKey.isEmpty()) {
                return invokeMockStt(audioData);
            }

            return callXunfeiIat(audioData, appid, apiKey, apiSecret);
        } catch (Exception e) {
            throw new BusinessException("语音识别失败: " + e.getMessage());
        }
    }

    public String speechToTextBase64(String base64Audio) {
        try {
            String appid = aiConfig.getXunfei().getAppid();
            String apiKey = aiConfig.getXunfei().getApiKey();
            String apiSecret = aiConfig.getXunfei().getApiSecret();

            if (appid == null || appid.isEmpty() || apiKey == null || apiKey.isEmpty()) {
                return "Mock STT result - Please configure xunfei credentials";
            }

            byte[] audioData = Base64.getDecoder().decode(base64Audio);
            return callXunfeiIat(audioData, appid, apiKey, apiSecret);
        } catch (Exception e) {
            throw new BusinessException("语音识别失败: " + e.getMessage());
        }
    }

    private String callXunfeiIat(byte[] audioData, String appid, String apiKey, String apiSecret) throws Exception {
        System.out.println("=== 讯飞 IAT WebSocket 调用 (官方标准) ===");
        System.out.println("APPID: " + appid);

        String hostUrl = aiConfig.getXunfei().getSttUrl();
        String authUrl = getAuthUrl(hostUrl, apiKey, apiSecret);
        String url = authUrl.replace("http://", "ws://").replace("https://", "wss://");

        System.out.println("WebSocket URL: " + url);

        StringBuilder result = new StringBuilder();
        CountDownLatch latch = new CountDownLatch(1);
        Exception[] error = new Exception[1];

        OkHttpClient client = new OkHttpClient.Builder().build();
        Request request = new Request.Builder().url(url).build();

        WebSocket webSocket = client.newWebSocket(request, new WebSocketListener() {
            @Override
            public void onOpen(WebSocket webSocket, Response response) {
                System.out.println("WebSocket 连接打开");
                new Thread(() -> {
                    int frameSize = 1280;
                    int intervel = 40;
                    int status = 0;

                    try {
                        int offset = 0;
                        while (offset < audioData.length) {
                            int len = Math.min(frameSize, audioData.length - offset);
                            byte[] buffer = Arrays.copyOfRange(audioData, offset, offset + len);
                            offset += len;

                            if (offset >= audioData.length) {
                                status = StatusLastFrame;
                            }

                            String json;
                            switch (status) {
                                case StatusFirstFrame:
                                    json = buildFirstFrame(appid, buffer);
                                    webSocket.send(json);
                                    System.out.println("第一帧发送...");
                                    status = StatusContinueFrame;
                                    break;
                                case StatusContinueFrame:
                                    json = buildContinueFrame(buffer);
                                    webSocket.send(json);
                                    break;
                                case StatusLastFrame:
                                    json = buildLastFrame();
                                    webSocket.send(json);
                                    System.out.println("最后一帧发送...");
                                    break;
                            }
                            Thread.sleep(intervel);
                        }
                        System.out.println("所有音频帧发送完毕");
                    } catch (Exception e) {
                        error[0] = e;
                        latch.countDown();
                    }
                }).start();
            }

            @Override
            public void onMessage(WebSocket webSocket, String text) {
                System.out.println("收到消息: " + text);
                try {
                    IatResponseData resp = JSON.parseObject(text, IatResponseData.class);
                    if (resp != null) {
                        if (resp.code != 0) {
                            error[0] = new BusinessException("IAT错误: code=" + resp.code + " message=" + resp.message);
                            webSocket.close(1000, "");
                            latch.countDown();
                            return;
                        }
                        if (resp.data != null && resp.data.result != null) {
                            String decoded = decodeResult(resp.data.result);
                            if (decoded != null && !decoded.isEmpty()) {
                                result.append(decoded);
                                System.out.println("中间识别结果: " + decoded);
                            }
                        }
                        if (resp.data != null && resp.data.status == 2) {
                            System.out.println("识别完成，最终结果: " + result.toString());
                            webSocket.close(1000, "");
                            latch.countDown();
                        }
                    }
                } catch (Exception e) {
                    error[0] = e;
                    latch.countDown();
                }
            }

            @Override
            public void onFailure(WebSocket webSocket, Throwable t, Response response) {
                System.out.println("WebSocket 错误: " + t.getMessage());
                if (response != null) {
                    try {
                        System.out.println("onFailure code: " + response.code());
                        if (response.body() != null) {
                            System.out.println("onFailure body: " + response.body().string());
                        }
                    } catch (Exception e) {
                    }
                }
                error[0] = new BusinessException("WebSocket错误: " + t.getMessage());
                latch.countDown();
            }

            @Override
            public void onClosed(WebSocket webSocket, int code, String reason) {
                System.out.println("WebSocket 关闭: " + code + " " + reason);
            }
        });

        boolean completed = latch.await(60, TimeUnit.SECONDS);
        if (error[0] != null) {
            throw error[0];
        }
        if (!completed) {
            webSocket.close(1000, "");
            throw new BusinessException("IAT 请求超时");
        }

        String sttResult = result.toString();
        if (sttResult.isEmpty()) {
            return invokeMockStt(audioData);
        }

        System.out.println("IAT 识别结果: " + sttResult);
        return sttResult;
    }

    private String buildFirstFrame(String appid, byte[] audioData) {
        Map<String, Object> frame = new HashMap<>();
        Map<String, Object> common = new HashMap<>();
        common.put("app_id", appid);

        Map<String, Object> business = new HashMap<>();
        business.put("language", "en_us");
        business.put("domain", "iat");
        business.put("accent", "mandarin");
        business.put("dwa", "wpgs");

        Map<String, Object> data = new HashMap<>();
        data.put("status", StatusFirstFrame);
        data.put("format", "audio/L16;rate=16000");
        data.put("encoding", "raw");
        data.put("audio", Base64.getEncoder().encodeToString(audioData));

        frame.put("common", common);
        frame.put("business", business);
        frame.put("data", data);

        return JSON.toJSONString(frame);
    }

    private String buildContinueFrame(byte[] audioData) {
        Map<String, Object> frame = new HashMap<>();
        Map<String, Object> data = new HashMap<>();
        data.put("status", StatusContinueFrame);
        data.put("format", "audio/L16;rate=16000");
        data.put("encoding", "raw");
        data.put("audio", Base64.getEncoder().encodeToString(audioData));
        frame.put("data", data);
        return JSON.toJSONString(frame);
    }

    private String buildLastFrame() {
        Map<String, Object> frame = new HashMap<>();
        Map<String, Object> data = new HashMap<>();
        data.put("status", StatusLastFrame);
        data.put("audio", "");
        data.put("format", "audio/L16;rate=16000");
        data.put("encoding", "raw");
        frame.put("data", data);
        return JSON.toJSONString(frame);
    }

    private String decodeResult(IatResult result) {
        if (result.ws == null || result.ws.length == 0) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        for (IatWs ws : result.ws) {
            if (ws.cw != null && ws.cw.length > 0) {
                sb.append(ws.cw[0].w);
            }
        }
        return sb.toString();
    }

    private String getAuthUrl(String hostUrl, String apiKey, String apiSecret) throws Exception {
        URL url = new URL(hostUrl);
        SimpleDateFormat format = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss z", Locale.US);
        format.setTimeZone(TimeZone.getTimeZone("GMT"));
        String date = format.format(new Date());

        StringBuilder builder = new StringBuilder();
        builder.append("host: ").append(url.getHost()).append("\n");
        builder.append("date: ").append(date).append("\n");
        builder.append("GET ").append(url.getPath()).append(" HTTP/1.1");

        Charset charset = Charset.forName("UTF-8");
        Mac mac = Mac.getInstance("hmacsha256");
        SecretKeySpec spec = new SecretKeySpec(apiSecret.getBytes(charset), "hmacsha256");
        mac.init(spec);
        byte[] hexDigits = mac.doFinal(builder.toString().getBytes(charset));
        String sha = Base64.getEncoder().encodeToString(hexDigits);

        String authorization = String.format("api_key=\"%s\", algorithm=\"%s\", headers=\"%s\", signature=\"%s\"",
                apiKey, "hmac-sha256", "host date request-line", sha);

        HttpUrl httpUrl = HttpUrl.parse("https://" + url.getHost() + url.getPath()).newBuilder()
                .addQueryParameter("authorization", Base64.getEncoder().encodeToString(authorization.getBytes(charset)))
                .addQueryParameter("date", date)
                .addQueryParameter("host", url.getHost())
                .build();

        return httpUrl.toString();
    }

    private String invokeMockStt(byte[] audioData) {
        return "Mock STT result from audio data (" + (audioData != null ? audioData.length : 0) + " bytes)";
    }

    static class IatResponseData {
        int code;
        String message;
        String sid;
        IatData data;
    }

    static class IatData {
        int status;
        IatResult result;
    }

    static class IatResult {
        int bg;
        int ed;
        String pgs;
        int[] rg;
        int sn;
        IatWs[] ws;
        boolean ls;
    }

    static class IatWs {
        IatCw[] cw;
        int bg;
        int ed;
    }

    static class IatCw {
        int sc;
        String w;
    }
}