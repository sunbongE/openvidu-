# OpenVidu 실행 명령어 in Docker
- openvidu 서버를 사용해야 rtc를 사용할 수 있어요 우선은 이런방법으로 연습해봤습니다.

`docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=webrtcOpenvidu openvidu/openvidu-server-kms:2.29.0`

헤더 정보.

username : 항상 `OPENVIDUAPP`

password : [application.properties](http://application.properties) 안에 설정한거.

![algocat](Readme.assets/algocat.png)