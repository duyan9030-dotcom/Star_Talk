package com.startalk.startalk.center.controller;

import com.startalk.startalk.center.service.CenterService;
import com.startalk.startalk.center.vo.FeedbackRequest;
import com.startalk.startalk.center.vo.UserInfoVO;
import com.startalk.startalk.center.vo.UserSettingVO;
import com.startalk.startalk.vo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/center")
public class CenterController {

    @Autowired
    private CenterService centerService;

    @GetMapping("/userInfo")
    public Result<UserInfoVO> getUserInfo(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(centerService.getUserInfo(userId));
    }

    @GetMapping("/setting")
    public Result<UserSettingVO> getUserSetting(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(centerService.getUserSetting(userId));
    }

    @PutMapping("/setting")
    public Result<UserSettingVO> updateUserSetting(@RequestBody UserSettingVO settingVO,
                                                   HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(centerService.updateUserSetting(userId, settingVO));
    }

    @PostMapping("/feedback")
    public Result<Void> submitFeedback(@RequestBody FeedbackRequest feedbackRequest,
                                      HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        centerService.submitFeedback(userId, feedbackRequest);
        return Result.success();
    }

    @GetMapping("/feedback/list")
    public Result<List> getFeedbackList(HttpServletRequest request) {
        return Result.success(List.of());
    }

    @PostMapping("/logout")
    public Result<Void> logout(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        centerService.logout(userId);
        return Result.success();
    }
}