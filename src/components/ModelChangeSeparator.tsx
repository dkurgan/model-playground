interface ModelChangeSeparatorProps {
  previousModel: string
  currentModel: string
}

export const ModelChangeSeparator = ({ previousModel, currentModel }: ModelChangeSeparatorProps) => {
  return (
    <div className="flex items-center justify-center my-6">
      <div className="flex-1 border-t border-gray-300"></div>
      <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 mx-4">
        <div className="text-center text-sm text-gray-600">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-red-500 font-medium">{previousModel}</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </div>
          <div className="text-xs text-gray-500 mb-1">model has changed</div>
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
            <span className="text-blue-500 font-medium">{currentModel}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 border-t border-gray-300"></div>
    </div>
  )
}