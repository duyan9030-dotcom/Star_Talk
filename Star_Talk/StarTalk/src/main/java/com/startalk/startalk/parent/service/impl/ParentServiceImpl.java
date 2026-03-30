package com.startalk.startalk.parent.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.startalk.startalk.center.service.CenterService;
import com.startalk.startalk.entity.User;
import com.startalk.startalk.incentive.entity.CheckinLog;
import com.startalk.startalk.incentive.entity.PointsLog;
import com.startalk.startalk.incentive.mapper.CheckinLogMapper;
import com.startalk.startalk.incentive.mapper.PointsLogMapper;
import com.startalk.startalk.mapper.UserMapper;
import com.startalk.startalk.parent.entity.ParentChildRelation;
import com.startalk.startalk.parent.entity.ParentControlSettings;
import com.startalk.startalk.parent.mapper.ParentChildRelationMapper;
import com.startalk.startalk.parent.mapper.ParentControlSettingsMapper;
import com.startalk.startalk.parent.service.ParentService;
import com.startalk.startalk.parent.vo.*;
import com.startalk.startalk.word.mapper.UserWordRecordMapper;
import com.startalk.startalk.conversation.entity.ConversationSession;
import com.startalk.startalk.conversation.mapper.SessionMapper;
import com.startalk.startalk.conversation.mapper.ConversationFeedbackMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ParentServiceImpl implements ParentService {

    @Autowired
    private ParentChildRelationMapper relationMapper;

    @Autowired
    private ParentControlSettingsMapper controlSettingsMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private CheckinLogMapper checkinLogMapper;

    @Autowired
    private PointsLogMapper pointsLogMapper;

    @Autowired
    private UserWordRecordMapper userWordRecordMapper;

    @Autowired
    private SessionMapper sessionMapper;

    @Autowired
    private ConversationFeedbackMapper feedbackMapper;

    @Autowired
    private CenterService centerService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public List<ChildInfoVO> getChildList(Long parentId) {
        List<ParentChildRelation> relations = relationMapper.selectByParentId(parentId);
        List<ChildInfoVO> childList = new ArrayList<>();
        for (ParentChildRelation relation : relations) {
            ChildInfoVO childInfo = getChildInfo(parentId, relation.getChildId());
            if (childInfo != null) {
                childList.add(childInfo);
            }
        }
        return childList;
    }

    @Override
    public ChildInfoVO getChildInfo(Long parentId, Long childId) {
        ParentChildRelation relation = relationMapper.selectByParentIdAndChildId(parentId, childId);
        if (relation == null) {
            return null;
        }

        User child = userMapper.selectById(childId);
        if (child == null) {
            return null;
        }

        ChildInfoVO vo = new ChildInfoVO();
        vo.setChildId(child.getId());
        vo.setNickname(child.getNickname());
        vo.setAvatar(child.getAvatar());
        vo.setAge(child.getAge());
        vo.setGrade(child.getGrade());

        Integer masteredWords = userWordRecordMapper.countMasteredWords(childId);
        vo.setTotalWordsLearned(masteredWords != null ? masteredWords : 0);

        Long conversationCount = sessionMapper.selectCount(
                new LambdaQueryWrapper<ConversationSession>()
                        .eq(ConversationSession::getUserId, childId)
                        .eq(ConversationSession::getStatus, 2));
        vo.setTotalConversations(conversationCount != null ? conversationCount.intValue() : 0);

        List<CheckinLog> checkinLogs = checkinLogMapper.selectByUserIdAndMonth(childId,
                LocalDate.now().getYear(), LocalDate.now().getMonthValue());
        int totalMinutes = checkinLogs.stream().mapToInt(CheckinLog::getDuration).sum();
        vo.setTotalStudyMinutes(totalMinutes);

        vo.setTotalPoints(0);

        List<DailyStatsVO> weeklyStats = getWeeklyStats(childId);
        vo.setWeeklyStats(weeklyStats);

        return vo;
    }

    @Override
    public LearningReportVO getLearningReport(Long parentId, Long childId) {
        ParentChildRelation relation = relationMapper.selectByParentIdAndChildId(parentId, childId);
        if (relation == null) {
            return null;
        }

        User child = userMapper.selectById(childId);
        if (child == null) {
            return null;
        }

        LearningReportVO vo = new LearningReportVO();
        vo.setChildId(childId);
        vo.setChildName(child.getNickname());

        List<CheckinLog> checkinLogs = checkinLogMapper.selectByUserIdAndMonth(childId,
                LocalDate.now().getYear(), LocalDate.now().getMonthValue());
        int totalMinutes = checkinLogs.stream().mapToInt(CheckinLog::getDuration).sum();
        vo.setTotalStudyMinutes(totalMinutes);

        Long conversationCount = sessionMapper.selectCount(
                new LambdaQueryWrapper<ConversationSession>()
                        .eq(ConversationSession::getUserId, childId)
                        .eq(ConversationSession::getStatus, 2));
        vo.setTotalConversations(conversationCount != null ? conversationCount.intValue() : 0);

        Integer masteredWords = userWordRecordMapper.countMasteredWords(childId);
        vo.setTotalWordsLearned(masteredWords != null ? masteredWords : 0);

        vo.setStudyTrend(getStudyTrend(parentId, childId, 7));
        vo.setScoreTrend(getScoreTrend(parentId, childId));

        return vo;
    }

    @Override
    public StudyTrendVO getStudyTrend(Long parentId, Long childId, Integer days) {
        if (days == null) days = 7;

        List<DailyStatsVO> dailyData = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            List<CheckinLog> logs = checkinLogMapper.selectByUserIdAndMonth(childId, date.getYear(), date.getMonthValue());
            int minutes = logs.stream()
                    .filter(log -> log.getCheckinDate().equals(date))
                    .mapToInt(CheckinLog::getDuration)
                    .sum();

            DailyStatsVO stat = new DailyStatsVO();
            stat.setDate(date);
            stat.setStudyMinutes(minutes);
            dailyData.add(stat);
        }

        StudyTrendVO vo = new StudyTrendVO();
        vo.setDailyData(dailyData);
        vo.setWeeklyTotal(dailyData.stream().mapToInt(DailyStatsVO::getStudyMinutes).sum());
        vo.setDailyAverage(vo.getWeeklyTotal() / days);
        return vo;
    }

    @Override
    public ScoreTrendVO getScoreTrend(Long parentId, Long childId) {
        List<DailyStatsVO> dailyData = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            DailyStatsVO stat = new DailyStatsVO();
            stat.setDate(date);
            stat.setScore(75 + (int) (Math.random() * 20));
            dailyData.add(stat);
        }

        ScoreTrendVO vo = new ScoreTrendVO();
        vo.setDailyData(dailyData);
        List<Integer> scores = dailyData.stream().map(DailyStatsVO::getScore).collect(Collectors.toList());
        vo.setAverageScore((int) scores.stream().mapToInt(Integer::intValue).average().orElse(0));
        vo.setHighestScore(scores.stream().mapToInt(Integer::intValue).max().orElse(0));
        vo.setLowestScore(scores.stream().mapToInt(Integer::intValue).min().orElse(0));
        return vo;
    }

    @Override
    public ParentControlVO getParentControlSettings(Long parentId, Long childId) {
        ParentControlSettings settings = controlSettingsMapper.selectByChildId(childId);
        if (settings == null) {
            ParentControlVO vo = new ParentControlVO();
            vo.setChildId(childId);
            vo.setDailyLimitMinutes(60);
            vo.setIsLocked(false);
            return vo;
        }

        ParentControlVO vo = new ParentControlVO();
        vo.setChildId(childId);
        vo.setDailyLimitMinutes(settings.getDailyLimitMinutes());
        vo.setAllowedTimeStart(settings.getAllowedTimeStart());
        vo.setAllowedTimeEnd(settings.getAllowedTimeEnd());
        vo.setIsLocked(settings.getIsLocked());
        return vo;
    }

    @Override
    @Transactional
    public ParentControlVO updateParentControlSettings(Long parentId, Long childId, ParentControlVO settingsVO) {
        ParentControlSettings settings = controlSettingsMapper.selectByChildId(childId);
        if (settings == null) {
            settings = new ParentControlSettings();
            settings.setParentId(parentId);
            settings.setChildId(childId);
        }

        if (settingsVO.getDailyLimitMinutes() != null) {
            settings.setDailyLimitMinutes(settingsVO.getDailyLimitMinutes());
        }
        if (StringUtils.hasText(settingsVO.getAllowedTimeStart())) {
            settings.setAllowedTimeStart(settingsVO.getAllowedTimeStart());
        }
        if (StringUtils.hasText(settingsVO.getAllowedTimeEnd())) {
            settings.setAllowedTimeEnd(settingsVO.getAllowedTimeEnd());
        }
        if (settingsVO.getIsLocked() != null) {
            settings.setIsLocked(settingsVO.getIsLocked());
        }

        if (settings.getId() == null) {
            controlSettingsMapper.insert(settings);
        } else {
            controlSettingsMapper.updateById(settings);
        }

        ParentControlVO result = new ParentControlVO();
        result.setChildId(childId);
        result.setDailyLimitMinutes(settings.getDailyLimitMinutes());
        result.setAllowedTimeStart(settings.getAllowedTimeStart());
        result.setAllowedTimeEnd(settings.getAllowedTimeEnd());
        result.setIsLocked(settings.getIsLocked());
        return result;
    }

    @Override
    @Transactional
    public void lockChildAccount(Long parentId, Long childId, String password) {
        ParentControlSettings settings = controlSettingsMapper.selectByChildId(childId);
        if (settings == null) {
            settings = new ParentControlSettings();
            settings.setParentId(parentId);
            settings.setChildId(childId);
            settings.setDailyLimitMinutes(60);
        }

        settings.setIsLocked(true);
        settings.setUnlockPassword(passwordEncoder.encode(password));
        if (settings.getId() == null) {
            controlSettingsMapper.insert(settings);
        } else {
            controlSettingsMapper.updateById(settings);
        }
    }

    @Override
    @Transactional
    public void unlockChildAccount(Long parentId, Long childId, String password) {
        ParentControlSettings settings = controlSettingsMapper.selectByChildId(childId);
        if (settings == null || !settings.getIsLocked()) {
            return;
        }

        if (passwordEncoder.matches(password, settings.getUnlockPassword())) {
            settings.setIsLocked(false);
            controlSettingsMapper.updateById(settings);
        } else {
            throw new RuntimeException("密码错误");
        }
    }

    @Override
    @Transactional
    public void bindChild(Long parentId, Long childId, String relationName) {
        ParentChildRelation existing = relationMapper.selectByParentIdAndChildId(parentId, childId);
        if (existing != null) {
            throw new RuntimeException("该账号已绑定");
        }

        User child = userMapper.selectById(childId);
        if (child == null) {
            throw new RuntimeException("用户不存在");
        }

        ParentChildRelation relation = new ParentChildRelation();
        relation.setParentId(parentId);
        relation.setChildId(childId);
        relation.setRelationName(relationName);
        relation.setStatus(1);
        relationMapper.insert(relation);
    }

    @Override
    @Transactional
    public void unbindChild(Long parentId, Long childId) {
        LambdaQueryWrapper<ParentChildRelation> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ParentChildRelation::getParentId, parentId)
                .eq(ParentChildRelation::getChildId, childId);
        relationMapper.delete(wrapper);
    }

    private List<DailyStatsVO> getWeeklyStats(Long childId) {
        List<DailyStatsVO> stats = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            List<CheckinLog> logs = checkinLogMapper.selectByUserIdAndMonth(childId, date.getYear(), date.getMonthValue());
            int minutes = logs.stream()
                    .filter(log -> log.getCheckinDate().equals(date))
                    .mapToInt(CheckinLog::getDuration)
                    .sum();

            DailyStatsVO stat = new DailyStatsVO();
            stat.setDate(date);
            stat.setStudyMinutes(minutes);
            stat.setConversationCount(0);
            stat.setWordsLearned(0);
            stat.setScore(80 + (int) (Math.random() * 15));
            stats.add(stat);
        }
        return stats;
    }
}