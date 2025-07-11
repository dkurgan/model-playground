import { Panel } from './components/Panel'
import { WelcomeScreen } from './components/WelcomeScreen'
import { ChatArea } from './components/ChatArea'
import { MessageInput } from './components/MessageInput'
import { ErrorMessage } from './components/ErrorMessage'
import { useChatContext } from './contexts/ChatContext'
import { useFireworksContext } from './contexts/FireworksContext'

function App() {
  const { chatHistory, error: chatError } = useChatContext()
  const { error: serviceError } = useFireworksContext()

  const error = chatError || serviceError

  return (
    <div className="h-screen bg-stone-50 flex">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col px-4 py-8 overflow-hidden">
          <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col min-h-0">
            {chatHistory.length === 0 ? (
              <WelcomeScreen />
            ) : (
              <ChatArea />
            )}

            {error && <ErrorMessage error={error} />}

            <MessageInput />
          </div>
        </div>
      </div>
      <Panel />
    </div>
  )
}

export default App
