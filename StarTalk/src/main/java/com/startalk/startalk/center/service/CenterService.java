package com.startalk.startalk.center.service;

import com.startalk.startalk.center.vo.FeedbackRequest;
import com.startalk.startalk.center.vo.UserInfoVO;
import com.startalk.startalk.center.vo.UserSettingVO;

public interface CenterService {

    UserInfoVO getUserInfo(Long userId);

    UserSettingVO getUserSetting(Long userId);

    UserSettingVO updateUserSetting(Long userId, UserSettingVO settingVO);

    void submitFeedback(Long userId, FeedbackRequest request);

    void logout(Long userId);
}