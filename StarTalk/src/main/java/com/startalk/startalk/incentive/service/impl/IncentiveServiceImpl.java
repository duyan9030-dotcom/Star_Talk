package com.startalk.startalk.incentive.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.startalk.startalk.incentive.entity.*;
import com.startalk.startalk.incentive.mapper.*;
import com.startalk.startalk.incentive.service.IncentiveService;
import com.startalk.startalk.incentive.vo.*;
import com.startalk.startalk.mapper.UserMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class IncentiveServiceImpl implements IncentiveService {

    @Autowired
    private UserPointsMapper userPointsMapper;

    @Autowired
    private PointsLogMapper pointsLogMapper;

    @Autowired
    private CheckinLogMapper checkinLogMapper;

    @Autowired
    private BadgeMapper badgeMapper;

    @Autowired
    private UserBadgeMapper userBadgeMapper;

    @Autowired
    private RewardMapper rewardMapper;

    @Autowired
    private UserRewardRecordMapper userRewardRecordMapper;

    @Autowired
    private UserMapper userMapper;

    private static final Map<String, Integer> POINTS_RULES = new HashMap<>();

    static {
        POINTS_RULES.put("CONVERSATION", 10);
        POINTS_RULES.put("READING", 5);
        POINTS_RULES.put("WORD_TEST", 3);
        POINTS_RULES.put("CHECKIN", 5);
    }

    @Override
    public PointsVO getUserPoints(Long userId) {
        UserPoints userPoints = userPointsMapper.selectByUserId(userId);
        if (userPoints == null) {
            userPoints = createUserPoints(userId);
        }

        List<PointsLog> logs = pointsLogMapper.selectByUserId(userId);
        List<PointsLogVO> logVOs = logs.stream().limit(10).map(this::convertToLogVO).collect(Collectors.toList());

        PointsVO vo = new PointsVO();
        vo.setId(userPoints.getId());
        vo.setUserId(userPoints.getUserId());
        vo.setTotalPoints(userPoints.getTotalPoints());
        vo.setAvailablePoints(userPoints.getAvailablePoints());
        vo.setRecentLogs(logVOs);
        return vo;
    }

    @Override
    @Transactional
    public void addPoints(Long userId, String source, String description) {
        Integer points = POINTS_RULES.getOrDefault(source, 0);
        if (points <= 0) {
            return;
        }

        UserPoints userPoints = userPointsMapper.selectByUserId(userId);
        if (userPoints == null) {
            userPoints = createUserPoints(userId);
        }

        userPoints.setTotalPoints(userPoints.getTotalPoints() + points);
        userPoints.setAvailablePoints(userPoints.getAvailablePoints() + points);
        userPointsMapper.updateById(userPoints);

        PointsLog log = new PointsLog();
        log.setUserId(userId);
        log.setPoints(points);
        log.setType("EARN");
        log.setSource(source);
        log.setDescription(description != null ? description : "完成任务获得积分");
        pointsLogMapper.insert(log);
    }

    @Override
    @Transactional
    public void deductPoints(Long userId, Integer points, String description) {
        UserPoints userPoints = userPointsMapper.selectByUserId(userId);
        if (userPoints == null || userPoints.getAvailablePoints() < points) {
            throw new RuntimeException("积分不足");
        }

        userPoints.setAvailablePoints(userPoints.getAvailablePoints() - points);
        userPointsMapper.updateById(userPoints);

        PointsLog log = new PointsLog();
        log.setUserId(userId);
        log.setPoints(points);
        log.setType("SPEND");
        log.setSource("EXCHANGE");
        log.setDescription(description);
        pointsLogMapper.insert(log);
    }

    @Override
    @Transactional
    public CheckinVO checkin(Long userId, Integer duration) {
        LocalDate today = LocalDate.now();
        CheckinLog existingLog = checkinLogMapper.selectByUserIdAndDate(userId, today);
        if (existingLog != null) {
            throw new RuntimeException("今日已打卡");
        }

        CheckinLog log = new CheckinLog();
        log.setUserId(userId);
        log.setCheckinDate(today);
        log.setDuration(duration != null ? duration : 0);
        checkinLogMapper.insert(log);

        addPoints(userId, "CHECKIN", "每日打卡");

        return getCheckinInfo(userId, today.getYear(), today.getMonthValue());
    }

    @Override
    public CheckinVO getCheckinInfo(Long userId, Integer year, Integer month) {
        LocalDate today = LocalDate.now();
        if (year == null) year = today.getYear();
        if (month == null) month = today.getMonthValue();

        List<CheckinLog> logs = checkinLogMapper.selectByUserIdAndMonth(userId, year, month);
        List<LocalDate> checkinDates = logs.stream()
                .map(CheckinLog::getCheckinDate)
                .collect(Collectors.toList());

        CheckinVO vo = new CheckinVO();
        vo.setCheckedInToday(checkinDates.contains(today));
        vo.setConsecutiveDays(checkinLogMapper.countConsecutiveDays(userId));
        vo.setCheckinDates(checkinDates);
        return vo;
    }

    @Override
    public List<BadgeVO> getBadgeList(Long userId) {
        List<Badge> allBadges = badgeMapper.selectList(new LambdaQueryWrapper<>());
        List<UserBadge> userBadges = userBadgeMapper.selectByUserId(userId);
        Set<Long> ownedBadgeIds = userBadges.stream()
                .map(UserBadge::getBadgeId)
                .collect(Collectors.toSet());

        return allBadges.stream().map(badge -> {
            BadgeVO vo = new BadgeVO();
            BeanUtils.copyProperties(badge, vo);
            vo.setOwned(ownedBadgeIds.contains(badge.getId()));
            return vo;
        }).collect(Collectors.toList());
    }

    @Override
    public List<RewardVO> getRewardList(Long userId) {
        List<Reward> rewards = rewardMapper.selectList(
                new LambdaQueryWrapper<Reward>().eq(Reward::getStatus, 1));
        List<UserRewardRecord> userRecords = userRewardRecordMapper.selectByUserId(userId);
        Set<Long> exchangedRewardIds = userRecords.stream()
                .map(UserRewardRecord::getRewardId)
                .collect(Collectors.toSet());

        return rewards.stream().map(reward -> {
            RewardVO vo = new RewardVO();
            BeanUtils.copyProperties(reward, vo);
            vo.setExchanged(exchangedRewardIds.contains(reward.getId()));
            return vo;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void exchangeReward(Long userId, Long rewardId) {
        Reward reward = rewardMapper.selectById(rewardId);
        if (reward == null || reward.getStock() <= 0) {
            throw new RuntimeException("奖励已售罄");
        }

        UserPoints userPoints = userPointsMapper.selectByUserId(userId);
        if (userPoints == null || userPoints.getAvailablePoints() < reward.getPoints()) {
            throw new RuntimeException("积分不足");
        }

        deductPoints(userId, reward.getPoints(), "兑换: " + reward.getName());

        reward.setStock(reward.getStock() - 1);
        rewardMapper.updateById(reward);

        UserRewardRecord record = new UserRewardRecord();
        record.setUserId(userId);
        record.setRewardId(rewardId);
        record.setPointsSpent(reward.getPoints());
        record.setStatus(1);
        userRewardRecordMapper.insert(record);
    }

    @Override
    public List<RankVO> getWeeklyRankList() {
        List<UserPoints> allPoints = userPointsMapper.selectList(
                new LambdaQueryWrapper<UserPoints>()
                        .orderByDesc(UserPoints::getTotalPoints)
                        .last("LIMIT 100"));

        List<RankVO> ranks = new ArrayList<>();
        int rank = 1;
        for (UserPoints up : allPoints) {
            RankVO vo = new RankVO();
            vo.setUserId(up.getUserId());
            vo.setTotalPoints(up.getTotalPoints());
            vo.setRank(rank++);

            com.startalk.startalk.entity.User user = userMapper.selectById(up.getUserId());
            if (user != null) {
                vo.setNickname(user.getNickname());
                vo.setAvatar(user.getAvatar());
            }
            ranks.add(vo);
        }
        return ranks;
    }

    @Override
    @Transactional
    public void recordStudyDuration(Long userId, Integer duration) {
        LocalDate today = LocalDate.now();

        CheckinLog log = checkinLogMapper.selectByUserIdAndDate(userId, today);
        if (log == null) {
            log = new CheckinLog();
            log.setUserId(userId);
            log.setCheckinDate(today);
            log.setDuration(duration);
            checkinLogMapper.insert(log);
        } else {
            log.setDuration(log.getDuration() + duration);
            checkinLogMapper.updateById(log);
        }
    }

    private UserPoints createUserPoints(Long userId) {
        UserPoints userPoints = new UserPoints();
        userPoints.setUserId(userId);
        userPoints.setTotalPoints(0);
        userPoints.setAvailablePoints(0);
        userPointsMapper.insert(userPoints);
        return userPoints;
    }

    private PointsLogVO convertToLogVO(PointsLog log) {
        PointsLogVO vo = new PointsLogVO();
        BeanUtils.copyProperties(log, vo);
        return vo;
    }
}