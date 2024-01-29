import styled from 'styled-components'
import UserVideoComponent from '@src/components/UserVideoComponent'
import { useAtomValue } from 'jotai'
import { userAtom } from '@src/stores/atom/user'
import { Publisher, Subscriber } from 'openvidu-browser'

const MeetingVideo = (props: {
  streamManager: Publisher | Subscriber | undefined
  status: string
}) => {
  const { streamManager, status } = props
  const user = useAtomValue(userAtom)
  return (
    <Container>
      {status === 'user' ? (
        <VideoWrap>
          <StreamWrap>
            <UserVideoComponent
              streamManager={streamManager}
              userType={user.userType}
            />
            <div>개인</div>
          </StreamWrap>
        </VideoWrap>
      ) : (
        <VideoWrap>
          <StreamWrap>
            <UserVideoComponent
              streamManager={streamManager}
              userType={user.userType}
            />
          </StreamWrap>
        </VideoWrap>
      )}
    </Container>
  )
}

const Container = styled.div`
width: 200px;
  height: 200px;`

const VideoWrap = styled.div`
  width: 100px;
  height: 100px;
`

const StreamWrap = styled.div`
  width: 100px;
  height: 100px;
`

export default MeetingVideo
