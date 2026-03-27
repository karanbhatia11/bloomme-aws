import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  PageHeader,
  PlanCard,
  LoadingSpinner,
  Alert,
  CheckoutProgress,
} from '@/components'
import { useCheckout } from '@/contexts/CheckoutContext'
import { AuthModal } from '@/components/auth/AuthModal'
import { checkoutService } from '@/services/checkoutService'
import type { SubscriptionPlan } from '@/lib/types'
import './Checkout.css'

export const PlanSelection: React.FC = () => {
  const navigate = useNavigate()
  const { state, setPlan, setAuthMode } = useCheckout()

  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Fetch plans on mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true)
        const response = await checkoutService.getPlans()
        if (response.success && response.data) {
          setPlans(response.data)
        } else {
          setError('Failed to load plans. Please try again.')
        }
      } catch (err) {
        setError('Failed to load plans. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setPlan(plan)
    setShowAuthModal(true)
  }

  const handleAuthSuccess = (isGuest: boolean, email?: string, phone?: string, token?: string) => {
    setAuthMode(isGuest, email, phone, token)
    setShowAuthModal(false)
    // Navigate to next step
    navigate('/checkout/delivery')
  }

  const handleContinueAsGuest = () => {
    setAuthMode(true)
    setShowAuthModal(false)
    navigate('/checkout/delivery')
  }

  if (loading) {
    return (
      <Container>
        <LoadingSpinner fullScreen={true} text="Loading plans..." />
      </Container>
    )
  }

  return (
    <div className="checkout-page">
      <Container maxWidth="lg">
        {/* Progress Indicator */}
        <CheckoutProgress currentStep={1} totalSteps={5} flowType="subscription" />

        {/* Header */}
        <PageHeader
          title="Select Your Plan"
          subtitle="Choose the perfect plan for your daily puja flowers"
        />

        {/* Error Alert */}
        {error && (
          <Alert type="error" message={error} dismissible={true} onDismiss={() => setError(null)} />
        )}

        {/* Plans Grid */}
        <div className="plans-grid">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={state.selectedPlan?.id === plan.id}
              onSelect={() => handlePlanSelect(plan)}
              highlighted={plan.id === 'divine'}
              pricePerDay={plan.price / 30}
            />
          ))}
        </div>

        {/* Help Text */}
        <div className="checkout-help-text">
          <p>All plans include daily delivery between 5:30 AM - 7:30 AM</p>
        </div>
      </Container>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onSuccess={handleAuthSuccess}
          onClose={() => setShowAuthModal(false)}
          planName={state.selectedPlan?.name || 'Your Plan'}
          onContinueAsGuest={handleContinueAsGuest}
        />
      )}
    </div>
  )
}
