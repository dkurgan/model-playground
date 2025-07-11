import type { FireworksMessage, FireworksResponse, ChatOptions, NetworkMetrics } from './types'
import { fetchModels } from './models'

/**
 * Fireworks AI API Service
 * Handles chat completions, streaming, and metrics collection
 */
export class FireworksService {
  private readonly apiKey: string
  private readonly baseUrl = 'https://api.fireworks.ai/inference/v1'
  private readonly endpoints = {
    chatCompletions: `${this.baseUrl}/chat/completions`
  } as const
  
  private metrics: NetworkMetrics = {}

  // Default configuration
  private readonly defaultOptions: Required<ChatOptions> = {
    temperature: 0.7,
    max_tokens: 2048,
    top_p: 1
  }

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Fireworks API key is required')
    }
    this.apiKey = apiKey
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): NetworkMetrics {
    return { ...this.metrics }
  }

  /**
   * Update performance metrics
   */
  private updateMetrics(updates: Partial<NetworkMetrics>): void {
    this.metrics = { ...this.metrics, ...updates }
  }

  /**
   * Fetch available models
   */
  async fetchModels() {
    return fetchModels()
  }

  /**
   * Create request headers for API calls
   */
  private createHeaders(isStreaming = false) {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': isStreaming ? 'text/event-stream' : 'application/json'
    }
  }

  /**
   * Build request body with merged options
   */
  private buildRequestBody(
    model: string, 
    messages: FireworksMessage[], 
    options: ChatOptions,
    stream: boolean = false
  ) {
    const mergedOptions = { ...this.defaultOptions, ...options }
    
    return {
      model,
      messages,
      temperature: mergedOptions.temperature,
      max_tokens: mergedOptions.max_tokens,
      top_p: mergedOptions.top_p,
      stream
    }
  }

  /**
   * Send a chat completion request (non-streaming)
   */
  async chatCompletion(
    model: string,
    messages: FireworksMessage[],
    options: ChatOptions = {}
  ): Promise<FireworksResponse> {
    const startTime = Date.now()
    
    const requestBody = this.buildRequestBody(model, messages, options, false)

    try {
      const response = await fetch(this.endpoints.chatCompletions, {
        method: 'POST',
        headers: this.createHeaders(false),
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `Fireworks API error: ${response.status} - ${errorData.error?.message || response.statusText}`
        )
      }

      const responseData = await response.json()
      this.calculateAndUpdateMetrics(startTime, responseData, requestDuration => requestDuration)

      return responseData
    } catch (error) {
      this.handleApiError(error, 'chat completion')
    }
  }

  /**
   * Calculate and update performance metrics
   */
  private calculateAndUpdateMetrics(
    startTime: number, 
    responseData: any, 
    timeToFirstTokenCalculator: (duration: number) => number
  ): void {
    const endTime = Date.now()
    const requestDuration = endTime - startTime
    
    const totalTokens = responseData.usage?.total_tokens || 0
    const completionTokens = responseData.usage?.completion_tokens || 0
    
    if (completionTokens > 0 && requestDuration > 0) {
      const tokensPerSecond = (completionTokens / requestDuration) * 1000
      this.updateMetrics({
        requestDuration,
        totalTokens,
        tokensPerSecond,
        timeToFirstToken: timeToFirstTokenCalculator(requestDuration)
      })
    }
  }

  /**
   * Handle API errors with consistent formatting
   */
  private handleApiError(error: unknown, operation: string): never {
    if (error instanceof Error) {
      // Check for model not found errors
      if (error.message.includes('404') && error.message.includes('Model not found')) {
        throw new Error(`Model is not available or deployed. Please select a different model.`)
      }
      
      // Check for other API errors
      if (error.message.includes('Fireworks API error:')) {
        throw error // Re-throw as-is since it's already formatted
      }
      
      throw new Error(`Failed to ${operation}: ${error.message}`)
    }
    throw new Error(`Unknown error occurred during ${operation}`)
  }

  /**
   * Send a streaming chat completion request
   */
  async streamChatCompletion(
    model: string,
    messages: FireworksMessage[],
    options: ChatOptions = {},
    onChunk?: (chunk: string) => void,
    abortSignal?: AbortSignal
  ): Promise<void> {
    const startTime = Date.now()
    let firstTokenTime: number | null = null
    let tokenCount = 0
    
    const requestBody = this.buildRequestBody(model, messages, options, true)

    try {
      const response = await fetch(this.endpoints.chatCompletions, {
        method: 'POST',
        headers: this.createHeaders(true),
        body: JSON.stringify(requestBody),
        signal: abortSignal
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `Fireworks API error: ${response.status} - ${errorData.error?.message || response.statusText}`
        )
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Failed to get response reader')
      }

      await this.processStreamingResponse(
        reader, 
        abortSignal, 
        onChunk, 
        startTime, 
        firstTokenTime, 
        tokenCount
      )
      
    } catch (error) {
      this.handleApiError(error, 'streaming chat completion')
    }
  }

  /**
   * Process streaming response data
   */
  private async processStreamingResponse(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    abortSignal: AbortSignal | undefined,
    onChunk: ((chunk: string) => void) | undefined,
    startTime: number,
    firstTokenTime: number | null,
    tokenCount: number
  ): Promise<void> {
    const decoder = new TextDecoder()
    let currentFirstTokenTime = firstTokenTime
    let currentTokenCount = tokenCount
    
    while (true) {
      if (abortSignal?.aborted) {
        await reader.cancel()
        return
      }
      
      const { done, value } = await reader.read()
      
      if (done) break
      
      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')
      
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        
        const data = line.slice(6)
        
        if (data === '[DONE]') {
          this.finalizeStreamingMetrics(startTime, currentFirstTokenTime, currentTokenCount)
          return
        }
        
        const result = this.processStreamingChunk(data, onChunk)
        if (result) {
          if (currentFirstTokenTime === null) {
            currentFirstTokenTime = Date.now()
          }
          currentTokenCount += result.tokenCount
        }
      }
    }
  }

  /**
   * Process individual streaming chunk
   */
  private processStreamingChunk(
    data: string, 
    onChunk?: (chunk: string) => void
  ): { tokenCount: number } | null {
    try {
      const parsed = JSON.parse(data)
      const content = parsed.choices?.[0]?.delta?.content
      
      if (content && onChunk) {
        onChunk(content)
        // Rough token count estimation (words * 1.3)
        return { tokenCount: Math.ceil(content.split(' ').length * 1.3) }
      }
    } catch {
      // Skip malformed JSON
    }
    
    return null
  }

  /**
   * Finalize streaming metrics calculation
   */
  private finalizeStreamingMetrics(
    startTime: number, 
    firstTokenTime: number | null, 
    tokenCount: number
  ): void {
    const endTime = Date.now()
    const requestDuration = endTime - startTime
    
    if (tokenCount > 0 && requestDuration > 0) {
      const tokensPerSecond = (tokenCount / requestDuration) * 1000
      this.updateMetrics({
        requestDuration,
        totalTokens: tokenCount,
        tokensPerSecond,
        timeToFirstToken: firstTokenTime ? firstTokenTime - startTime : requestDuration
      })
    }
  }

  /**
   * Send a single message with conversation history (non-streaming)
   */
  async sendMessage(
    model: string,
    message: string,
    conversationHistory: FireworksMessage[] = [],
    options: ChatOptions = {}
  ): Promise<string> {
    const messages: FireworksMessage[] = [
      ...conversationHistory,
      { role: 'user', content: message }
    ]

    const response = await this.chatCompletion(model, messages, options)
    
    return response.choices[0]?.message?.content || ''
  }

  /**
   * Send a single message with conversation history (streaming)
   */
  async sendStreamingMessage(
    model: string,
    message: string,
    conversationHistory: FireworksMessage[] = [],
    options: ChatOptions = {},
    onChunk?: (chunk: string) => void,
    abortSignal?: AbortSignal
  ): Promise<void> {
    const messages: FireworksMessage[] = [
      ...conversationHistory,
      { role: 'user', content: message }
    ]

    await this.streamChatCompletion(
      model, 
      messages, 
      options, 
      onChunk, 
      abortSignal
    )
  }
}