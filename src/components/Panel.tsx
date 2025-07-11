import { NetworkStats } from './NetworkStats'
import { ModelSelector } from './ModelSelector'
import { CompareModelsStats } from './CompareModelsStats'
import { useFireworksContext } from '../contexts/FireworksContext'

export const Panel = () => {
  const { lastTwoUsedModels } = useFireworksContext()
    
  return (
    <div className="w-[21.25rem] bg-white border-l border-gray-200 flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <ModelSelector />

          <NetworkStats />

          <CompareModelsStats lastTwoModels={lastTwoUsedModels} />
        </div>
      </div>
    </div>
  )
}