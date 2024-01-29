import { useEffect, useState } from 'react'
import {
  OpenVidu,
  Publisher,
  Session as OVSession,
  StreamManager,
  Subscriber,
} from 'openvidu-browser'
import axios from 'axios'
import styled from 'styled-components'
import MeetingRoomItem from '@src/components/MeetingRoomItem'
import { MeetingSessionType } from '@src/types/MeetingType'
import MeetingVideo from '@src/components/MeetingVideo'
import CreateMeeting from '@src/components/CreateMeeting'
import { useAtomValue, useSetAtom } from 'jotai/index'
import { userAtom } from '@src/stores/atom/user.ts' // const APPLICATION_SERVER_URL =

// const APPLICATION_SERVER_URL =
//   process.env.NODE_ENV === 'production'
//     ? ''
//     : 'https://i8d105.p.ssafy.io/be/openvidu/'
// const APPLICATION_SERVER_URL = 'http://localhost:8080/openvidu/'

const MeetingPage = () => {
  // openvidu state
  const [, setOV] = useState<OpenVidu | null>(null)
  const [mySessionId, setMySessionId] = useState<string>('')
  const [myUserName, setMyUserName] = useState('박태호')
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [publisher, setPublisher] = useState<Publisher | undefined>(undefined)
  const [session, setSession] = useState<OVSession | undefined>(undefined)

  // 돌아가기 버튼 함수
  const pageBackHandler = () => {
    leaveSession()
  }

  // 방 세션 나간 사람들 삭제
  const deleteSubscriber = (streamManager: StreamManager) => {
    const prevSubscribers = subscribers
    let index = -1
    if (streamManager instanceof Subscriber) {
      index = prevSubscribers.indexOf(streamManager, 0)
    }
    if (index > -1) {
      prevSubscribers.splice(index, 1)
      setSubscribers([...prevSubscribers])
    }
  }

  // sessionId 받아오기
  const addSessionIdHandler = (getSessionId: string) => {
    setMySessionId(getSessionId)
  }

  useEffect(() => {
    if (mySessionId !== '') {
      joinSession()
    }
  }, [mySessionId])

  // 방 참가
  const joinSession = () => {
    // 1. openvidu 객체 생성
    const newOV = new OpenVidu()
    // socket 통신 과정에서 많은 log를 남기게 되는데 필요하지 않은 log를 띄우지 않게 하는 모드
    newOV.enableProdMode()
    // 2. initSesison 생성
    const newSession = newOV.initSession()

    // 3. 미팅을 종료하거나 뒤로가기 등의 이벤트를 통해 세션을 disconnect 해주기 위해 state에 저장
    setOV(newOV)
    setSession(newSession)

    const connection = () => {
      // 4-a token 생성
      getToken().then(async (token: string) => {
        console.log('token', token)
        newSession
          .connect(token, { clientData: myUserName })
          .then(async () => {
            console.log('here')
            // 4-b user media 객체 생성
            newOV
              .getUserMedia({
                audioSource: false,
                videoSource: undefined,
                resolution: '1280x720',
                frameRate: 10,
              })
              .then(mediaStream => {
                const videoTrack = mediaStream.getVideoTracks()[0]

                const newPublisher = newOV.initPublisher(myUserName, {
                  audioSource: undefined,
                  videoSource: videoTrack,
                  publishAudio: true,
                  publishVideo: true,
                  resolution: '1280x720',
                  frameRate: 60,
                  insertMode: 'APPEND',
                  mirror: true,
                })
                // 4-c publish
                newPublisher.once('accessAllowed', () => {
                  newSession.publish(newPublisher)
                  setPublisher(newPublisher)
                })
              })
          })
          .catch(error => {
            console.warn(
              'There was an error connecting to the session:',
              error.code,
              error.message,
            )
          })
      })

      // 1-1 session에 참여한 사용자 추가
      newSession.on('streamCreated', event => {
        const newSubscriber = newSession.subscribe(
          event.stream,
          JSON.parse(event.stream.connection.data).clientData,
        )

        const newSubscribers = subscribers
        newSubscribers.push(newSubscriber)

        setSubscribers([...newSubscribers])
      })
      // 1-2 session에서 disconnect한 사용자 삭제
      newSession.on('streamDestroyed', event => {
        if (event.stream.typeOfVideo === 'CUSTOM') {
          deleteSubscriber(event.stream.streamManager)
        }
      })

      // 1-3 예외처리
      newSession.on('exception', exception => {
        console.warn(exception)
      })
    }
    // 4. session에 connect하는 과정
    connection()
  }

  const user = useAtomValue(userAtom)
  const setUser = useSetAtom(userAtom)

  // 세션 나가기
  const leaveSession = () => {
    const maintainSessionId = user.mySessionId
    const mySession = session
    if (maintainSessionId) {
      sendLeave(maintainSessionId)
      if (mySession) {
        mySession.disconnect()
        setUser(user => ({ ...user, mySessionId: '', isMeeting: false }))
      }
    }
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---
    // Empty all properties...
    setOV(null)
    setSession(undefined)
    setSubscribers([])
    setMySessionId('')
    setMyUserName('nickname')
    setPublisher(undefined)
  }

  const sendLeave = async (sessionId: string) => {
    const url = 'api/sessions/' + sessionId + '/disconnections'
    const data = {}
    const response = await axios.post(url, data)
    return response
  }

  // 토큰 가져오기
  const getToken = async () => {
    return await createToken(mySessionId)
  }

  const createToken = async (mySessionId: string) => {
    const url = 'api/sessions/' + mySessionId + '/connections'
    const data = {}
    const response = await axios.post(url, data)
    console.log('createtoken', response.data.token)
    return response.data.token
  }

  // 열려 있는 세션 방
  const [sessionLists, setSessionLists] = useState<MeetingSessionType[]>([])
  const [getSessionStatus, setGetSessionStatus] = useState(false)

  // 세션 얻기
  const getSession = async () => {
    setGetSessionStatus(true)
    const url = 'api/sessions'
    const response = await axios.get(url)
    setSessionLists(response.data.data)
  }

  // // 대기창 5초마다 실행
  // useInterval(() => {
  //   if (getSessionStatus) {
  //     getSession()
  //   }
  // }, 5000)

  // 세션 종료 후 대기창 원래 상태로
  useEffect(() => {
    setSessionLists([])
  }, [getSessionStatus])

  useEffect(() => {
    getSession()
  }, [])

  // 방 만든 사람 아이디
  const [getConsultantId, setGetConsultantId] = useState<string>('')
  useEffect(() => {}, [getConsultantId])

  // 새로고침 시 axios 보내기
  const beforeUnLoad = (e: BeforeUnloadEvent) => {
    e.stopPropagation()
    e.returnValue = ''
  }

  useEffect(() => {
    window.addEventListener('beforeunload', beforeUnLoad)
    leaveSession()

    return () => {
      window.removeEventListener('beforeunload', beforeUnLoad)
    }
  }, [])

  return (
    <Container>
      <CreateMeeting />
      <VideoWrap>
        {session === undefined && (
          <UserWrap>
            <h2>현재 회의 가능한 방</h2>
            <button type="button" onClick={getSession}>
              새로고침
            </button>
            <ul>
              {sessionLists.map((item, idx) => (
                <li key={idx}>
                  <MeetingRoomItem
                    setGetSessionStatus={setGetSessionStatus}
                    setGetConsultantId={setGetConsultantId}
                    onAddSessionId={addSessionIdHandler}
                    consultantId={item.consultantId.consultantId}
                    consultantNickname={item.consultantId.consultantNickname}
                    sessionId={item.sessionId}
                  />
                </li>
              ))}
            </ul>
          </UserWrap>
        )}
        {session !== undefined && (
          <SessionOnWrap>
            <button type="button" onClick={pageBackHandler}>
              뒤로가기
            </button>
            <VideoContainer>
              {publisher !== undefined && (
                <StreamContainer>
                  <MeetingVideo streamManager={publisher} status="user" />
                </StreamContainer>
              )}
              {subscribers.map((sub, i) => (
                <StreamContainer key={i}>
                  <span>{sub.id}</span>
                  <MeetingVideo streamManager={sub} status="consultant" />
                </StreamContainer>
              ))}
            </VideoContainer>
          </SessionOnWrap>
        )}
      </VideoWrap>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
`

const VideoWrap = styled.div`
  height: 100%;
`

const UserWrap = styled.div`
  width: 100%;
  height: 100%;
  display: inline-block;
`

const SessionOnWrap = styled.div``

const VideoContainer = styled.div``

const StreamContainer = styled.div``

export default MeetingPage
