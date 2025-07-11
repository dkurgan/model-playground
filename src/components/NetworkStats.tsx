import { useState, useEffect } from 'react'
import { getFireworksService, type NetworkMetrics } from '../services/fireworks'

export const NetworkStats = () => {
  const [metrics, setMetrics] = useState<NetworkMetrics>({})

  useEffect(() => {
    const updateMetrics = () => {
      try {
        const service = getFireworksService()
        const currentMetrics = service.getMetrics()
        setMetrics(currentMetrics)
      } catch (error) {
        // Service not initialized yet
      }
    }

    // Update metrics immediately
    updateMetrics()

    // Set up polling for metrics updates
    const interval = setInterval(updateMetrics, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatDuration = (ms?: number) => {
    if (!ms) return 'N/A'
    if (ms < 1000) return `${Math.round(ms)}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const formatTokensPerSecond = (tps?: number) => {
    if (!tps) return 'N/A'
    return `${Math.round(tps)} tok/s`
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-900">Network Stats</h4>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Time to First Token:</span>
          <span className="text-gray-900 font-mono">
            {formatDuration(metrics.timeToFirstToken)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tokens per Second:</span>
          <span className="text-gray-900 font-mono">
            {formatTokensPerSecond(metrics.tokensPerSecond)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Request Duration:</span>
          <span className="text-gray-900 font-mono">
            {formatDuration(metrics.requestDuration)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Tokens:</span>
          <span className="text-gray-900 font-mono">
            {metrics.totalTokens || 'N/A'}
          </span>
        </div>
      </div>
  )
}