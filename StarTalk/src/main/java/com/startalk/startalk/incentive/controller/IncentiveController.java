package com.startalk.startalk.incentive.controller;

import com.startalk.startalk.incentive.service.IncentiveService;
import com.startalk.startalk.incentive.vo.*;
import com.startalk.startalk.vo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/incentive")
public class IncentiveController {

    @Autowired
    private IncentiveService incentiveService;

    @GetMapping("/points")
    public Result<PointsVO> getUserPoints(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(incentiveService.getUserPoints(userId));
    }

    @PostMapping("/points/add")
    public Result<Void> addPoints(@RequestParam String source,
                                  @RequestParam(required = false) String description,
                                  HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        incentiveService.addPoints(userId, source, description);
        return Result.success();
    }

    @PostMapping("/checkin")
    public Result<CheckinVO> checkin(@RequestParam(required = false) Integer duration,
                                     HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(incentiveService.checkin(userId, duration));
    }

    @GetMapping("/checkin/info")
    public Result<CheckinVO> getCheckinInfo(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(incentiveService.getCheckinInfo(userId, year, month));
    }

    @GetMapping("/badges")
    public Result<List<BadgeVO>> getBadgeList(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(incentiveService.getBadgeList(userId));
    }

    @GetMapping("/rewards")
    public Result<List<RewardVO>> getRewardList(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(incentiveService.getRewardList(userId));
    }

    @PostMapping("/rewards/exchange/{rewardId}")
    public Result<Void> exchangeReward(@PathVariable Long rewardId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        incentiveService.exchangeReward(userId, rewardId);
        return Result.success();
    }

    @GetMapping("/rank/weekly")
    public Result<List<RankVO>> getWeeklyRankList() {
        return Result.success(incentiveService.getWeeklyRankList());
    }

    @PostMapping("/duration/record")
    public Result<Void> recordDuration(@RequestParam Integer duration, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        incentiveService.recordStudyDuration(userId, duration);
        return Result.success();
    }
}