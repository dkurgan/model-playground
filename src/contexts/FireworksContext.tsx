import { createContext, useContext, type ReactNode } from 'react'
import { useFireworksService } from '../hooks/useFireworksService'
import type { FireworksModel } from '../services/fireworks'

interface FireworksContextType {
  models: FireworksModel[]
  selectedModel: string
  modelsLoading: boolean
  error: string | null
  handleModelChange: (modelId: string) => void
  trackModelUsage: (modelId: string) => void
  lastTwoUsedModels: FireworksModel[]
}

const FireworksContext = createContext<FireworksContextType | undefined>(undefined)

export const useFireworksContext = () => {
  const context = useContext(FireworksContext)
  if (context === undefined) {
    throw new Error('useFireworksContext must be used within a FireworksProvider')
  }
  return context
}

interface FireworksProviderProps {
  children: ReactNode
}

export const FireworksProvider = ({ children }: FireworksProviderProps) => {
  const fireworksState = useFireworksService()

  return (
    <FireworksContext.Provider value={fireworksState}>
      {children}
    </FireworksContext.Provider>
  )
}