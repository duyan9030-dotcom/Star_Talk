package com.startalk.startalk.incentive.vo;

import lombok.Data;

@Data
public class RankVO {
    private Long userId;
    private String nickname;
    private String avatar;
    private Integer totalPoints;
    private Integer rank;
}