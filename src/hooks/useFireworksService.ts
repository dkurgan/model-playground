import { useState, useEffect } from 'react'
import { initializeFireworksService, type FireworksModel } from '../services/fireworks'

export const useFireworksService = () => {
  const [models, setModels] = useState<FireworksModel[]>([])
  const [selectedModel, setSelectedModel] = useState('')
  const [modelsLoading, setModelsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastTwoUsedModels, setLastTwoUsedModels] = useState<FireworksModel[]>([])

  useEffect(() => {
    const initializeService = async () => {
      const apiKey = import.meta.env.VITE_FIREWORKS_API_KEY
      
      if (apiKey) {
        try {
          const service = initializeFireworksService(apiKey)
          
          setModelsLoading(true)
          const validModels = await service.fetchModels()
          
          setModels(validModels)
          
          if (validModels.length > 0) {
            setSelectedModel(validModels[0].id)
          }
          
        } catch (error) {
          console.error('Failed to initialize Fireworks service:', error)
          setError('Failed to initialize Fireworks service')
        } finally {
          setModelsLoading(false)
        }
      } else {
        setError('Fireworks API key not found. Please set VITE_FIREWORKS_API_KEY in your .env file.')
        setModelsLoading(false)
      }
    }

    initializeService()
  }, [])


  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId)
  }

  const trackModelUsage = (modelId: string) => {
    // Track model usage only when messages are actually sent
    const newModel = models.find(model => model.id === modelId)
    
    if (newModel) {
      setLastTwoUsedModels(prev => {
        // Remove the model if it already exists in the list
        const filtered = prev.filter(model => model.id !== modelId)
        // Add the new model to the front
        const updated = [newModel, ...filtered]
        // Keep only the last 2 models
        return updated.slice(0, 2)
      })
    }
  }

  return {
    models,
    selectedModel,
    modelsLoading,
    error,
    handleModelChange,
    trackModelUsage,
    lastTwoUsedModels
  }
}