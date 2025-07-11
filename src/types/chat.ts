export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  modelId?: string
}

export interface ChatSettings {
  temperature: number
  maxTokens: number
}