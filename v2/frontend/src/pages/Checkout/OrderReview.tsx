import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  PageHeader,
  Button,
  CheckoutProgress,
  Alert,
  OrderSummary as OrderSummaryComponent,
  Input,
} from '@/components'
import { useCheckout } from '@/contexts/CheckoutContext'
import { checkoutService } from '@/services/checkoutService'
import { authService } from '@/services/authService'
import './Checkout.css'

export const OrderReview: React.FC = () => {
  const navigate = useNavigate()
  const { state, setPromoCode, setReferralDiscount, getOrderSummary } = useCheckout()

  const [promoCode, setPromoCodeValue] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null)

  const [referralBalance, setReferralBalance] = useState(0)
  const [applyReferral, setApplyReferral] = useState(false)

  // Fetch referral balance if logged in
  useEffect(() => {
    const fetchReferralBalance = async () => {
      const token = authService.getToken()
      if (token) {
        try {
          const response = await checkoutService.getReferralBalance(token)
          if (response.success && response.data) {
            setReferralBalance(response.data.balance)
          }
        } catch (err) {
          // Silently fail - referral is optional
        }
      }
    }

    fetchReferralBalance()
  }, [])

  const handlePromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code')
      return
    }

    try {
      setPromoLoading(true)
      setPromoError(null)
      setPromoSuccess(null)

      const response = await checkoutService.validatePromoCode(promoCode)

      if (response.success && response.data?.valid) {
        const discount = response.data.discountAmount || 0
        setPromoCode(promoCode, discount)
        setPromoSuccess(`Promo code applied! You save ₹${discount}`)
      } else {
        setPromoError(response.data?.message || 'Invalid promo code')
      }
    } catch (err) {
      setPromoError('Failed to validate promo code')
    } finally {
      setPromoLoading(false)
    }
  }

  const handleApplyReferral = () => {
    if (referralBalance > 0) {
      setApplyReferral(true)
      setReferralDiscount(state.referralCode || 'REFERRAL', referralBalance)
    }
  }

  const handleContinue = () => {
    navigate('/checkout/payment')
  }

  const handleBack = () => {
    navigate('/checkout/addons')
  }

  const orderSummary = getOrderSummary() || {
    subtotal: 0,
    tax: 0,
    total: 0,
  }

  return (
    <div className="checkout-page">
      <Container maxWidth="lg">
        {/* Progress Indicator */}
        <CheckoutProgress currentStep={4} totalSteps={5} flowType="subscription" />

        {/* Header */}
        <PageHeader
          title="Review Your Order"
          subtitle="Check everything before payment"
        />

        <div className="checkout-review-layout">
          <div className="checkout-review-main">
            {/* Plan Details */}
            <div className="checkout-review-section">
              <h3 className="checkout-review-section__title">📦 Subscription</h3>
              {state.selectedPlan && (
                <div className="review-item">
                  <p className="review-item__label">{state.selectedPlan.name}</p>
                  <p className="review-item__subtext">
                    {state.selectedDeliveryDays.length} days/week
                  </p>
                  <p className="review-item__price">₹{state.selectedPlan.price}/month</p>
                </div>
              )}
            </div>

            {/* Add-ons */}
            {state.selectedAddOns.length > 0 && (
              <div className="checkout-review-section">
                <h3 className="checkout-review-section__title">🌸 Add-ons</h3>
                {state.selectedAddOns.map((addon: any) => (
                  <div key={addon.id} className="review-item">
                    <p className="review-item__label">Add-on x{addon.quantity}</p>
                    <p className="review-item__price">₹{(addon.price * addon.quantity).toFixed(0)}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Promo Code */}
            <div className="checkout-review-section">
              <h3 className="checkout-review-section__title">🎁 Promo Code</h3>
              <div className="promo-code-input">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCodeValue(e.target.value)}
                  disabled={promoLoading || !!state.promoCode}
                />
                <Button
                  variant="secondary"
                  onClick={handlePromoCode}
                  isLoading={promoLoading}
                  disabled={promoLoading || !!state.promoCode}
                >
                  Apply
                </Button>
              </div>
              {promoError && <Alert type="error" message={promoError} dismissible={true} />}
              {promoSuccess && <Alert type="success" message={promoSuccess} dismissible={true} />}
              {state.promoCode && (
                <p className="promo-applied">✓ Promo code {state.promoCode} applied</p>
              )}
            </div>

            {/* Referral */}
            {authService.isLoggedIn() && referralBalance > 0 && !applyReferral && (
              <div className="checkout-review-section">
                <h3 className="checkout-review-section__title">👥 Referral Balance</h3>
                <p className="referral-balance">You have ₹{referralBalance} referral balance</p>
                <Button variant="secondary" onClick={handleApplyReferral} size="sm">
                  Apply Balance
                </Button>
              </div>
            )}

            {applyReferral && (
              <Alert type="success" message="Referral balance applied!" dismissible={false} />
            )}
          </div>

          {/* Summary Sidebar */}
          <div>
            <OrderSummaryComponent summary={orderSummary} readonly={true} />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="checkout-nav-buttons">
          <Button variant="secondary" onClick={handleBack}>
            ← Back
          </Button>
          <Button variant="primary" size="lg" onClick={handleContinue}>
            Proceed to Payment →
          </Button>
        </div>
      </Container>
    </div>
  )
}
