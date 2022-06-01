import create from 'zustand'

export const useStore = create(set => ({
  chat: false,
  setChat: (chat) => set({chat}),
  allMessage: [], 
  setAllMessage: (newMessage) => set(state=> ({allMessage:[...state.allMessage, newMessage]})), 
}))

