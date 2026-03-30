package com.startalk.startalk.service;

public interface SmsService {
    void sendLoginCode(String phone, String code);
}