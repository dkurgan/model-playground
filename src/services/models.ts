import type { FireworksModel } from './types'

/**
 * API endpoints for model operations
 */
const MODELS_API_URL = 'https://app.fireworks.ai/api/models/mini-playground'

/**
 * Fallback models in case API fails
 */
const FALLBACK_MODELS: FireworksModel[] = [
  { 
    id: 'accounts/fireworks/models/llama-v3p1-405b-instruct', 
    name: 'Llama 3.1 405B Instruct', 
    provider: 'Meta',
    description: 'Most capable Llama model',
    contextLength: 128000,
    tags: ['LLM', 'Serverless'],
    serverless: true
  },
  { 
    id: 'accounts/fireworks/models/llama-v3p1-70b-instruct', 
    name: 'Llama 3.1 70B Instruct', 
    provider: 'Meta',
    description: 'Balanced performance and speed',
    contextLength: 128000,
    tags: ['LLM', 'Serverless'],
    serverless: true
  },
  { 
    id: 'accounts/fireworks/models/llama-v3p1-8b-instruct', 
    name: 'Llama 3.1 8B Instruct', 
    provider: 'Meta',
    description: 'Fast and efficient',
    contextLength: 128000,
    tags: ['LLM', 'Serverless'],
    serverless: true
  },
  { 
    id: 'accounts/fireworks/models/mixtral-8x7b-instruct', 
    name: 'Mixtral 8x7B Instruct', 
    provider: 'Mistral',
    description: 'Mixture of experts model',
    contextLength: 32000,
    tags: ['LLM', 'Serverless'],
    serverless: true
  },
  { 
    id: 'accounts/fireworks/models/qwen2p5-72b-instruct', 
    name: 'Qwen 2.5 72B Instruct', 
    provider: 'Qwen',
    description: 'Advanced reasoning capabilities',
    contextLength: 32000,
    tags: ['LLM', 'Serverless'],
    serverless: true
  }
]

/**
 * Fetch available models from Fireworks API
 */
export async function fetchModels(): Promise<FireworksModel[]> {
  try {
    const response = await fetch(MODELS_API_URL)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`)
    }
    
    const data = await response.json()
    
    const models = Array.isArray(data) ? data : data.models || []
    
    const transformedModels = models.map((model: any) => ({
      id: model.name,
      name: model.title,
      provider: model.provider?.name || 'Fireworks',
      description: model.description || '',
      contextLength: model.contextLength,
      tags: model.tags,
      cost: model.cost,
      serverless: model.serverless,
      supportsImageInput: model.supportsImageInput
    }))
    
    if (transformedModels.length > 0) {
      return transformedModels
    }
    
    throw new Error('No valid models found in API response')
  } catch (error) {
    console.error('Failed to fetch models:', error)
    return FALLBACK_MODELS
  }
}

