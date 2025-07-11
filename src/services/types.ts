/**
 * Core types for Fireworks AI API integration
 */

/**
 * Message format for Fireworks API
 */
export interface FireworksMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/**
 * Model cost information
 */
export interface ModelCost {
  inputTokenPrice?: number
  outputTokenPrice?: number
  tokenPrice?: number
}

/**
 * Model information from Fireworks API
 */
export interface FireworksModel {
  id: string
  name: string
  provider: string
  description?: string
  contextLength?: number
  tags?: string[]
  cost?: ModelCost
  serverless?: boolean
  supportsImageInput?: boolean
}

/**
 * Response format from Fireworks API
 */
export interface FireworksResponse {
  choices: Array<{
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

/**
 * Configuration options for chat requests
 */
export interface ChatOptions {
  /** Controls randomness in responses (0-1) */
  temperature?: number
  /** Maximum tokens to generate */
  max_tokens?: number
  /** Nucleus sampling parameter (0-1) */
  top_p?: number
}

/**
 * Performance metrics for API requests
 */
export interface NetworkMetrics {
  /** Time to receive first token (ms) */
  timeToFirstToken?: number
  /** Tokens generated per second */
  tokensPerSecond?: number
  /** Total tokens in response */
  totalTokens?: number
  /** Total request duration (ms) */
  requestDuration?: number
}