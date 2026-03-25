package com.startalk.startalk.parent.service;

import com.startalk.startalk.parent.vo.*;

import java.util.List;

public interface ParentService {

    List<ChildInfoVO> getChildList(Long parentId);

    ChildInfoVO getChildInfo(Long parentId, Long childId);

    LearningReportVO getLearningReport(Long parentId, Long childId);

    StudyTrendVO getStudyTrend(Long parentId, Long childId, Integer days);

    ScoreTrendVO getScoreTrend(Long parentId, Long childId);

    ParentControlVO getParentControlSettings(Long parentId, Long childId);

    ParentControlVO updateParentControlSettings(Long parentId, Long childId, ParentControlVO settings);

    void lockChildAccount(Long parentId, Long childId, String password);

    void unlockChildAccount(Long parentId, Long childId, String password);

    void bindChild(Long parentId, Long childId, String relationName);

    void unbindChild(Long parentId, Long childId);
}