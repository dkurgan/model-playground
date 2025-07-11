import { useState, useEffect, useRef } from 'react'
import { useFireworksContext } from '../contexts/FireworksContext'
import { useChatContext } from '../contexts/ChatContext'

export const ModelSelector = () => {
  const { models, selectedModel, handleModelChange, modelsLoading } = useFireworksContext()
  const { cancelCurrentRequest } = useChatContext()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedModelData = models.find(model => model.id === selectedModel)

  const handleModelSelect = (modelId: string) => {
    // Cancel any ongoing request when model changes
    cancelCurrentRequest()
    handleModelChange(modelId)
    setIsDropdownOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <div>
      <h5 className="text-lg font-medium text-gray-900 mb-4">Model Selection</h5>
      <div className="relative" ref={dropdownRef}>
        {modelsLoading ? (
          <div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed">
            Loading models...
          </div>
        ) : models.length === 0 ? (
          <div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed">
            No models available
          </div>
        ) : (
          <>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6720ff] focus:border-[#6720ff] focus:outline-none bg-white text-gray-700 cursor-pointer hover:border-gray-300 transition-colors text-left flex items-center justify-between"
            >
              <span>{selectedModelData?.name || 'Select a model'}</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {models
                  .filter(model => model && model.id && model.name)
                  .map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleModelSelect(model.id)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                    >
                      <span className="text-gray-700">{String(model.name)}</span>
                    </button>
                  ))
                }
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}