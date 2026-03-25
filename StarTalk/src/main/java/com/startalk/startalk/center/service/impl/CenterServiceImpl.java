package com.startalk.startalk.center.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.startalk.startalk.center.entity.Feedback;
import com.startalk.startalk.center.entity.UserSetting;
import com.startalk.startalk.center.mapper.CenterFeedbackMapper;
import com.startalk.startalk.center.mapper.UserSettingMapper;
import com.startalk.startalk.center.service.CenterService;
import com.startalk.startalk.center.vo.FeedbackRequest;
import com.startalk.startalk.center.vo.UserInfoVO;
import com.startalk.startalk.center.vo.UserSettingVO;
import com.startalk.startalk.incentive.entity.UserPoints;
import com.startalk.startalk.incentive.mapper.UserPointsMapper;
import com.startalk.startalk.mapper.UserMapper;
import com.startalk.startalk.word.mapper.UserWordRecordMapper;
import com.startalk.startalk.conversation.mapper.SessionMapper;
import com.startalk.startalk.entity.User;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class CenterServiceImpl implements CenterService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private UserSettingMapper userSettingMapper;

    @Autowired
    private CenterFeedbackMapper feedbackMapper;

    @Autowired
    private UserPointsMapper userPointsMapper;

    @Autowired
    private UserWordRecordMapper userWordRecordMapper;

    @Autowired
    private SessionMapper sessionMapper;

    @Override
    public UserInfoVO getUserInfo(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            return null;
        }

        UserInfoVO vo = new UserInfoVO();
        vo.setId(user.getId());
        vo.setNickname(user.getNickname());
        vo.setAvatar(user.getAvatar());
        vo.setAge(user.getAge());
        vo.setGrade(user.getGrade());
        vo.setRole(user.getRole() != null ? user.getRole().getCode() : null);

        Integer masteredWords = userWordRecordMapper.countMasteredWords(userId);
        vo.setTotalWordsLearned(masteredWords != null ? masteredWords : 0);

        Long conversationCount = sessionMapper.selectCount(
                new LambdaQueryWrapper<com.startalk.startalk.conversation.entity.ConversationSession>()
                        .eq(com.startalk.startalk.conversation.entity.ConversationSession::getUserId, userId)
                        .eq(com.startalk.startalk.conversation.entity.ConversationSession::getStatus, 2));
        vo.setTotalConversations(conversationCount != null ? conversationCount.intValue() : 0);

        UserPoints userPoints = userPointsMapper.selectByUserId(userId);
        vo.setTotalPoints(userPoints != null ? userPoints.getTotalPoints() : 0);

        vo.setTotalStudyMinutes(0);

        return vo;
    }

    @Override
    public UserSettingVO getUserSetting(Long userId) {
        UserSetting setting = userSettingMapper.selectByUserId(userId);
        if (setting == null) {
            setting = createDefaultSetting(userId);
        }
        return convertToSettingVO(setting);
    }

    @Override
    @Transactional
    public UserSettingVO updateUserSetting(Long userId, UserSettingVO settingVO) {
        UserSetting setting = userSettingMapper.selectByUserId(userId);
        if (setting == null) {
            setting = createDefaultSetting(userId);
        }

        if (StringUtils.hasText(settingVO.getLanguage())) {
            setting.setLanguage(settingVO.getLanguage());
        }
        if (settingVO.getNotificationEnabled() != null) {
            setting.setNotificationEnabled(settingVO.getNotificationEnabled());
        }
        if (settingVO.getDailyLimit() != null) {
            setting.setDailyLimit(settingVO.getDailyLimit());
        }
        if (StringUtils.hasText(settingVO.getAllowedTimeStart())) {
            setting.setAllowedTimeStart(settingVO.getAllowedTimeStart());
        }
        if (StringUtils.hasText(settingVO.getAllowedTimeEnd())) {
            setting.setAllowedTimeEnd(settingVO.getAllowedTimeEnd());
        }

        userSettingMapper.updateById(setting);
        return convertToSettingVO(setting);
    }

    @Override
    @Transactional
    public void submitFeedback(Long userId, FeedbackRequest request) {
        Feedback feedback = new Feedback();
        feedback.setUserId(userId);
        feedback.setContent(request.getContent());
        feedback.setImages(request.getImages());
        feedback.setStatus(0);
        feedbackMapper.insert(feedback);
    }

    @Override
    public void logout(Long userId) {
    }

    private UserSetting createDefaultSetting(Long userId) {
        UserSetting setting = new UserSetting();
        setting.setUserId(userId);
        setting.setLanguage("zh-CN");
        setting.setNotificationEnabled(true);
        setting.setDailyLimit(60);
        userSettingMapper.insert(setting);
        return setting;
    }

    private UserSettingVO convertToSettingVO(UserSetting setting) {
        UserSettingVO vo = new UserSettingVO();
        BeanUtils.copyProperties(setting, vo);
        return vo;
    }
}