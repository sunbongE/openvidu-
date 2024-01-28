package com.rtc.sfu.data.dto;

import com.rtc.sfu.entity.Consultant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MeetingDto {
    private String sessionId;
//    @ApiModelProperty(value = "컨설턴트아이디")
    private Consultant consultantId;
    private int cnt;
    private LocalDateTime meetingRegisterTime;}
