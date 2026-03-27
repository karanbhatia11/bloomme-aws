import React from 'react'
import './Stepper.css'

interface Step {
  id: string
  title: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (step: number) => void
  orientation?: 'horizontal' | 'vertical'
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
}) => {
  return (
    <div className={`stepper stepper--${orientation}`}>
      {steps.map((step, index) => (
        <div key={step.id} className="stepper__step">
          {/* Step Circle */}
          <button
            onClick={() => onStepClick?.(index)}
            disabled={!onStepClick}
            className={`stepper__circle ${
              index < currentStep
                ? 'stepper__circle--completed'
                : index === currentStep
                ? 'stepper__circle--active'
                : 'stepper__circle--pending'
            }`}
          >
            {index < currentStep ? '✓' : index + 1}
          </button>

          {/* Step Info */}
          <div className="stepper__info">
            <h4 className="stepper__title">{step.title}</h4>
            {step.description && (
              <p className="stepper__description">{step.description}</p>
            )}
          </div>

          {/* Connector */}
          {index < steps.length - 1 && (
            <div
              className={`stepper__connector ${
                index < currentStep ? 'stepper__connector--completed' : ''
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
