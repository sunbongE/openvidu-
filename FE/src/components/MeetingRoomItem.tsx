import { MeetingRoomItemType } from '@src/types/MeetingType'
import { useSetAtom } from 'jotai'
import { userAtom } from '@src/stores/atom/user'

const MeetingRoomItem = (props: MeetingRoomItemType) => {
  const setUser = useSetAtom(userAtom)
  const {
    setGetSessionStatus,
    setGetConsultantId,
    onAddSessionId,
    consultantId,
    consultantNickname,
    sessionId,
  } = props

  const consultantSessionId = sessionId

  const enterSessionHandler = () => {
    const sessionId = consultantSessionId
    console.log('sessionId', sessionId)
    onAddSessionId(sessionId)
    setGetConsultantId(consultantId)
    setGetSessionStatus(false)
    setUser(user => ({ ...user, mySessionId: sessionId, isMeeting: true }))
  }

  return (
    <div>
      <div>{consultantNickname}님의 방</div>
      <button type="button" onClick={enterSessionHandler}>
        입장하기
      </button>
    </div>
  )
}

export default MeetingRoomItem
