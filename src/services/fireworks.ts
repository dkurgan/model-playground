/**
 * Fireworks AI Service Integration
 * Main entry point for all Fireworks API operations
 */

import { FireworksService } from './FireworksService'
import { fetchModels } from './models'
import type { 
  FireworksMessage, 
  FireworksResponse, 
  ChatOptions, 
  FireworksModel, 
  NetworkMetrics 
} from './types'

/**
 * Global service instance
 */
let fireworksService: FireworksService | null = null

/**
 * Initialize the Fireworks service with API key
 * @param apiKey - Fireworks AI API key
 * @returns Initialized service instance
 */
export const initializeFireworksService = (apiKey: string): FireworksService => {
  fireworksService = new FireworksService(apiKey)
  return fireworksService
}

/**
 * Get the current Fireworks service instance
 * @throws Error if service not initialized
 * @returns Current service instance
 */
export const getFireworksService = (): FireworksService => {
  if (!fireworksService) {
    throw new Error('Fireworks service not initialized. Call initializeFireworksService first.')
  }
  return fireworksService
}

/**
 * Check if service is initialized
 * @returns True if service is ready to use
 */
export const isServiceInitialized = (): boolean => {
  return fireworksService !== null
}

// Re-export core classes and functions
export { FireworksService, fetchModels }

// Re-export types
export type { 
  FireworksMessage, 
  FireworksResponse, 
  ChatOptions, 
  FireworksModel, 
  NetworkMetrics 
}