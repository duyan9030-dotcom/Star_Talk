package com.startalk.startalk.admin.controller;

import com.startalk.startalk.admin.service.AdminStatisticsService;
import com.startalk.startalk.admin.vo.StatisticsVO;
import com.startalk.startalk.vo.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/statistics")
public class AdminStatisticsController {

    private final AdminStatisticsService adminStatisticsService;

    public AdminStatisticsController(AdminStatisticsService adminStatisticsService) {
        this.adminStatisticsService = adminStatisticsService;
    }

    @GetMapping("/overview")
    public Result<StatisticsVO> getOverview() {
        return Result.success(adminStatisticsService.getStatistics());
    }
}
