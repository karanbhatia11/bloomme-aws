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
  Tabs,
  PageHeader,
} from '@/components'
import { postAPI } from '@/lib/api'
import { authService } from '@/services/authService'
import '../Checkout/Checkout.css'

interface OrderData {
  addOns: Array<{ id: string; name: string; quantity: number; price: number; totalPrice: number }>
  dates: number[]
  subtotal: number
  tax: number
  promoCode?: string
  promoDiscount: number
  referralDiscount: number
  total: number
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export const AddOnsPayment: React.FC = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string>('')
  const [orderData, setOrderData] = useState<any>(null)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [razorpayOrderId, setRazorpayOrderId] = useState<string>('')

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

  // Load order data
  useEffect(() => {
    loadOrderData()
  }, [])

  const loadOrderData = async () => {
    try {
      const orderJson = sessionStorage.getItem('addonsCheckoutOrder')
      if (!orderJson) {
        navigate('/addons/review')
        return
      }

      const order = JSON.parse(orderJson)
      setOrderData(order)

      // Create Razorpay order
      await createRazorpayOrder(order)
    } catch (err) {
      setError('Failed to load order data')
      console.error(err)
      setLoading(false)
    }
  }

  const createRazorpayOrder = async (data: OrderData) => {
    try {
      const token = authService.getToken()

      const response = await postAPI<{ razorpayOrderId: string }>(
        '/api/addons/create',
        {
          addOns: data.addOns.map((a) => ({
            id: a.id,
            quantity: a.quantity,
          })),
          dates: data.dates,
          subtotal: data.subtotal,
          tax: data.tax,
          promoCode: data.promoCode,
          promoDiscount: data.promoDiscount,
          referralDiscount: data.referralDiscount,
          total: data.total,
        },
        token || ''
      )

      if (response.success && response.data?.razorpayOrderId) {
        setRazorpayOrderId(response.data.razorpayOrderId)
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

    if (!razorpayOrderId) {
      setError('Order not created. Please refresh and try again.')
      return
    }

    if (!orderData || orderData.total <= 0) {
      setError('Invalid order amount')
      return
    }

    setProcessing(true)
    setError('')

    try {
      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID

      const options = {
        key: keyId || 'rzp_test_SVnAcBxaftra4r',
        amount: Math.round(orderData.total * 100),
        currency: 'INR',
        order_id: razorpayOrderId,
        name: 'Bloomme',
        description: `Add-ons Order - ${orderData.dates.length} days`,
        handler: async (response: any) => {
          await verifyPayment(response)
        },
        prefill: {
          email: authService.getUser()?.email || '',
          contact: authService.getUser()?.phone || '',
        },
        notes: {
          orderType: 'addons',
          datesCount: orderData.dates.length,
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

      const response = await postAPI<{ orderId: string }>(
        '/api/payments/verify',
        {
          razorpayOrderId: paymentResponse.razorpay_order_id,
          razorpayPaymentId: paymentResponse.razorpay_payment_id,
          razorpaySignature: paymentResponse.razorpay_signature,
        },
        token || ''
      )

      if (response.success && response.data?.orderId) {
        navigate(`/addons/confirmation/${response.data.orderId}`)
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
        <CheckoutProgress currentStep={4} totalSteps={4} flowType="addons" />

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
                {/* Add-ons */}
                <div className="flex justify-between items-center pb-3 border-b border-neutral-light-gray">
                  <div>
                    <p className="font-semibold text-primary-brown">Add-ons ({orderData.addOns.length})</p>
                    <p className="text-xs text-neutral-dark-gray">
                      {orderData.dates.length} delivery days
                    </p>
                  </div>
                  <PriceDisplay amount={orderData.subtotal} />
                </div>

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
          <Button variant="ghost" onClick={() => navigate('/addons/review')}>
            ← Back to Review
          </Button>
        </div>
      </Container>
    </div>
  )
}
