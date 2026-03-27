import React from 'react'
import './ProgressIndicator.css'

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  stepLabels: string[]
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
}) => {
  return (
    <div className="progress-indicator">
      {/* Progress bar */}
      <div className="progress-bar">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="progress-bar__segment-wrapper">
            <div
              className={`progress-bar__segment ${
                index < currentStep
                  ? 'progress-bar__segment--completed'
                  : index === currentStep
                  ? 'progress-bar__segment--active'
                  : 'progress-bar__segment--pending'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Step labels */}
      <div className="progress-labels">
        {stepLabels.map((label, index) => (
          <span
            key={index}
            className={`progress-label ${
              index < currentStep
                ? 'progress-label--completed'
                : index === currentStep
                ? 'progress-label--active'
                : 'progress-label--pending'
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Step counter */}
      <div className="progress-counter">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  )
}
