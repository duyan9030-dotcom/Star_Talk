package com.startalk.startalk.parent.controller;

import com.startalk.startalk.parent.service.ParentService;
import com.startalk.startalk.parent.vo.*;
import com.startalk.startalk.vo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/parent")
public class ParentController {

    @Autowired
    private ParentService parentService;

    @GetMapping("/children")
    public Result<List<ChildInfoVO>> getChildList(HttpServletRequest request) {
        Long parentId = (Long) request.getAttribute("userId");
        return Result.success(parentService.getChildList(parentId));
    }

    @GetMapping("/child/{childId}")
    public Result<ChildInfoVO> getChildInfo(@PathVariable Long childId, HttpServletRequest request) {
        Long parentId = (Long) request.getAttribute("userId");
        return Result.success(parentService.getChildInfo(parentId, childId));
    }

    @GetMapping("/report/{childId}")
    public Result<LearningReportVO> getLearningReport(@PathVariable Long childId, HttpServletRequest request) {
        Long parentId = (Long) request.getAttribute("userId");
        return Result.success(parentService.getLearningReport(parentId, childId));
    }

    @GetMapping("/trend/study/{childId}")
    public Result<StudyTrendVO> getStudyTrend(
            @PathVariable Long childId,
            @RequestParam(required = false) Integer days,
            HttpServletRequest request) {
        Long parentId = (Long) request.getAttribute("userId");
        return Result.success(parentService.getStudyTrend(parentId, childId, days));
    }

    @GetMapping("/trend/score/{childId}")
    public Result<ScoreTrendVO> getScoreTrend(@PathVariable Long childId, HttpServletRequest request) {
        Long parentId = (Long) request.getAttribute("userId");
        return Result.success(parentService.getScoreTrend(parentId, childId));
    }

    @GetMapping("/control/{childId}")
    public Result<ParentControlVO> getControlSettings(@PathVariable Long childId, HttpServletRequest request) {
        Long parentId = (Long) request.getAttribute("userId");
        return Result.success(parentService.getParentControlSettings(parentId, childId));
    }

    @PutMapping("/control/{childId}")
    public Result<ParentControlVO> updateControlSettings(
            @PathVariable Long childId,
            @RequestBody ParentControlVO settings,
            HttpServletRequest request) {
        Long parentId = (Long) request.getAttribute("userId");
        return Result.success(parentService.updateParentControlSettings(parentId, childId, settings));
    }

    @PostMapping("/lock/{childId}")
    public Result<Void> lockAccount(@PathVariable Long childId,
                                   @RequestParam String password,
                                   HttpServletRequest request) {
        Long parentId = (Long) request.getAttribute("userId");
        parentService.lockChildAccount(parentId, childId, password);
        return Result.success();
    }

    @PostMapping("/unlock/{childId}")
    public Result<Void> unlockAccount(@PathVariable Long childId,
                                      @RequestParam String password,
                                      HttpServletRequest request) {
        Long parentId = (Long) request.getAttribute("userId");
        parentService.unlockChildAccount(parentId, childId, password);
        return Result.success();
    }

    @PostMapping("/bind/{childId}")
    public Result<Void> bindChild(@PathVariable Long childId,
                                  @RequestParam(required = false) String relationName,
                                  HttpServletRequest request) {
        Long parentId = (Long) request.getAttribute("userId");
        parentService.bindChild(parentId, childId, relationName);
        return Result.success();
    }

    @DeleteMapping("/unbind/{childId}")
    public Result<Void> unbindChild(@PathVariable Long childId, HttpServletRequest request) {
        Long parentId = (Long) request.getAttribute("userId");
        parentService.unbindChild(parentId, childId);
        return Result.success();
    }
}