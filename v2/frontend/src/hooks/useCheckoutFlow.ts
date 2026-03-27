import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export type CheckoutStep = 'plans' | 'delivery' | 'addons' | 'review' | 'payment' | 'confirmation'

export interface CheckoutFlowOptions {
  onStepChange?: (step: CheckoutStep) => void
  onComplete?: () => void
}

/**
 * Hook for managing checkout flow navigation
 */
export const useCheckoutFlow = (options?: CheckoutFlowOptions) => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('plans')
  const [isLoading, setIsLoading] = useState(false)

  const stepOrder: CheckoutStep[] = ['plans', 'delivery', 'addons', 'review', 'payment', 'confirmation']

  const goToStep = useCallback(
    (step: CheckoutStep) => {
      setCurrentStep(step)
      options?.onStepChange?.(step)

      const stepIndex = stepOrder.indexOf(step)
      if (stepIndex !== -1) {
        navigate(`/checkout/${step}`)
      }
    },
    [navigate, options]
  )

  const goToNextStep = useCallback(() => {
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      const nextStep = stepOrder[currentIndex + 1]
      goToStep(nextStep)
    }
  }, [currentStep, goToStep, stepOrder])

  const goToPreviousStep = useCallback(() => {
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      const previousStep = stepOrder[currentIndex - 1]
      goToStep(previousStep)
    }
  }, [currentStep, goToStep, stepOrder])

  const canGoNext = useCallback((): boolean => {
    const currentIndex = stepOrder.indexOf(currentStep)
    return currentIndex < stepOrder.length - 1
  }, [currentStep, stepOrder])

  const canGoPrevious = useCallback((): boolean => {
    const currentIndex = stepOrder.indexOf(currentStep)
    return currentIndex > 0
  }, [currentStep, stepOrder])

  const getStepNumber = useCallback(
    (step?: CheckoutStep): number => {
      const targetStep = step || currentStep
      return stepOrder.indexOf(targetStep) + 1
    },
    [currentStep, stepOrder]
  )

  const getTotalSteps = useCallback((): number => {
    return stepOrder.length
  }, [stepOrder])

  const isFirstStep = useCallback((): boolean => {
    return currentStep === stepOrder[0]
  }, [currentStep, stepOrder])

  const isLastStep = useCallback((): boolean => {
    return currentStep === stepOrder[stepOrder.length - 1]
  }, [currentStep, stepOrder])

  const complete = useCallback(() => {
    setIsLoading(true)
    try {
      options?.onComplete?.()
      navigate('/')
    } finally {
      setIsLoading(false)
    }
  }, [navigate, options])

  return {
    currentStep,
    isLoading,
    setIsLoading,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    canGoNext,
    canGoPrevious,
    getStepNumber,
    getTotalSteps,
    isFirstStep,
    isLastStep,
    complete,
  }
}
