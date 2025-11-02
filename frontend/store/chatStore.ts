import { create } from 'zustand';
import { ChatMessage } from '../services/chatService';

interface ChatStore {
  messages: ChatMessage[];
  isTyping: boolean;
  sessionId: string;
  isChatOpen: boolean;
  currentEmotion: string;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setTyping: (isTyping: boolean) => void;
  setSessionId: (sessionId: string) => void;
  setChatOpen: (isOpen: boolean) => void;
  setCurrentEmotion: (emotion: string) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isTyping: false,
  sessionId: '',
  isChatOpen: false,
  currentEmotion: 'calm',
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  setTyping: (isTyping) => set({ isTyping }),
  setSessionId: (sessionId) => set({ sessionId }),
  setChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
  setCurrentEmotion: (emotion) => set({ currentEmotion: emotion }),
  clearMessages: () => set({ messages: [] }),
}));
