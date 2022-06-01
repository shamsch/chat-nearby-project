import create from 'zustand'
import { socket } from '../socket.io/connection'

export const useStore = create(set => ({
  chat: false,
  setChat: (chat) => set({chat}),
  allMessage: [], 
  setAllMessage: (newMessage) => set(state=> ({allMessage:[...state.allMessage, newMessage]})), //it's actually appending but to keep the naming consistent les go w/ setState
  clearAllMessage: () => set({allMessage: []}),
  userCount: 0,
  setUserCount: (userCount) => set({userCount}),
  chatAlive: true, 
  setChatAlive: (chatAlive) => set({chatAlive}), 
  socket: socket, 
}))

