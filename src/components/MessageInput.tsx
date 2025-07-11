import { useChatContext } from '../contexts/ChatContext'
import { useFireworksContext } from '../contexts/FireworksContext'

export const MessageInput = () => {
  const { message, setMessage, isLoading, handleSend } = useChatContext()
  const { selectedModel } = useFireworksContext()

  const onSend = () => {
    handleSend(selectedModel)
  }
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="max-w-xl mx-auto w-full flex-shrink-0">
      <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
        <div className="flex items-end">
          <div className="flex-1 px-6 py-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="How can I help you today?"
              disabled={isLoading}
              className="w-full resize-none border-0 focus:ring-0 focus:outline-none text-gray-700 placeholder-gray-400 text-base leading-relaxed bg-transparent disabled:opacity-50"
              rows={1}
              style={{
                minHeight: '24px',
                height: 'auto',
                overflow: 'hidden'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                target.style.height = target.scrollHeight + 'px'
              }}
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-4">
            <button
              onClick={onSend}
              disabled={!message.trim() || isLoading}
              className="w-8 h-8 bg-[#6720ff] hover:bg-[#5818e0] disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors ml-2"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}