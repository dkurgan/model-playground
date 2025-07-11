import { createContext, useContext, type ReactNode } from 'react'
import { useChat } from '../hooks/useChat'
import { useFireworksContext } from './FireworksContext'
import type { ChatMessage } from '../types/chat'

interface ChatContextType {
  message: string
  setMessage: (message: string) => void
  chatHistory: ChatMessage[]
  isLoading: boolean
  isStreamingStarted: boolean
  error: string | null
  setError: (error: string | null) => void
  handleSend: (selectedModel: string) => Promise<void>
  clearHistory: () => void
  cancelCurrentRequest: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}

interface ChatProviderProps {
  children: ReactNode
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const { trackModelUsage } = useFireworksContext()
  const chatState = useChat(trackModelUsage)

  return (
    <ChatContext.Provider value={chatState}>
      {children}
    </ChatContext.Provider>
  )
}