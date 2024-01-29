import { Dispatch, SetStateAction } from 'react'

export type MeetingRoomItemType = {
  setGetSessionStatus: Dispatch<SetStateAction<boolean>>
  setGetConsultantId: Dispatch<SetStateAction<string>>
  onAddSessionId: (getSessionId: string) => void
  consultantId: string
  consultantNickname: string
  sessionId: string
}

export type MeetingSessionType = {
  consultantId: { consultantId: string; consultantNickname: string }
  sessionId: string
}
