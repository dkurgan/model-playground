import { useEffect, useRef } from 'react'
import { ModelChangeSeparator } from './ModelChangeSeparator'
import { Message } from './Message'
import { useFireworksContext } from '../contexts/FireworksContext'
import { useChatContext } from '../contexts/ChatContext'

export const ChatArea = () => {
  const { chatHistory, isLoading, isStreamingStarted } = useChatContext()
  const { models } = useFireworksContext()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  
  const getModelTitle = (modelId: string) => {
    const model = models.find(m => m.id === modelId)
    return model?.name || modelId
  }

  const scrollToBottom = (smooth = false) => {
    if (scrollAreaRef.current) {
      if (smooth) {
        scrollAreaRef.current.scrollTo({
          top: scrollAreaRef.current.scrollHeight,
          behavior: 'smooth'
        })
      } else {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
      }
    }
  }

  // Auto-scroll to bottom for new messages, loading state, and streaming
  useEffect(() => {
    if (isLoading) {
      scrollToBottom()
    } else if (isStreamingStarted && chatHistory.length > 0) {
      const lastMessage = chatHistory[chatHistory.length - 1]
      if (lastMessage.role === 'assistant' && lastMessage.content) {
        requestAnimationFrame(() => scrollToBottom())
      }
    } else {
      scrollToBottom()
    }
  }, [chatHistory.length, chatHistory, isLoading, isStreamingStarted])
  
  const renderMessages = () => {
    const elements: React.ReactNode[] = []
    
    chatHistory.forEach((msg, index) => {
      const prevMsg = chatHistory[index - 1]
      
      // Show model change separator if model changed from previous message
      if (prevMsg && msg.modelId && prevMsg.modelId && msg.modelId !== prevMsg.modelId) {
        elements.push(
          <ModelChangeSeparator 
            key={`separator-${msg.id}`}
            previousModel={getModelTitle(prevMsg.modelId)}
            currentModel={getModelTitle(msg.modelId)}
          />
        )
      }
      
      elements.push(<Message key={msg.id} message={msg} />)
    })
    
    return elements
  }

  return (
    <div ref={scrollAreaRef} className="flex-1 overflow-y-auto mb-8 min-h-0">
      <div className="space-y-6 p-1">
        {renderMessages()}
        {isLoading && !isStreamingStarted && (
          <div className="flex justify-start">
            <div className="max-w-3xl px-4 py-3 rounded-lg bg-white border border-gray-200">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#6720ff]"></div>
                <span className="text-gray-600">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}