import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Button,
  CheckoutProgress,
  Card,
  PriceDisplay,
  Alert,
  Input,
  PageHeader,
  LoadingSpinner,
} from '@/components'
import { postAPI, getAPI } from '@/lib/api'

interface OrderData {
  addOns: Array<{
    id: string
    name: string
    quantity: number
    price: number
    totalPrice: number
  }>
  dates: number[]
  subtotal: number
  tax: number
  promoCode?: string
  promoDiscount: number
  referralDiscount: number
  total: number
}

export const AddOnsReview: React.FC = () => {
  const navigate = useNavigate()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [promoCode, setPromoCode] = useState<string>('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoValid, setPromoValid] = useState(false)
  const [referralBalance, setReferralBalance] = useState(0)
  const [useReferral, setUseReferral] = useState(false)
  const [referralDiscount, setReferralDiscount] = useState(0)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [promoLoading, setPromoLoading] = useState(false)

  useEffect(() => {
    loadOrderData()
  }, [])

  const loadOrderData = async () => {
    try {
      const addOnsJson = sessionStorage.getItem('addonsCheckoutAddOns')
      const datesJson = sessionStorage.getItem('addonsCheckoutDates')

      if (!addOnsJson || !datesJson) {
        navigate('/addons/select')
        return
      }

      const addOns = JSON.parse(addOnsJson)
      const dates = JSON.parse(datesJson)

      const subtotal = addOns.reduce((sum: number, ao: any) => sum + ao.totalPrice, 0) * dates.length
      const tax = subtotal * 0.05
      const total = subtotal + tax

      setOrderData({
        addOns,
        dates,
        subtotal,
        tax,
        promoDiscount: 0,
        referralDiscount: 0,
        total,
      })

      // Load referral balance
      const token = sessionStorage.getItem('authToken')
      if (token) {
        const response = await getAPI<{ balance: number }>('/api/user/referral', token)
        if (response.success && response.data && response.data.balance) {
          setReferralBalance(response.data.balance)
        }
      }
    } catch (err) {
      setError('Failed to load order data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePromoCode = async () => {
    if (!promoCode.trim() || !orderData) {
      setError('Enter a promo code')
      return
    }

    setPromoLoading(true)
    setError('')

    try {
      const response = await postAPI<{ valid: boolean; discount: number }>(
        '/api/promo/validate',
        {
          code: promoCode,
          subtotal: orderData.subtotal,
        }
      )

      if (response.success && response.data?.valid) {
        const discount = response.data.discount
        setPromoDiscount(discount)
        setPromoValid(true)

        // Update order total
        const newTotal = orderData.subtotal - discount - referralDiscount + orderData.tax
        setOrderData({
          ...orderData,
          promoCode,
          promoDiscount: discount,
          total: newTotal,
        })
      } else {
        setError('Invalid promo code')
        setPromoValid(false)
      }
    } catch (err) {
      setError('Could not validate promo code')
      setPromoValid(false)
    } finally {
      setPromoLoading(false)
    }
  }

  const handleReferralToggle = () => {
    if (!orderData) return

    if (useReferral) {
      setUseReferral(false)
      setReferralDiscount(0)
    } else {
      const discount = Math.min(referralBalance, orderData.subtotal)
      setUseReferral(true)
      setReferralDiscount(discount)
    }

    // Recalculate total
    const discount = useReferral ? 0 : Math.min(referralBalance, orderData.subtotal)
    const newTotal = orderData.subtotal - promoDiscount - discount + orderData.tax
    setOrderData({
      ...orderData,
      referralDiscount: discount,
      total: newTotal,
    })
  }

  const handleContinuePayment = () => {
    if (!orderData) return

    // Store final order data
    sessionStorage.setItem('addonsCheckoutOrder', JSON.stringify(orderData))

    navigate('/addons/payment')
  }

  if (loading || !orderData) {
    return (
      <Container>
        <div className="py-20">
          <LoadingSpinner size="lg" text="Loading order details..." />
        </div>
      </Container>
    )
  }

  return (
    <div className="checkout-page">
      <Container maxWidth="lg">
        {/* Progress */}
        <CheckoutProgress currentStep={3} totalSteps={4} flowType="addons" />

        {/* Header */}
        <PageHeader
          title="Review Your Order"
          subtitle="Confirm your add-ons and delivery dates before payment"
        />

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Alerts */}
            {error && (
              <Alert
                type="error"
                message={error}
                onDismiss={() => setError('')}
              />
            )}

            {/* Add-ons Details */}
            <Card>
              <h3 className="font-display text-xl text-primary-brown mb-4">
                🌸 Add-ons
              </h3>
              <div className="space-y-2">
                {orderData.addOns.map((ao) => (
                  <div
                    key={ao.id}
                    className="flex justify-between items-center pb-2 border-b border-neutral-light-gray"
                  >
                    <div>
                      <p className="font-semibold text-primary-brown">{ao.name}</p>
                      <p className="text-xs text-neutral-dark-gray">Qty: {ao.quantity}</p>
                    </div>
                    <PriceDisplay amount={ao.totalPrice} />
                  </div>
                ))}
              </div>
            </Card>

            {/* Delivery Dates */}
            <Card>
              <h3 className="font-display text-xl text-primary-brown mb-4">
                📅 Delivery Dates
              </h3>
              <div className="text-sm">
                <p className="text-neutral-dark-gray mb-3">
                  Your add-ons will be delivered on:
                </p>
                <div className="flex flex-wrap gap-2">
                  {orderData.dates.map((date) => (
                    <span
                      key={date}
                      className="bg-primary-gold bg-opacity-20 text-primary-brown px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      Day {date}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Promo Code */}
            <Card>
              <h3 className="font-display text-lg text-primary-brown mb-4">
                Have a Promo Code?
              </h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase())
                    setError('')
                  }}
                  disabled={promoValid || promoLoading}
                />
                <Button
                  variant="secondary"
                  onClick={handlePromoCode}
                  disabled={promoValid || promoLoading || !promoCode.trim()}
                  isLoading={promoLoading}
                >
                  Apply
                </Button>
              </div>
              {promoValid && (
                <p className="mt-2 text-sm text-semantic-success">
                  ✓ Promo code applied
                </p>
              )}
            </Card>

            {/* Referral Balance */}
            {referralBalance > 0 && (
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-primary-brown">
                      Use Referral Balance
                    </h4>
                    <p className="text-sm text-neutral-dark-gray">
                      Balance: ₹{referralBalance.toFixed(0)}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={useReferral}
                    onChange={handleReferralToggle}
                    className="w-5 h-5 accent-primary-gold cursor-pointer"
                  />
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white rounded-lg p-6 border border-neutral-light-gray h-fit sticky top-4">
            <h3 className="font-display text-xl text-primary-brown mb-4">
              Order Total
            </h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-dark-gray">Subtotal</span>
                <PriceDisplay amount={orderData.subtotal} />
              </div>

              {promoDiscount > 0 && (
                <div className="flex justify-between items-center text-semantic-success">
                  <span>Promo Discount</span>
                  <span className="font-semibold">-₹{promoDiscount.toFixed(0)}</span>
                </div>
              )}

              {referralDiscount > 0 && (
                <div className="flex justify-between items-center text-semantic-success">
                  <span>Referral Discount</span>
                  <span className="font-semibold">-₹{referralDiscount.toFixed(0)}</span>
                </div>
              )}

              <div className="flex justify-between items-center pb-3 border-b border-neutral-light-gray">
                <span className="text-neutral-dark-gray">Tax (5%)</span>
                <PriceDisplay amount={orderData.tax} />
              </div>

              <div className="flex justify-between items-center">
                <span className="font-display text-lg text-primary-brown">Total</span>
                <PriceDisplay amount={orderData.total} size="lg" />
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleContinuePayment}
              className="w-full"
            >
              Proceed to Payment
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="checkout-nav-buttons">
          <Button variant="ghost" onClick={() => navigate('/addons/delivery')}>
            ← Back
          </Button>
        </div>
      </Container>
    </div>
  )
}
