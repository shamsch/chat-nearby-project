import create from 'zustand'

export const useStore = create(set => ({
  chat: false,
  setChat: (chat) => set({chat}),
  allMessage: [], 
  setAllMessage: (newMessage) => set(state=> ({allMessage:[...state.allMessage, newMessage]})), //it's actually appending but to keep the naming consistent les go w/ setState
  userCount: 0,
  setUserCount: (userCount) => set({userCount}),
  chatAlive: true, 
  setChatAlive: (chatAlive) => set({chatAlive}) 
}))

