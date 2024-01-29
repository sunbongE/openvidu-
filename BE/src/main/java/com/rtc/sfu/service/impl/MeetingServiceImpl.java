package com.rtc.sfu.service.impl;

import com.rtc.sfu.data.dao.MeetingDAO;
import com.rtc.sfu.data.dto.MeetingDto;
import com.rtc.sfu.entity.Meeting;
import com.rtc.sfu.service.MeetingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MeetingServiceImpl implements MeetingService {

    private final MeetingDAO meetingDao;

    @Override
    public MeetingDto createSession(MeetingDto meetingDto, String ConsultantId) throws Exception {
        Meeting meeting = toMeeting(meetingDto);
        Meeting saveMeeting = meetingDao.createMeeting(meeting, ConsultantId);
        return toMeetingDto(saveMeeting);
    }

    @Override
    public List<MeetingDto> readAllMeeting() throws Exception {

        ArrayList<MeetingDto> list = new ArrayList<MeetingDto>();
        List<Meeting> selectAllMeeting = meetingDao.readAllMeeting();

        if (selectAllMeeting != null) {

            for (Meeting m : selectAllMeeting) {
                list.add(new MeetingDto(
                        m.getSessionId(),
                        m.getConsultantId(),
                        m.getCnt(),
                        m.getMeetingRegisterTime()));
            }
        }

        return list;
    }

    @Override
    public MeetingDto readMeeting(String sessionId) throws Exception {
        Meeting selectMeeting = meetingDao.readMeeting(sessionId);
        return toMeetingDto(selectMeeting);
    }

    @Override
    public MeetingDto updateMeeting(MeetingDto meetingDto) throws Exception {
        Meeting meeting = toMeeting(meetingDto);
        Meeting saveMeeting = meetingDao.updateMeeting(meeting);
        return toMeetingDto(saveMeeting);
    }

    @Override
    public void deleteMeeting(String sessionId) throws Exception {
        meetingDao.deleteMeeting(sessionId);
    }

    @Override
    public void deleteAllSessionConsultantId(String consultantId) throws Exception {
        meetingDao.deleteAllMeetingConsultantId(consultantId);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    private Meeting toMeeting(MeetingDto meetingDto) {
        Meeting meeting = new Meeting();
        meeting.setSessionId(meetingDto.getSessionId());
        meeting.setConsultantId(meetingDto.getConsultantId());
        meeting.setCnt(meetingDto.getCnt());
        meeting.setMeetingRegisterTime(meetingDto.getMeetingRegisterTime());
        return meeting;
    }

    private MeetingDto toMeetingDto(Meeting meeting) {
        MeetingDto meetingDto = new MeetingDto();
        meetingDto.setSessionId(meeting.getSessionId());
        meetingDto.setConsultantId(meeting.getConsultantId());
        meetingDto.setCnt(meeting.getCnt());
        meetingDto.setMeetingRegisterTime(meeting.getMeetingRegisterTime());
        return meetingDto;
    }
}
