import React from 'react'
import { ProgressIndicator } from './ProgressIndicator'
import { Stepper } from './Stepper'
import './CheckoutProgress.css'

interface CheckoutProgressProps {
  currentStep: number
  totalSteps: number
  flowType: 'subscription' | 'addons'
  onStepClick?: (step: number) => void
}

const SUBSCRIPTION_STEPS = [
  { id: 'plan', title: 'Select Plan' },
  { id: 'delivery', title: 'Delivery Days' },
  { id: 'addons', title: 'Add-ons' },
  { id: 'review', title: 'Review' },
  { id: 'payment', title: 'Payment' },
]

const ADDONS_STEPS = [
  { id: 'addons', title: 'Select Add-ons' },
  { id: 'dates', title: 'Delivery Dates' },
  { id: 'review', title: 'Review' },
  { id: 'payment', title: 'Payment' },
]

export const CheckoutProgress: React.FC<CheckoutProgressProps> = ({
  currentStep,
  totalSteps,
  flowType,
  onStepClick,
}) => {
  const steps = flowType === 'subscription' ? SUBSCRIPTION_STEPS : ADDONS_STEPS

  return (
    <div className="checkout-progress">
      {/* Progress Bar */}
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={totalSteps}
        stepLabels={steps.map(s => s.title)}
      />

      {/* Steps with descriptions (hidden on mobile) */}
      <div className="checkout-progress__details">
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={onStepClick}
        />
      </div>
    </div>
  )
}
