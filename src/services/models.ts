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
    
    const modelsArray = normalizeResponseData(data)
    const transformedModels = transformModelsData(modelsArray)
    
    if (transformedModels.length > 0) {
      return transformedModels
    }
    
    throw new Error('No valid models found in API response')
  } catch (error) {
    console.error('Failed to fetch models:', error)
    return FALLBACK_MODELS
  }
}

/**
 * Normalize API response data to array format
 */
function normalizeResponseData(data: unknown): any[] {
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object') {
    const dataObj = data as Record<string, unknown>
    return dataObj.models && Array.isArray(dataObj.models) ? dataObj.models : Object.values(dataObj)
  }
  return []
}

/**
 * Transform raw model data to FireworksModel interface
 */
function transformModelsData(modelsArray: any[]): FireworksModel[] {
  return modelsArray
    .filter((model: any) => model && typeof model === 'object')
    .map(transformSingleModel)
    .filter((model: FireworksModel) => model.id && model.name)
}

/**
 * Transform a single model object
 */
function transformSingleModel(model: any): FireworksModel {
  return {
    id: model.id || model.name || model.model || String(model),
    name: model.title || model.name || model.hf || model.id || String(model),
    provider: model.provider?.name || model.provider?.org || model.provider || model.org || 'Fireworks',
    description: model.description || '',
    contextLength: model.contextLength,
    tags: Array.isArray(model.tags) ? model.tags : undefined,
    cost: model.cost ? {
      inputTokenPrice: model.cost.inputTokenPrice,
      outputTokenPrice: model.cost.outputTokenPrice,
      tokenPrice: model.cost.tokenPrice
    } : undefined,
    serverless: model.serverless,
    supportsImageInput: model.supportsImageInput
  }
}
