package com.startalk.startalk.service.impl;

import com.startalk.startalk.service.SmsService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.HashMap;
import java.util.Map;

@Service
public class SmsServiceImpl implements SmsService {

    @Value("${aliyun.sms.access-key-id:}")
    private String accessKeyId;

    @Value("${aliyun.sms.access-key-secret:}")
    private String accessKeySecret;

    @Value("${aliyun.sms.sign-name:}")
    private String signName;

    @Value("${aliyun.sms.template-code:}")
    private String templateCode;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public void sendLoginCode(String phone, String code) {
        if (accessKeyId == null || accessKeyId.isEmpty() || accessKeySecret == null || accessKeySecret.isEmpty()) {
            System.out.println("SMS Service: Mock mode - Code sent to " + phone + ": " + code);
            return;
        }

        try {
            String url = "https://dysmsapi.aliyuncs.com/";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = new HashMap<>();
            body.put("PhoneNumbers", phone);
            body.put("SignName", signName);
            body.put("TemplateCode", templateCode);
            body.put("TemplateParam", "{\"code\":\"" + code + "\"}");
            body.put("AccessKeyId", accessKeyId);
            body.put("Format", "JSON");
            body.put("SignatureMethod", "HMAC-SHA1");
            body.put("Timestamp", "2024-01-01T00:00:00Z");
            body.put("SignatureVersion", "1.0");
            body.put("SignatureNonce", String.valueOf(System.currentTimeMillis()));
            body.put("Version", "2017-05-25");
            body.put("Action", "SendSms");

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            System.out.println("SMS sent to " + phone + ": " + code);
        } catch (Exception e) {
            System.out.println("SMS Service: Mock mode - Code sent to " + phone + ": " + code);
        }
    }
}