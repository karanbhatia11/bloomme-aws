import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Container,
  Button,
  CheckoutProgress,
  LoadingSpinner,
  Alert,
  Card,
  PriceDisplay,
  Badge,
  Accordion,
} from '@/components'
import { authService } from '@/services/authService'
import { checkoutService } from '@/services/checkoutService'
import '../Checkout/Checkout.css'

interface OrderDetails {
  orderId: string
  status: 'confirmed' | 'pending' | 'active'
  addOns: Array<{
    id: string
    name: string
    quantity: number
    totalPrice: number
  }>
  dates: number[]
  subtotal: number
  tax: number
  discount: number
  total: number
  createdAt: string
  nextDeliveryDate?: string
}

export const AddOnsConfirmation: React.FC = () => {
  const navigate = useNavigate()
  const { orderId } = useParams<{ orderId: string }>()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [orderData, setOrderData] = useState<OrderDetails | null>(null)

  useEffect(() => {
    loadOrderData()
  }, [])

  const loadOrderData = async () => {
    try {
      if (!orderId) {
        setError('Order ID not found')
        setLoading(false)
        return
      }

      const token = authService.getToken()
      const response = await checkoutService.getOrderConfirmation(orderId, token || '')

      if (response.success && response.data) {
        setOrderData(response.data as OrderDetails)
      } else {
        setError(response.error?.message || 'Failed to load order confirmation')
      }
    } catch (err) {
      setError('Failed to load order confirmation. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleGoToDashboard = () => {
    navigate('/dashboard')
  }

  const handleGoHome = () => {
    navigate('/')
  }

  const nextStepItems = [
    {
      id: 'step-1',
      title: '📧 Check Your Email',
      content:
        'A confirmation email has been sent with your add-ons order details and delivery schedule.',
    },
    {
      id: 'step-2',
      title: '📱 Access Your Dashboard',
      content:
        'View your add-ons order, manage deliveries, and track upcoming shipments from your dashboard.',
    },
    {
      id: 'step-3',
      title: '📦 First Add-ons Delivery',
      content: `Your first add-ons delivery is scheduled for the selected dates. We deliver between 5:30 AM - 7:30 AM IST.`,
    },
    {
      id: 'step-4',
      title: '🔄 Manage Your Order',
      content:
        'You can modify, pause, or cancel your add-ons order anytime from your dashboard.',
    },
  ]

  const faqItems = [
    {
      id: 'faq-1',
      title: 'When will my add-ons arrive?',
      content: `Your add-ons will be delivered on the dates you selected. Delivery is between 5:30 AM - 7:30 AM IST.`,
    },
    {
      id: 'faq-2',
      title: 'Can I modify my add-ons order?',
      content:
        'Yes, you can modify, add, or remove add-ons anytime from your dashboard. Changes will take effect on the next delivery cycle.',
    },
    {
      id: 'faq-3',
      title: 'What if I want to cancel?',
      content:
        'You can cancel your add-ons order anytime from your dashboard without any penalties.',
    },
    {
      id: 'faq-4',
      title: 'How are add-ons delivered?',
      content:
        'Add-ons are delivered separately on your selected dates. They can also be combined with your subscription deliveries if scheduled for the same day.',
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-off-white to-neutral-cream flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your confirmation..." />
      </div>
    )
  }

  if (error || !orderData) {
    return (
      <Container>
        <Alert
          type="error"
          message={error || 'Failed to load order confirmation. Please contact support.'}
          dismissible={false}
        />
        <div className="mt-6 flex gap-4">
          <Button variant="secondary" onClick={handleGoHome}>
            Go Home
          </Button>
          <Button variant="primary" onClick={loadOrderData}>
            Try Again
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <div className="checkout-page">
      <Container maxWidth="lg">
        {/* Progress */}
        <CheckoutProgress currentStep={4} totalSteps={4} flowType="addons" />

        {/* Success Section */}
        <div className="checkout-confirmation">
          <div className="checkout-confirmation__icon">✅</div>
          <h1 className="checkout-confirmation__title">Add-ons Order Confirmed!</h1>
          <p className="checkout-confirmation__message">
            Thank you for your order. Your add-ons will be delivered on the scheduled dates.
          </p>

          {/* Order Details */}
          <div className="checkout-confirmation__details">
            <div className="checkout-confirmation__detail-row">
              <span className="checkout-confirmation__detail-label">Order ID</span>
              <span className="checkout-confirmation__detail-value">{orderData.orderId}</span>
            </div>

            <div className="checkout-confirmation__detail-row">
              <span className="checkout-confirmation__detail-label">Status</span>
              <Badge variant="success">{orderData.status.toUpperCase()}</Badge>
            </div>

            <div className="checkout-confirmation__detail-row">
              <span className="checkout-confirmation__detail-label">Add-ons Count</span>
              <span className="checkout-confirmation__detail-value">
                {orderData.addOns.length} items
              </span>
            </div>

            <div className="checkout-confirmation__detail-row">
              <span className="checkout-confirmation__detail-label">Delivery Days</span>
              <span className="checkout-confirmation__detail-value">
                {orderData.dates.length} days
              </span>
            </div>

            <div className="checkout-confirmation__detail-row">
              <span className="checkout-confirmation__detail-label">Order Total</span>
              <span className="checkout-confirmation__detail-value">
                <PriceDisplay amount={orderData.total} size="lg" />
              </span>
            </div>

            <div className="checkout-confirmation__detail-row">
              <span className="checkout-confirmation__detail-label">Order Date</span>
              <span className="checkout-confirmation__detail-value">
                {new Date(orderData.createdAt).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* What's Next Section */}
        <Card className="mt-8">
          <h2 className="text-2xl font-semibold text-primary-brown mb-6">What's Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nextStepItems.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-gradient-to-br from-primary-gold/5 to-transparent rounded-lg border border-neutral-light-gray"
              >
                <h3 className="font-semibold text-primary-brown mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-dark-gray">{item.content}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Order Summary Section */}
        <Card className="mt-8">
          <h2 className="text-2xl font-semibold text-primary-brown mb-6">Order Summary</h2>

          <div className="space-y-3">
            {/* Add-ons */}
            {orderData.addOns.length > 0 && (
              <div className="pb-3 border-b border-neutral-light-gray">
                <p className="font-semibold text-primary-brown mb-2">Add-ons ({orderData.addOns.length})</p>
                {orderData.addOns.map((ao) => (
                  <div key={ao.id} className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-dark-gray">
                      {ao.name} x {ao.quantity}
                    </span>
                    <span>₹{ao.totalPrice.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Delivery Dates */}
            <div className="pb-3 border-b border-neutral-light-gray">
              <p className="font-semibold text-primary-brown mb-2">Delivery Dates</p>
              <div className="flex flex-wrap gap-2">
                {orderData.dates.map((date) => (
                  <span
                    key={date}
                    className="bg-primary-gold bg-opacity-20 text-primary-brown px-2 py-1 rounded text-xs font-semibold"
                  >
                    Day {date}
                  </span>
                ))}
              </div>
            </div>

            {/* Subtotal */}
            <div className="flex justify-between items-center pb-3 border-b border-neutral-light-gray">
              <span className="text-neutral-dark-gray">Subtotal</span>
              <PriceDisplay amount={orderData.subtotal} />
            </div>

            {/* Discount */}
            {orderData.discount > 0 && (
              <div className="flex justify-between items-center pb-3 border-b border-neutral-light-gray text-semantic-success">
                <span>Discount Applied</span>
                <span className="font-semibold">-₹{orderData.discount.toFixed(0)}</span>
              </div>
            )}

            {/* Tax */}
            <div className="flex justify-between items-center pb-3 border-b border-neutral-light-gray">
              <span className="text-neutral-dark-gray">Tax (5% GST)</span>
              <PriceDisplay amount={orderData.tax} />
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-3">
              <span className="font-semibold text-primary-brown">Total</span>
              <div className="text-2xl font-bold text-primary-gold">
                ₹{orderData.total.toFixed(0)}
              </div>
            </div>
          </div>
        </Card>

        {/* FAQ Section */}
        <Card className="mt-8">
          <h2 className="text-2xl font-semibold text-primary-brown mb-6">Frequently Asked Questions</h2>
          <Accordion items={faqItems} allowMultiple={false} />
        </Card>

        {/* Action Buttons */}
        <div className="checkout-nav-buttons mt-8">
          <Button variant="secondary" onClick={handleGoHome}>
            Continue Shopping
          </Button>
          <Button variant="primary" size="lg" onClick={handleGoToDashboard}>
            Go to Dashboard →
          </Button>
        </div>

        {/* Support Info */}
        <div className="mt-8 p-6 bg-gradient-to-r from-primary-gold/10 to-transparent rounded-lg border border-primary-gold/20">
          <h3 className="font-semibold text-primary-brown mb-2">Need Help?</h3>
          <p className="text-sm text-neutral-dark-gray mb-3">
            If you have any questions about your add-ons order, our support team is here to help.
          </p>
          <p className="text-sm">
            <strong>Email:</strong> support@bloomme.com | <strong>WhatsApp:</strong> +91-xxx-xxx-xxxx
          </p>
        </div>
      </Container>
    </div>
  )
}
