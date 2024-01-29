package com.rtc.sfu.data.dao;

import com.rtc.sfu.entity.Meeting;
import org.springframework.stereotype.Component;

import java.util.List;
@Component
public interface MeetingDAO {
    Meeting createMeeting(Meeting meeting, String ConsultantId) throws Exception;
    List<Meeting> readAllMeeting() throws Exception;
    Meeting readMeeting(String sessionId) throws Exception;
    Meeting updateMeeting(Meeting meeting) throws Exception;
    void deleteMeeting(String sessionId) throws Exception;
    void deleteAllMeetingConsultantId(String consultantId) throws Exception;
}
