import { useState, useRef } from 'react'
import { getFireworksService, initializeFireworksService, type FireworksMessage } from '../services/fireworks'
import type { ChatMessage, ChatSettings } from '../types/chat'

const generateMessageId = () => Date.now().toString()

const getOrInitializeService = (apiKey: string) => {
  try {
    return getFireworksService()
  } catch {
    return initializeFireworksService(apiKey)
  }
}

export const useChat = (onModelUsed?: (modelId: string) => void) => {
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isStreamingStarted, setIsStreamingStarted] = useState(false)
  const [settings] = useState<ChatSettings>({
    temperature: 0.7,
    maxTokens: 2048
  })
  
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleSend = async (selectedModel: string) => {
    if (!message.trim() || isLoading) return

    if (!selectedModel) {
      setError('Please select a model first')
      return
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()
    const currentAbortController = abortControllerRef.current

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
      modelId: selectedModel
    }

    setChatHistory(prev => [...prev, userMessage])
    setMessage('')
    setError(null)
    setIsLoading(true)
    setIsStreamingStarted(false)
    
    // Track model usage when a message is actually sent
    if (onModelUsed) {
      onModelUsed(selectedModel)
    }

    const assistantMessageId = generateMessageId() + '_assistant'
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      modelId: selectedModel
    }

    try {
      const apiKey = import.meta.env.VITE_FIREWORKS_API_KEY
      if (!apiKey) {
        throw new Error('API key not available')
      }

      const fireworksService = getOrInitializeService(apiKey)
      
      const fireworksMessages: FireworksMessage[] = chatHistory
        .filter(msg => msg.modelId === selectedModel)
        .map(msg => ({ role: msg.role, content: msg.content }))

      let firstChunk = true
      
      await fireworksService.sendStreamingMessage(
        selectedModel,
        userMessage.content,
        fireworksMessages,
        {
          temperature: settings.temperature,
          max_tokens: settings.maxTokens
        },
        (chunk: string) => {
          // Check if this request was aborted
          if (currentAbortController.signal.aborted) {
            return
          }
          
          // First chunk received - add the assistant message and mark streaming as started
          if (firstChunk) {
            firstChunk = false
            setIsStreamingStarted(true)
            setChatHistory(prev => [...prev, assistantMessage])
          }
          
          setChatHistory(prev => 
            prev.map(msg => 
              msg.id === assistantMessageId 
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          )
        },
        currentAbortController.signal
      )
    } catch (err) {
      // Don't show error if request was aborted
      if (!currentAbortController.signal.aborted) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
        setChatHistory(prev => prev.filter(msg => msg.id !== assistantMessageId))
      }
    } finally {
      if (!currentAbortController.signal.aborted) {
        setIsLoading(false)
        setIsStreamingStarted(false)
      }
    }
  }

  const clearHistory = () => {
    setChatHistory([])
    setError(null)
  }

  const cancelCurrentRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsLoading(false)
      setIsStreamingStarted(false)
    }
  }

  return {
    message,
    setMessage,
    chatHistory,
    isLoading,
    isStreamingStarted,
    error,
    setError,
    handleSend,
    clearHistory,
    cancelCurrentRequest
  }
}