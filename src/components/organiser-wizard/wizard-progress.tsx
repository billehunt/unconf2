interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function WizardProgress({ currentStep, totalSteps }: WizardProgressProps) {
  const steps = [
    { number: 1, title: 'Event Details', description: 'Basic event information' },
    { number: 2, title: 'Rooms', description: 'Add venues and capacity' },
    { number: 3, title: 'Time Blocks', description: 'Set session time slots' },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          
          return (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                    ${isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? '✓' : step.number}
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {step.description}
                  </div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700 mx-4" />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
} 