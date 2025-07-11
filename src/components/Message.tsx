import type { ChatMessage } from '../types/chat'

interface MessageProps {
  message: ChatMessage
}

export const Message = ({ message }: MessageProps) => {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-3xl px-4 py-3 rounded-lg ${
        message.role === 'user' 
          ? 'bg-[#6720ff] text-white' 
          : 'bg-white border border-gray-200 text-gray-800'
      }`}>
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div className={`text-xs mt-2 ${
          message.role === 'user' ? 'text-purple-100' : 'text-gray-500'
        }`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}