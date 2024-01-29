import { atom } from 'jotai'
import { UserType } from '@src/types/UserType'

// userType : 0-개인, 1-보호소
const currentUser = {
  mySessionId: '',
  isMeeting: false,
  userType: 0,
}

export const userAtom = atom<UserType>(currentUser)
