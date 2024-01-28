package com.rtc.sfu.data.dao.impl;

import com.rtc.sfu.data.dao.MeetingDAO;
import com.rtc.sfu.entity.Meeting;
import com.rtc.sfu.repository.ConsultantRepository;
import com.rtc.sfu.repository.MeetingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Component
public class MeetingDAOImpl implements MeetingDAO {

    private final MeetingRepository meetingRepository;

    private final ConsultantRepository consultantRepository;

    @Autowired
    public MeetingDAOImpl(MeetingRepository meetingRepository, ConsultantRepository consultantRepository) {
        this.meetingRepository = meetingRepository;
        this.consultantRepository = consultantRepository;
    }

    @Override
    public Meeting createMeeting(Meeting meeting, String ConsultantId) throws Exception {
        meeting.setConsultantId(consultantRepository.findById(ConsultantId).get());
        Meeting createMeeting = meetingRepository.save(meeting);
        return createMeeting;
    }

    @Override
    public List<Meeting> readAllMeeting() throws Exception {
        List<Meeting> readAllMeeting = meetingRepository.findAll();
        return readAllMeeting;
    }

    @Override
    public Meeting readMeeting(String sessionId) throws Exception {
        Meeting readMeeting = meetingRepository.findById(sessionId).get();
        return readMeeting;
    }

    @Transactional
    @Override
    public Meeting updateMeeting(Meeting meeting) throws Exception {
        return meetingRepository.save(meeting);
    }

    @Override
    public void deleteMeeting(String sessionId) throws Exception {
        Optional<Meeting> readMeeting = meetingRepository.findById(sessionId);

        if(readMeeting.isPresent()) {
            Meeting deleteMeeting = readMeeting.get();

            meetingRepository.delete(deleteMeeting);
        } else {
            throw new Exception();
        }

    }

    @Override
    public void deleteAllMeetingConsultantId(String consultantId) throws Exception {
        List<Meeting> list = meetingRepository.findByConsultantId(consultantRepository.getById(consultantId));

        for(Meeting m : list) {
            meetingRepository.delete(m);
        }
    }
}