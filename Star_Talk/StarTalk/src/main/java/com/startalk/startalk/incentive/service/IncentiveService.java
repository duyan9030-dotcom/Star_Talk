package com.startalk.startalk.incentive.service;

import com.startalk.startalk.incentive.vo.*;

import java.util.List;

public interface IncentiveService {

    PointsVO getUserPoints(Long userId);

    void addPoints(Long userId, String source, String description);

    void deductPoints(Long userId, Integer points, String description);

    CheckinVO checkin(Long userId, Integer duration);

    CheckinVO getCheckinInfo(Long userId, Integer year, Integer month);

    List<BadgeVO> getBadgeList(Long userId);

    List<RewardVO> getRewardList(Long userId);

    void exchangeReward(Long userId, Long rewardId);

    List<RankVO> getWeeklyRankList();

    void recordStudyDuration(Long userId, Integer duration);
}