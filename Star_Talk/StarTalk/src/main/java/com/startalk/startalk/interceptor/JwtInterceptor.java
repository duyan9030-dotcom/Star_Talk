package com.startalk.startalk.interceptor;

import com.startalk.startalk.exception.BusinessException;
import com.startalk.startalk.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class JwtInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    public JwtInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String token = request.getHeader("Authorization");
        if (!StringUtils.hasText(token)) {
            throw new BusinessException(401, "未登录");
        }

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        try {
            Claims claims = jwtUtil.getClaimsFromToken(token);
            String role = (String) claims.get("role");
            if ("ADMIN".equals(role)) {
                request.setAttribute("adminId", Long.valueOf(claims.getSubject()));
            } else {
                request.setAttribute("userId", Long.valueOf(claims.getSubject()));
            }
            request.setAttribute("role", role);
            return true;
        } catch (Exception e) {
            throw new BusinessException(401, "登录已过期，请重新登录");
        }
    }
}