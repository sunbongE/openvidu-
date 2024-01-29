import styled from 'styled-components'

const CreateMeeting = () => {
  // openvidu state
  // const [, setOV] = useState<OpenVidu | null>(null)
  // const [mySessionId, setMySessionId] = useState<string>('')
  // const [myUserName, setMyUserName] = useState('박태호')
  // const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  // const [publisher, setPublisher] = useState<Publisher | undefined>(undefined)
  // const [session, setSession] = useState<OVSession | undefined>(undefined)
  //
  // // 돌아가기 버튼 함수
  // const pageBackHandler = () => {
  //   leaveSession()
  // }
  //
  // // 방 세션 나간 사람들 삭제
  // const deleteSubscriber = (streamManager: StreamManager) => {
  //   const prevSubscribers = subscribers
  //   let index = -1
  //   if (streamManager instanceof Subscriber) {
  //     index = prevSubscribers.indexOf(streamManager, 0)
  //   }
  //   if (index > -1) {
  //     prevSubscribers.splice(index, 1)
  //     setSubscribers([...prevSubscribers])
  //   }
  // }
  //
  // // sessionId 받아오기
  // const addSessionIdHandler = (getSessionId: string) => {
  //   setMySessionId(getSessionId)
  // }
  //
  // useEffect(() => {
  //   if (mySessionId !== '') {
  //     joinSession()
  //   }
  // }, [mySessionId])
  //
  // // 방 참가
  // const joinSession = () => {
  //   // 1. openvidu 객체 생성
  //   const newOV = new OpenVidu()
  //   // socket 통신 과정에서 많은 log를 남기게 되는데 필요하지 않은 log를 띄우지 않게 하는 모드
  //   newOV.enableProdMode()
  //   // 2. initSesison 생성
  //   const newSession = newOV.initSession()
  //
  //   // 3. 미팅을 종료하거나 뒤로가기 등의 이벤트를 통해 세션을 disconnect 해주기 위해 state에 저장
  //   setOV(newOV)
  //   setSession(newSession)
  //
  //   const connection = () => {
  //     // 4-a token 생성
  //     getToken().then(token => {
  //       newSession
  //         .connect(token, { clientData: myUserName })
  //         .then(async () => {
  //           // 4-b user media 객체 생성
  //           newOV
  //             .getUserMedia({
  //               audioSource: false,
  //               videoSource: undefined,
  //               resolution: '1280x720',
  //               frameRate: 10,
  //             })
  //             .then(mediaStream => {
  //               const videoTrack = mediaStream.getVideoTracks()[0]
  //
  //               const newPublisher = newOV.initPublisher(myUserName, {
  //                 audioSource: undefined,
  //                 videoSource: videoTrack,
  //                 publishAudio: true,
  //                 publishVideo: true,
  //                 resolution: '1280x720',
  //                 frameRate: 60,
  //                 insertMode: 'APPEND',
  //                 mirror: true,
  //               })
  //               // 4-c publish
  //               newPublisher.once('accessAllowed', () => {
  //                 newSession.publish(newPublisher)
  //                 setPublisher(newPublisher)
  //               })
  //             })
  //         })
  //         .catch(error => {
  //           console.warn(
  //             'There was an error connecting to the session:',
  //             error.code,
  //             error.message,
  //           )
  //         })
  //     })
  //
  //     // 1-1 session에 참여한 사용자 추가
  //     newSession.on('streamCreated', event => {
  //       const newSubscriber = newSession.subscribe(
  //         event.stream,
  //         JSON.parse(event.stream.connection.data).clientData,
  //       )
  //
  //       const newSubscribers = subscribers
  //       newSubscribers.push(newSubscriber)
  //
  //       setSubscribers([...newSubscribers])
  //     })
  //     // 1-2 session에서 disconnect한 사용자 삭제
  //     newSession.on('streamDestroyed', event => {
  //       if (event.stream.typeOfVideo === 'CUSTOM') {
  //         deleteSubscriber(event.stream.streamManager)
  //       }
  //     })
  //
  //     // 1-3 예외처리
  //     newSession.on('exception', exception => {
  //       console.warn(exception)
  //     })
  //   }
  //   // 4. session에 connect하는 과정
  //   connection()
  // }
  //
  // // 세션 나가기
  // const leaveSession = () => {
  //   // --- 7) Leave the session by calling 'disconnect' method over the Session object ---
  //   // Empty all properties...
  //   setOV(null)
  //   setSession(undefined)
  //   setSubscribers([])
  //   setMySessionId('')
  //   setMyUserName('nickname')
  //   setPublisher(undefined)
  // }

  return (
    <Container>
      <h2>회의 만들기</h2>
      <button type="button">회의 만들기</button>
    </Container>
  )
}

const Container = styled.div`
  margin-right: 40px;
`

export default CreateMeeting
