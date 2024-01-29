package com.rtc.sfu.controller;

import com.rtc.sfu.data.dto.MeetingDto;
import com.rtc.sfu.service.MeetingService;
import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.openvidu.java.client.OpenVidu;


@RestController
@RequestMapping(value = "/openvidu")
public class OpenViduController {

    public static final Logger logger = LoggerFactory.getLogger(OpenViduController.class);
    private final MeetingService meetingService;

    @Autowired
    public OpenViduController(MeetingService meetingService) {
        this.meetingService = meetingService;
    }

    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    /**
     * @param params The Session properties
     * @return The Session ID
     */

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     *
     * @param params : customSessionId(방의 식별자가 될 데이터), ConsultantId(방을 만드는 사람의 실별자)
     * @return
     * @throws OpenViduJavaClientException
     * @throws OpenViduHttpException
     *
     */
    @PostMapping("/api/sessions")
    public ResponseEntity<?> createSession(@RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {

        Map<String, Object> check = new HashMap<>();

        logger.info("*** createSession 메소드 호출");

        SessionProperties properties = SessionProperties.fromJson(params).build();
        logger.info("properties : {} ", properties);
        logger.info("params : {} ", params);
        Session session = openvidu.createSession(properties);

        MeetingDto meetingDto = new MeetingDto();
        meetingDto.setSessionId(session.getSessionId());

        try {
            meetingService.deleteAllSessionConsultantId(params.get("ConsultantId").toString());
            logger.info("*** deleteAllSessionConsultantId 호출");

            meetingService.createSession(meetingDto, params.get("ConsultantId").toString());
            logger.info("*** createSession 호출");

            check.put("msg", "success");
            check.put("sessionId", session.getSessionId());

            logger.info("*** createSession 메소드 종료");
            logger.info("*** 세션 생성 : " + session.getSessionId());
            return ResponseEntity.status(HttpStatus.OK).body(check);
        } catch (Exception e) {
            logger.info(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * @param sessionId The Session in which to create the Connection
     * @param params    The Connection properties
     * @return The Token associated to the Connection
     */
    @PostMapping("/api/sessions/{sessionId}/connections")
    public ResponseEntity<?> createConnection(@PathVariable("sessionId") String sessionId,
                                              @RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {

        Map<String, Object> check = new HashMap<>();

        logger.info("*** createConnection 메소드 호출");
        logger.info("sessionId : {}", sessionId);
        logger.info("params : {}", params.toString());


        // 활성화된 세션(방)을 가져온다.
        Session session = openvidu.getActiveSession(sessionId);

        logger.info("session : {}", session);
        logger.info("sessions : {}", openvidu.getActiveSessions());

        // 활성화된 방이 없으면 우리가 찾으려던 방이름으로 방을 하나 더 만든거임.
        if (session == null) {
            // 세션이 없다
            session = openvidu.createSession(new SessionProperties.Builder().customSessionId(sessionId).build());
            check.put("msg", "다시만들어봄.");
            logger.info("session을 다시 만듬.");
        }
        // 새로 생성한 세션에 대한 참조를 다시 가져옵니다.
        session = openvidu.getActiveSession(sessionId);
            logger.info("session 값확인");
            logger.info("session : {}", session);
            logger.info("params : {}", params);

        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
        Connection connection = session.createConnection(properties);

        try {
            MeetingDto meetingDto = meetingService.readMeeting(session.getSessionId());
            logger.info("*** getMeeting 호출");
            logger.info("meetingDto : {}", meetingDto.toString());

            if (meetingDto.getCnt() >= 4) {
                // 세션 방에 인원이 2명 이상이면 입장 안됨.

                check.put("msg", "The session room is full.");
                logger.info("*** createConnection 오류 - 방 인원이 가득 참");
                return ResponseEntity.status(HttpStatus.OK).body(check);
            } else {
                meetingDto.setCnt(meetingDto.getCnt() + 1);
                meetingService.updateMeeting(meetingDto);

                check.put("msg", "success");
                check.put("sessionId", session.getSessionId());
                check.put("token", connection.getToken());

                logger.info("*** createConnection 종료");
                logger.info("*** sessionId : {}", session.getSessionId());
                logger.info("*** token : {}", connection.getToken());
                return ResponseEntity.status(HttpStatus.OK).body(check);
            }
        } catch (Exception e) {
            logger.info(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }


    @PostMapping("/api/sessions/{sessionId}/disconnections")
    public ResponseEntity<?> deleteConnection(@PathVariable("sessionId") String sessionId) {

        Map<String, Object> check = new HashMap<>();

        logger.info("*** deleteConnection 메소드 호출");

        Session session = openvidu.getActiveSession(sessionId); // 방을가져오는거임.

        if (session == null) { // 나갈 방이없어요.
            // 세션이 없다
            check.put("msg", "fail");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(check);
        } else {

            try {
                MeetingDto meetingDto = meetingService.readMeeting(session.getSessionId());
                meetingDto.setCnt(meetingDto.getCnt() - 1);
                    // 방에 사람이 없으면 방 없애버리기.
//                if(meetingDto.getCnt() <= 0) {
//                    meetingService.deleteMeeting(meetingDto.getSessionId());
//                } else {
//                }
                meetingService.updateMeeting(meetingDto);

                check.put("msg", "success");

//                logger.info("*** deleteConnection 메소드 종료");
                return ResponseEntity.status(HttpStatus.OK).body(check);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }

        }
    }

    /**
     *
     * @return : 활성화되어있는 전체 방(session)을 가져온다.
     */
    @GetMapping("/api/sessions")
    public ResponseEntity<?> readAllSession() {

        Map<String, Object> check = new HashMap<>();

        logger.info("*** readAllSession - 호출");

        try {
            List<MeetingDto> list = meetingService.readAllMeeting();

            if (list != null) {

                logger.info("*** readAllSession list : {} ", list);

                check.put("msg", "success");
                check.put("data", list);

                return ResponseEntity.status(HttpStatus.OK).body(check);
            } else {
                check.put("msg", "fail");
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }

    /**
     *
     * @param sessionId : 방 식별자.
     * @return
     * 방을 삭제해준다.
     */
    @DeleteMapping("/api/sessions/{sessionId}")
    public ResponseEntity<?> deleteSession(@PathVariable("sessionId") String sessionId) {

        Map<String, Object> check = new HashMap<>();

        logger.info("*** deleteSession - 호출");

        try {
//            meetingService.deleteMeeting(sessionId);

            check.put("msg", "success");

            return ResponseEntity.status(HttpStatus.OK).body(check);
        } catch (Exception e) {
            check.put("msg", "fail");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(check);
        }

    }

}
