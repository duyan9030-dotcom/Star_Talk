package com.startalk.startalk.service.impl;

import cn.hutool.core.util.RandomUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.startalk.startalk.entity.User;
import com.startalk.startalk.enums.UserRole;
import com.startalk.startalk.exception.BusinessException;
import com.startalk.startalk.mapper.UserMapper;
import com.startalk.startalk.service.SmsService;
import com.startalk.startalk.service.UserService;
import com.startalk.startalk.utils.JwtUtil;
import com.startalk.startalk.utils.RedisUtil;
import com.startalk.startalk.vo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.concurrent.TimeUnit;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RedisUtil redisUtil;

    @Autowired
    private SmsService smsService;

    private static final String SMS_CODE_PREFIX = "sms:code:";
    private static final long SMS_CODE_EXPIRE = 5L;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public LoginResponse wechatLogin(String code) {
        String openid = getWechatOpenid(code);
        if (!StringUtils.hasText(openid)) {
            throw new BusinessException("微信登录失败");
        }

        User user = userMapper.selectByOpenid(openid);
        boolean isNewUser = false;
        if (user == null) {
            user = new User();
            user.setOpenid(openid);
            user.setRole(UserRole.STUDENT);
            user.setStatus(1);
            userMapper.insert(user);
            isNewUser = true;
        }

        return buildLoginResponse(user, isNewUser);
    }

    @Override
    public LoginResponse phoneLogin(String phone, String smsCode) {
        if (!StringUtils.hasText(phone)) {
            throw new BusinessException("手机号不能为空");
        }

        User user = userMapper.selectByPhone(phone);
        boolean isNewUser = false;
        if (user == null) {
            throw new BusinessException("用户不存在，请先注册");
        }

        if (StringUtils.hasText(smsCode)) {
            String cachedCode = (String) redisUtil.get(SMS_CODE_PREFIX + phone);
            if (cachedCode == null || !cachedCode.equals(smsCode)) {
                throw new BusinessException("验证码错误或已过期");
            }
        } else {
            throw new BusinessException("验证码不能为空");
        }

        return buildLoginResponse(user, isNewUser);
    }

    public LoginResponse passwordLogin(String phone, String password) {
        if (!StringUtils.hasText(phone) || !StringUtils.hasText(password)) {
            throw new BusinessException("手机号和密码不能为空");
        }

        User user = userMapper.selectByPhone(phone);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        if (user.getPassword() == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new BusinessException("密码错误");
        }

        return buildLoginResponse(user, false);
    }

    @Override
    public User register(RegisterRequest request) {
        if (!StringUtils.hasText(request.getPhone()) || !StringUtils.hasText(request.getSmsCode())) {
            throw new BusinessException("手机号和验证码不能为空");
        }

        String cachedCode = (String) redisUtil.get(SMS_CODE_PREFIX + request.getPhone());
        if (cachedCode == null || !cachedCode.equals(request.getSmsCode())) {
            throw new BusinessException("验证码错误或已过期");
        }

        User existUser = userMapper.selectByPhone(request.getPhone());
        if (existUser != null) {
            throw new BusinessException("该手机号已注册");
        }

        User user = new User();
        user.setPhone(request.getPhone());
        user.setNickname(request.getNickname() != null ? request.getNickname() : "StarTalk用户" + RandomUtil.randomNumbers(6));
        user.setRole(request.getRole() != null ? request.getRole() : UserRole.STUDENT);
        user.setAge(request.getAge());
        user.setGrade(request.getGrade());
        user.setStatus(1);

        userMapper.insert(user);
        redisUtil.delete(SMS_CODE_PREFIX + request.getPhone());

        return user;
    }

    @Override
    public User updateUserInfo(UserVO userVO) {
        if (userVO.getId() == null) {
            throw new BusinessException("用户ID不能为空");
        }

        User user = userMapper.selectById(userVO.getId());
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        if (StringUtils.hasText(userVO.getNickname())) {
            user.setNickname(userVO.getNickname());
        }
        if (StringUtils.hasText(userVO.getAvatar())) {
            user.setAvatar(userVO.getAvatar());
        }
        if (userVO.getAge() != null) {
            user.setAge(userVO.getAge());
        }
        if (StringUtils.hasText(userVO.getGrade())) {
            user.setGrade(userVO.getGrade());
        }

        userMapper.updateById(user);
        return user;
    }

    @Override
    public User switchRole(Long userId, UserRole role) {
        if (userId == null || role == null) {
            throw new BusinessException("参数错误");
        }

        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        user.setRole(role);
        userMapper.updateById(user);
        return user;
    }

    @Override
    public User getUserById(Long userId) {
        return userMapper.selectById(userId);
    }

    @Override
    public void sendSmsCode(String phone) {
        if (!StringUtils.hasText(phone)) {
            throw new BusinessException("手机号不能为空");
        }

        if (!phone.matches("^1[3-9]\\d{9}$")) {
            throw new BusinessException("手机号格式不正确");
        }

        String code = RandomUtil.randomNumbers(6);
        redisUtil.set(SMS_CODE_PREFIX + phone, code, SMS_CODE_EXPIRE, TimeUnit.MINUTES);

        try {
            smsService.sendLoginCode(phone, code);
        } catch (Exception e) {
            redisUtil.delete(SMS_CODE_PREFIX + phone);
            throw new BusinessException("短信发送失败，请稍后重试");
        }
    }

    private String getWechatOpenid(String code) {
        return "mock_openid_" + code;
    }

    private LoginResponse buildLoginResponse(User user, boolean isNewUser) {
        String token = jwtUtil.generateToken(user.getId(), user.getRole().getCode());

        UserVO userVO = new UserVO();
        userVO.setId(user.getId());
        userVO.setOpenid(user.getOpenid());
        userVO.setUnionid(user.getUnionid());
        userVO.setPhone(user.getPhone());
        userVO.setNickname(user.getNickname());
        userVO.setAvatar(user.getAvatar());
        userVO.setAge(user.getAge());
        userVO.setGrade(user.getGrade());
        userVO.setRole(user.getRole());
        userVO.setStatus(user.getStatus());

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUser(userVO);
        response.setIsNewUser(isNewUser);

        return response;
    }
}