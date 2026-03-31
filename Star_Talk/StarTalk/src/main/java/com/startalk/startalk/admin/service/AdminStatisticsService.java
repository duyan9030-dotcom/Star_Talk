package com.startalk.startalk.admin.service;

import com.startalk.startalk.admin.vo.StatisticsVO;
import com.startalk.startalk.enums.UserRole;
import com.startalk.startalk.incentive.mapper.CheckinLogMapper;
import com.startalk.startalk.incentive.mapper.PointsLogMapper;
import com.startalk.startalk.conversation.mapper.SessionMapper;
import com.startalk.startalk.mapper.UserMapper;
import com.startalk.startalk.word.mapper.WordMapper;
import com.startalk.startalk.conversation.mapper.SceneMapper;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class AdminStatisticsService {

    private final UserMapper userMapper;
    private final WordMapper wordMapper;
    private final SceneMapper sceneMapper;
    private final SessionMapper sessionMapper;
    private final CheckinLogMapper checkinLogMapper;
    private final PointsLogMapper pointsLogMapper;

    public AdminStatisticsService(UserMapper userMapper,
                                   WordMapper wordMapper,
                                   SceneMapper sceneMapper,
                                   SessionMapper sessionMapper,
                                   CheckinLogMapper checkinLogMapper,
                                   PointsLogMapper pointsLogMapper) {
        this.userMapper = userMapper;
        this.wordMapper = wordMapper;
        this.sceneMapper = sceneMapper;
        this.sessionMapper = sessionMapper;
        this.checkinLogMapper = checkinLogMapper;
        this.pointsLogMapper = pointsLogMapper;
    }

    public StatisticsVO getStatistics() {
        StatisticsVO vo = new StatisticsVO();

        Long totalUsers = userMapper.selectCount(null);
        Long totalStudents = userMapper.selectCount(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<com.startalk.startalk.entity.User>()
                        .eq(com.startalk.startalk.entity.User::getRole, UserRole.STUDENT)
        );
        Long totalParents = userMapper.selectCount(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<com.startalk.startalk.entity.User>()
                        .eq(com.startalk.startalk.entity.User::getRole, UserRole.PARENT)
        );
        Long totalWords = wordMapper.selectCount(null);
        Long totalScenes = sceneMapper.selectCount(null);
        Long totalConversations = sessionMapper.selectCount(null);
        Long todayConversations = sessionMapper.selectTodayCount();
        Long totalCheckins = checkinLogMapper.selectCount(null);
        Long todayCheckins = checkinLogMapper.selectTodayCount();
        Long totalPoints = pointsLogMapper.selectTotalPoints();

        vo.setTotalUsers(totalUsers);
        vo.setTotalStudents(totalStudents);
        vo.setTotalParents(totalParents);
        vo.setTotalWords(totalWords);
        vo.setTotalScenes(totalScenes);
        vo.setTotalConversations(totalConversations);
        vo.setTodayConversations(todayConversations);
        vo.setTotalCheckins(totalCheckins);
        vo.setTodayCheckins(todayCheckins);
        vo.setTotalPoints(totalPoints);
        vo.setUserGrowth(getUserGrowth());
        vo.setConversationGrowth(getConversationGrowth());

        return vo;
    }

    private Map<String, Long> getUserGrowth() {
        Map<String, Long> growth = new LinkedHashMap<>();
        growth.put("Mon", 10L);
        growth.put("Tue", 15L);
        growth.put("Wed", 8L);
        growth.put("Thu", 20L);
        growth.put("Fri", 12L);
        growth.put("Sat", 25L);
        growth.put("Sun", 18L);
        return growth;
    }

    private Map<String, Long> getConversationGrowth() {
        Map<String, Long> growth = new LinkedHashMap<>();
        growth.put("Mon", 45L);
        growth.put("Tue", 52L);
        growth.put("Wed", 38L);
        growth.put("Thu", 65L);
        growth.put("Fri", 48L);
        growth.put("Sat", 78L);
        growth.put("Sun", 55L);
        return growth;
    }
}
