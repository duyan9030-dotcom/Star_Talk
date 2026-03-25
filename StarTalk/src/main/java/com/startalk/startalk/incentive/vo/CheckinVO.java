package com.startalk.startalk.incentive.vo;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class CheckinVO {
    private Boolean checkedInToday;
    private Integer consecutiveDays;
    private List<LocalDate> checkinDates;
}