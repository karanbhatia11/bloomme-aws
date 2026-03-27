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
import './Checkout.css'

interface OrderDetails {
  orderId: string
  subscriptionId: string
  planName: string
  planPrice: number
  deliveryDays: number[]
  deliveryMonth: number
  deliveryYear: number
  addOns: Array<{
    id: string
    name: string
    quantity: number
    totalPrice: number
  }>
  subtotal: number
  tax: number
  discount: number
  total: number
  startDate: string
  firstDeliveryDate: string
  status: 'confirmed' | 'pending' | 'active'
}

export const Confirmation: React.FC = () => {
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
        'A confirmation email has been sent with your subscription details. Check it for important information and links.',
    },
    {
      id: 'step-2',
      title: '📱 Access Your Dashboard',
      content:
        'Visit your dashboard to manage your subscription, view upcoming deliveries, and track your flowers.',
    },
    {
      id: 'step-3',
      title: '📦 First Delivery',
      content: `Your first delivery is scheduled for ${orderData?.firstDeliveryDate || 'the date specified in your confirmation'}. We deliver between 5:30 AM - 7:30 AM IST.`,
    },
    {
      id: 'step-4',
      title: '🔄 Manage Anytime',
      content:
        'You can pause, resume, or modify your subscription anytime from your dashboard without any penalties.',
    },
    {
      id: 'step-5',
      title: '💬 Need Help?',
      content:
        'Contact our support team via email (support@bloomme.com) or WhatsApp for any questions or assistance.',
    },
  ]

  const faqItems = [
    {
      id: 'faq-1',
      title: 'When will my first delivery arrive?',
      content: `Your first delivery is scheduled for ${orderData?.firstDeliveryDate || 'the date shown in your confirmation'}. All deliveries occur between 5:30 AM - 7:30 AM IST on your selected days.`,
    },
    {
      id: 'faq-2',
      title: 'How do I manage my subscription?',
      content:
        'Visit your dashboard to view all upcoming deliveries, modify your schedule, add/remove add-ons, and manage your account settings.',
    },
    {
      id: 'faq-3',
      title: 'Can I pause or cancel my subscription?',
      content:
        'Yes, you can pause your subscription for up to 3 months or cancel anytime from your dashboard. There are no penalties for pausing or canceling.',
    },
    {
      id: 'faq-4',
      title: 'What payment methods do you accept?',
      content:
        'We accept all credit/debit cards, UPI, net banking, and wallet payments. Your subscription will renew automatically on the next billing cycle.',
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
        <CheckoutProgress currentStep={5} totalSteps={5} flowType="subscription" />

        {/* Success Section */}
        <div className="checkout-confirmation">
          <div className="checkout-confirmation__icon">✅</div>
          <h1 className="checkout-confirmation__title">Order Confirmed!</h1>
          <p className="checkout-confirmation__message">
            Thank you for subscribing to Bloomme. Your subscription is now active.
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
              <span className="checkout-confirmation__detail-label">Subscription Plan</span>
              <span className="checkout-confirmation__detail-value">{orderData.planName}</span>
            </div>

            <div className="checkout-confirmation__detail-row">
              <span className="checkout-confirmation__detail-label">Delivery Days/Month</span>
              <span className="checkout-confirmation__detail-value">
                {orderData.deliveryDays.length} days
              </span>
            </div>

            {orderData.addOns.length > 0 && (
              <div className="checkout-confirmation__detail-row">
                <span className="checkout-confirmation__detail-label">Add-ons</span>
                <span className="checkout-confirmation__detail-value">
                  {orderData.addOns.length} selected
                </span>
              </div>
            )}

            <div className="checkout-confirmation__detail-row">
              <span className="checkout-confirmation__detail-label">Monthly Amount</span>
              <span className="checkout-confirmation__detail-value">
                <PriceDisplay amount={orderData.total} size="lg" />
              </span>
            </div>

            <div className="checkout-confirmation__detail-row">
              <span className="checkout-confirmation__detail-label">First Delivery Date</span>
              <span className="checkout-confirmation__detail-value">
                {new Date(orderData.firstDeliveryDate).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            <div className="checkout-confirmation__detail-row">
              <span className="checkout-confirmation__detail-label">Start Date</span>
              <span className="checkout-confirmation__detail-value">
                {new Date(orderData.startDate).toLocaleDateString('en-IN', {
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
              <div key={item.id} className="p-4 bg-gradient-to-br from-primary-gold/5 to-transparent rounded-lg border border-neutral-light-gray">
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
            {/* Plan */}
            <div className="flex justify-between items-center pb-3 border-b border-neutral-light-gray">
              <div>
                <p className="font-semibold text-primary-brown">{orderData.planName}</p>
                <p className="text-xs text-neutral-dark-gray">
                  {orderData.deliveryDays.length} days/month
                </p>
              </div>
              <PriceDisplay amount={orderData.planPrice * orderData.deliveryDays.length} />
            </div>

            {/* Add-ons */}
            {orderData.addOns.length > 0 && (
              <div className="pb-3 border-b border-neutral-light-gray">
                <p className="font-semibold text-primary-brown mb-2">Add-ons</p>
                {orderData.addOns.map((ao) => (
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
              <span className="font-semibold text-primary-brown">Monthly Total</span>
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
            If you have any questions or need assistance with your subscription, our support team is here to help.
          </p>
          <p className="text-sm">
            <strong>Email:</strong> support@bloomme.com | <strong>WhatsApp:</strong> +91-xxx-xxx-xxxx
          </p>
        </div>
      </Container>
    </div>
  )
}
