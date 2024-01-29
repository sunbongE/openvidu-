package com.rtc.sfu.repository;

import com.rtc.sfu.entity.Consultant;
import com.rtc.sfu.entity.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting,String> {
    String findBySessionId(String sessionId);
    String findByUserName(String username);
    String findByTitle(String title);
    List<Meeting> findByConsultantId(Consultant consultantId);
}
