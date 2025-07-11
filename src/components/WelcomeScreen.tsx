import fireworksIcon from '/fireworks.svg'

export const WelcomeScreen = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center mb-8">
          <div className="w-6 h-6 mr-4">
            <img src={fireworksIcon} alt="Fireworks" className="w-full h-full" />
          </div>
          <h1 className="text-3xl font-normal text-gray-800">Welcome to Model Playground</h1>
        </div>
      </div>
    </div>
  )
}