import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Button,
  CheckoutProgress,
  LoadingSpinner,
  Alert,
  Card,
  PriceDisplay,
  PageHeader,
  Tabs,
} from '@/components'
import { useCheckout } from '@/contexts/CheckoutContext'
import { checkoutService } from '@/services/checkoutService'
import { authService } from '@/services/authService'
import emailService from '@/services/emailService'
import './Checkout.css'

declare global {
  interface Window {
    Razorpay: any
  }
}

export const Payment: React.FC = () => {
  const navigate = useNavigate()
  const { state, getOrderSummary } = useCheckout()

  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string>('')
  const [orderData, setOrderData] = useState<any>(null)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  // Check if Razorpay script is loaded
  useEffect(() => {
    const checkRazorpay = () => {
      if (window.Razorpay) {
        setRazorpayLoaded(true)
      } else {
        setTimeout(checkRazorpay, 100)
      }
    }
    checkRazorpay()
  }, [])

  // Load order data and create Razorpay order
  useEffect(() => {
    loadOrderData()
  }, [])

  const loadOrderData = async () => {
    try {
      // Validate checkout state
      if (!state.selectedPlan) {
        navigate('/checkout/plan')
        return
      }

      if (state.selectedDeliveryDays.length === 0) {
        navigate('/checkout/delivery')
        return
      }

      // Get order summary
      const summary = getOrderSummary()
      if (!summary) {
        setError('Failed to load order data')
        setLoading(false)
        return
      }

      setOrderData(summary)

      // Create Razorpay order
      await createRazorpayOrder(summary)
    } catch (err) {
      setError('Failed to load order data')
      console.error(err)
      setLoading(false)
    }
  }

  const createRazorpayOrder = async (data: any) => {
    try {
      const token = authService.getToken()

      const response = await checkoutService.createOrder(
        {
          planId: data.plan.id,
          deliveryDays: data.deliveryDays,
          addOns: data.addOns.map((a: any) => ({
            id: a.id,
            quantity: a.quantity,
          })),
          promoCode: data.promoCode,
        },
        token || ''
      )

      if (response.success && response.data) {
        setOrderData((prev: any) => ({
          ...prev,
          razorpayOrderId: response.data?.razorpayOrderId,
        }))
        setLoading(false)
      } else {
        setError(response.error?.message || 'Could not create order')
        setLoading(false)
      }
    } catch (err) {
      setError('Failed to create order. Please try again.')
      console.error(err)
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      setError('Payment system is loading. Please wait...')
      return
    }

    if (!orderData?.razorpayOrderId) {
      setError('Order not created. Please refresh and try again.')
      return
    }

    if (orderData.total <= 0) {
      setError('Invalid order amount')
      return
    }

    setProcessing(true)
    setError('')

    try {
      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID

      const options = {
        key: keyId || 'rzp_test_SVnAcBxaftra4r',
        amount: Math.round(orderData.total * 100), // Convert to paise
        currency: 'INR',
        order_id: orderData.razorpayOrderId,
        name: 'Bloomme',
        description: `${orderData.plan.name} Subscription`,
        handler: async (response: any) => {
          await verifyPayment(response)
        },
        prefill: {
          email: authService.getUser()?.email || '',
          contact: authService.getUser()?.phone || '',
        },
        notes: {
          planId: orderData.plan.id,
          deliveryDays: orderData.deliveryDays.join(','),
        },
        theme: {
          color: '#C4A052',
        },
        modal: {
          ondismiss: () => {
            setProcessing(false)
            setError('Payment cancelled')
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (err) {
      setError('Failed to open payment. Please try again.')
      setProcessing(false)
      console.error(err)
    }
  }

  const verifyPayment = async (paymentResponse: any) => {
    try {
      const token = authService.getToken()

      const response = await checkoutService.verifyPayment(
        {
          orderId: orderData.razorpayOrderId,
          razorpayOrderId: paymentResponse.razorpay_order_id,
          razorpayPaymentId: paymentResponse.razorpay_payment_id,
          razorpaySignature: paymentResponse.razorpay_signature,
        },
        token || ''
      )

      if (response.success && response.data?.orderId) {
        // Payment successful - trigger order confirmation email
        const user = authService.getUser()
        if (user?.email) {
          const orderEmailData = {
            id: response.data.orderId,
            plan: orderData.plan,
            deliveryDays: orderData.deliveryDays,
            addOns: orderData.addOns,
            subscriptionSubtotal: orderData.subscriptionSubtotal,
            tax: orderData.tax,
            total: orderData.total,
            status: 'confirmed',
            orderDate: new Date().toISOString(),
          }

          // Send order confirmation email in background (non-blocking)
          emailService
            .sendOrderConfirmation(user.email, orderEmailData)
            .then((result) => {
              if (result.success) {
                console.log('✅ Order confirmation email sent with PDF invoice to:', user.email)
              } else {
                console.warn('⚠️ Order confirmation email failed:', result.error)
              }
            })
            .catch((err) => {
              console.error('❌ Email service error:', err)
              // Don't throw - email failure shouldn't affect order confirmation
            })
        }

        navigate(`/checkout/confirmation/${response.data.orderId}`)
      } else {
        setError('Payment verification failed. Please contact support.')
        setProcessing(false)
      }
    } catch (err) {
      setError('Payment verification failed. Please contact support.')
      setProcessing(false)
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-off-white to-neutral-cream flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading payment details..." />
      </div>
    )
  }

  if (!orderData) {
    return (
      <Container>
        <Alert
          type="error"
          message="Failed to load payment details. Please go back and try again."
          dismissible={false}
        />
      </Container>
    )
  }

  return (
    <div className="checkout-page">
      <Container maxWidth="lg">
        {/* Progress */}
        <CheckoutProgress currentStep={5} totalSteps={5} flowType="subscription" />

        {/* Header */}
        <PageHeader
          title="Complete Payment"
          subtitle="Secure payment powered by Razorpay"
        />

        {/* Error Alert */}
        {error && (
          <Alert
            type="error"
            message={error}
            dismissible={true}
            onDismiss={() => setError('')}
          />
        )}

        {/* Main Content */}
        <div className="checkout-review-layout">
          {/* Payment Info */}
          <div className="checkout-review-main">
            {/* Security Badge */}
            <Card>
              <div className="flex items-center gap-3">
                <span className="text-4xl">🔒</span>
                <div>
                  <h4 className="font-semibold text-primary-brown text-lg">
                    Secure Payment
                  </h4>
                  <p className="text-sm text-neutral-dark-gray">
                    Your payment is encrypted and secure with Razorpay
                  </p>
                </div>
              </div>
            </Card>

            {/* Payment Methods */}
            <Card>
              <h3 className="text-xl font-semibold text-primary-brown mb-4">
                Payment Methods
              </h3>
              <Tabs
                tabs={[
                  {
                    id: 'card',
                    label: '💳 Card',
                    content: (
                      <div className="text-sm text-neutral-dark-gray">
                        <p>Credit Card, Debit Card, or ATM Card</p>
                        <p className="text-xs mt-2">International & domestic cards accepted</p>
                      </div>
                    ),
                  },
                  {
                    id: 'upi',
                    label: '📱 UPI',
                    content: (
                      <div className="text-sm text-neutral-dark-gray">
                        <p>Google Pay, PhonePe, BHIM, or any UPI app</p>
                        <p className="text-xs mt-2">Instant payment to your bank account</p>
                      </div>
                    ),
                  },
                  {
                    id: 'netbanking',
                    label: '🏦 Net Banking',
                    content: (
                      <div className="text-sm text-neutral-dark-gray">
                        <p>All major banks supported</p>
                        <p className="text-xs mt-2">Safe and secure bank transfer</p>
                      </div>
                    ),
                  },
                ]}
                variant="pill"
              />
            </Card>

            {/* Order Details */}
            <Card>
              <h3 className="text-xl font-semibold text-primary-brown mb-4">
                Order Details
              </h3>
              <div className="space-y-3 text-sm">
                {/* Plan */}
                <div className="flex justify-between items-center pb-3 border-b border-neutral-light-gray">
                  <div>
                    <p className="font-semibold text-primary-brown">{orderData.plan.name}</p>
                    <p className="text-xs text-neutral-dark-gray">
                      {orderData.deliveryDays.length} days/month
                    </p>
                  </div>
                  <PriceDisplay amount={orderData.subscriptionSubtotal} />
                </div>

                {/* Add-ons */}
                {orderData.addOns.length > 0 && (
                  <div className="pb-3 border-b border-neutral-light-gray">
                    <p className="font-semibold text-primary-brown mb-2">Add-ons</p>
                    {orderData.addOns.map((ao: any) => (
                      <div key={ao.id} className="flex justify-between text-xs mb-1">
                        <span className="text-neutral-dark-gray">
                          {ao.name} x {ao.quantity}
                        </span>
                        <span>₹{(ao.totalPrice).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subtotal */}
                <div className="flex justify-between items-center pb-3 border-b border-neutral-light-gray">
                  <span className="text-neutral-dark-gray">Subtotal</span>
                  <PriceDisplay amount={orderData.subtotal} />
                </div>

                {/* Discounts */}
                {orderData.promoDiscount > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-light-gray text-semantic-success">
                    <span>Promo: {orderData.promoCode}</span>
                    <span className="font-semibold">
                      -₹{orderData.promoDiscount.toFixed(0)}
                    </span>
                  </div>
                )}

                {orderData.referralDiscount > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-light-gray text-semantic-success">
                    <span>Referral Discount</span>
                    <span className="font-semibold">
                      -₹{orderData.referralDiscount.toFixed(0)}
                    </span>
                  </div>
                )}

                {/* Tax */}
                <div className="flex justify-between items-center pb-3 border-b border-neutral-light-gray">
                  <span className="text-neutral-dark-gray">Tax (5% GST)</span>
                  <PriceDisplay amount={orderData.tax} />
                </div>
              </div>
            </Card>

            {/* Payment Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={handlePayment}
              isLoading={processing}
              disabled={!razorpayLoaded || processing}
              className="w-full text-lg py-4"
            >
              {processing ? 'Processing...' : `Pay ₹${orderData.total.toFixed(0)}`}
            </Button>

            {/* Razorpay Info */}
            <div className="text-xs text-neutral-dark-gray text-center">
              <p>Secured by</p>
              <p className="font-semibold text-primary-brown">Razorpay Payment Gateway</p>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div>
            <Card className="sticky top-4">
              <h3 className="text-xl font-semibold text-primary-brown mb-4">
                Amount to Pay
              </h3>

              <div className="mb-4 pb-4 border-b border-neutral-light-gray">
                <div className="text-sm mb-2">
                  <span className="text-neutral-dark-gray">Base Amount</span>
                </div>
                <PriceDisplay amount={orderData.subtotal} size="lg" />
              </div>

              {orderData.promoDiscount > 0 || orderData.referralDiscount > 0 ? (
                <div className="mb-4 pb-4 border-b border-neutral-light-gray">
                  <div className="text-sm text-semantic-success font-semibold">
                    Discounts: -₹
                    {(orderData.promoDiscount + orderData.referralDiscount).toFixed(0)}
                  </div>
                </div>
              ) : null}

              <div className="mb-6">
                <div className="text-xs text-neutral-dark-gray mb-2">
                  Total Amount Due
                </div>
                <div className="text-3xl font-bold text-primary-gold">
                  ₹{orderData.total.toFixed(0)}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-primary-gold bg-opacity-10 p-3 rounded-lg text-xs text-primary-brown">
                <p className="font-semibold mb-1">💡 Tip:</p>
                <p>Use UPI for instant confirmation. It's fast and secure!</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Back Button */}
        <div className="checkout-nav-buttons mt-8">
          <Button variant="ghost" onClick={() => navigate('/checkout/review')}>
            ← Back to Review
          </Button>
        </div>
      </Container>
    </div>
  )
}
