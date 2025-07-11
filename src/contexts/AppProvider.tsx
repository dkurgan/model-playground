import { type ReactNode } from 'react'
import { ChatProvider } from './ChatContext'
import { FireworksProvider } from './FireworksContext'

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <FireworksProvider>
      <ChatProvider>
        {children}
      </ChatProvider>
    </FireworksProvider>
  )
}