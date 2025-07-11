import type { FireworksModel } from '../services/types'

interface CompareModelsStatsProps {
  lastTwoModels: FireworksModel[]
}

export const CompareModelsStats = ({ lastTwoModels }: CompareModelsStatsProps) => {
  
  if (lastTwoModels.length < 2) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Model Comparison</h3>
        <p className="text-gray-500 text-sm">
          Use at least 2 different models to see comparison stats ({lastTwoModels.length}/2 models used)
        </p>
      </div>
    )
  }

  const [currentModel, previousModel] = lastTwoModels

  const formatContextLength = (length?: number) => {
    if (!length) return 'Unknown'
    if (length >= 1000000) return `${(length / 1000000).toFixed(1)}M`
    if (length >= 1000) return `${(length / 1000).toFixed(0)}K`
    return length.toString()
  }

  const formatCost = (cost?: { inputTokenPrice?: number; outputTokenPrice?: number; tokenPrice?: number }) => {
    if (!cost) return 'Unknown'
    
    if (cost.tokenPrice) {
      return `$${cost.tokenPrice.toFixed(4)}/1M`
    }
    
    if (cost.inputTokenPrice && cost.outputTokenPrice) {
      return `$${cost.inputTokenPrice.toFixed(4)}/$${cost.outputTokenPrice.toFixed(4)}/1M`
    }
    
    if (cost.inputTokenPrice) {
      return `$${cost.inputTokenPrice.toFixed(4)}/1M in`
    }
    
    return 'Unknown'
  }

  const getUniqueTags = (model: FireworksModel) => {
    return model.tags?.filter(tag => tag !== 'LLM') || []
  }

  const compareContextLength = () => {
    if (!previousModel.contextLength || !currentModel.contextLength) return null
    
    const diff = currentModel.contextLength - previousModel.contextLength
    const percentage = ((diff / previousModel.contextLength) * 100).toFixed(1)
    
    if (diff > 0) {
      return { type: 'increase', value: `+${formatContextLength(diff)} (+${percentage}%)` }
    } else if (diff < 0) {
      return { type: 'decrease', value: `${formatContextLength(diff)} (${percentage}%)` }
    }
    return { type: 'same', value: 'Same' }
  }

  const compareCost = () => {
    const prevCost = previousModel.cost?.tokenPrice || previousModel.cost?.inputTokenPrice
    const currCost = currentModel.cost?.tokenPrice || currentModel.cost?.inputTokenPrice
    
    
    if (!prevCost || !currCost) return null
    
    const diff = currCost - prevCost
    const percentage = Math.abs((diff / prevCost) * 100).toFixed(1)
    
    if (Math.abs(diff) < 0.000001) { // Handle very small differences as same
      return { type: 'same', value: 'Same cost' }
    } else if (diff > 0) {
      return { type: 'increase', value: `+${percentage}% more expensive` }
    } else {
      return { type: 'decrease', value: `${percentage}% cheaper` }
    }
  }

  const contextComparison = compareContextLength()
  const costComparison = compareCost()

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
      
      <div className="space-y-3">
        {/* Previous Model */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-medium text-gray-700 text-sm">Previous Model</h5>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Context: {formatContextLength(previousModel.contextLength)}</span>
              <span>•</span>
              <span>Cost: {formatCost(previousModel.cost)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-900 text-sm">{previousModel.name}</span>
            </div>
            {getUniqueTags(previousModel).length > 0 && (
              <div className="flex flex-wrap gap-1">
                {getUniqueTags(previousModel).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Current Model */}
        <div className="bg-[#6720ff]/5 rounded-lg p-3 border border-[#6720ff]/20">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-700 text-sm">Current Model</h4>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Context: {formatContextLength(currentModel.contextLength)}</span>
              <span>•</span>
              <span>Cost: {formatCost(currentModel.cost)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-900 text-sm">{currentModel.name}</span>
            </div>
            {getUniqueTags(currentModel).length > 0 && (
              <div className="flex flex-wrap gap-1">
                {getUniqueTags(currentModel).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-[#6720ff]/10 text-[#6720ff] text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Summary */}
      {(contextComparison || costComparison) && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <h5 className="font-medium text-gray-700 mb-2">Changes</h5>
          <div className="space-y-1 text-sm">
            {contextComparison && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Context Length:</span>
                <span className={`font-medium ${
                  contextComparison.type === 'increase' ? 'text-green-600' :
                  contextComparison.type === 'decrease' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {contextComparison.value}
                </span>
              </div>
            )}
            {costComparison && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Cost:</span>
                <span className={`font-medium ${
                  costComparison.type === 'increase' ? 'text-red-600' :
                  costComparison.type === 'decrease' ? 'text-green-600' :
                  'text-gray-600'
                }`}>
                  {costComparison.value}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}