package com.startalk.startalk.service;

import com.startalk.startalk.entity.User;
import com.startalk.startalk.enums.UserRole;
import com.startalk.startalk.vo.*;

public interface UserService {

    LoginResponse wechatLogin(String code);

    LoginResponse phoneLogin(String phone, String smsCode);

    LoginResponse passwordLogin(String phone, String password);

    User register(RegisterRequest request);

    User updateUserInfo(UserVO userVO);

    User switchRole(Long userId, UserRole role);

    User getUserById(Long userId);

    void sendSmsCode(String phone);
}