package com.startalk.startalk.controller;

import com.startalk.startalk.entity.User;
import com.startalk.startalk.service.UserService;
import com.startalk.startalk.vo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/wechat/login")
    public Result<LoginResponse> wechatLogin(@RequestBody LoginRequest request) {
        return Result.success(userService.wechatLogin(request.getCode()));
    }

    @PostMapping("/phone/login")
    public Result<LoginResponse> phoneLogin(@RequestBody LoginRequest request) {
        return Result.success(userService.phoneLogin(request.getPhone(), request.getSmsCode()));
    }

    @PostMapping("/password/login")
    public Result<LoginResponse> passwordLogin(@RequestBody LoginRequest request) {
        return Result.success(userService.passwordLogin(request.getPhone(), request.getPassword()));
    }

    @PostMapping("/sendSmsCode")
    public Result<String> sendSmsCode(@RequestParam String phone) {
        userService.sendSmsCode(phone);
        return Result.success("验证码发送成功", null);
    }

    @PostMapping("/register")
    public Result<UserVO> register(@RequestBody RegisterRequest request) {
        User user = userService.register(request);
        return Result.success(convertToUserVO(user));
    }

    private UserVO convertToUserVO(User user) {
        if (user == null) {
            return null;
        }
        UserVO vo = new UserVO();
        vo.setId(user.getId());
        vo.setOpenid(user.getOpenid());
        vo.setUnionid(user.getUnionid());
        vo.setPhone(user.getPhone());
        vo.setNickname(user.getNickname());
        vo.setAvatar(user.getAvatar());
        vo.setAge(user.getAge());
        vo.setGrade(user.getGrade());
        vo.setRole(user.getRole());
        vo.setStatus(user.getStatus());
        return vo;
    }
}