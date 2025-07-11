interface ErrorMessageProps {
  error: string
}

export const ErrorMessage = ({ error }: ErrorMessageProps) => {
  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex-shrink-0">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-red-700">{error}</span>
      </div>
    </div>
  )
}