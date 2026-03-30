package com.startalk.startalk.exception;

import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    private final Integer code;
    private final String message;

    public BusinessException(String message) {
        this.code = 400;
        this.message = message;
    }

    public BusinessException(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}