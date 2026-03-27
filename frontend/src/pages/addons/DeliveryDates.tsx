import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Button,
  CheckoutProgress,
  Calendar,
  PriceDisplay,
  Alert,
  Card,
  PageHeader,
  LoadingSpinner,
} from '@/components'
import { getAPI } from '@/lib/api'

interface SelectedAddOn {
  id: string
  name: string
  price: number
  quantity: number
  totalPrice: number
}

export const DeliveryDates: React.FC = () => {
  const navigate = useNavigate()
  const [selectedAddOns, setSelectedAddOns] = useState<SelectedAddOn[]>([])
  const [selectedDates, setSelectedDates] = useState<number[]>([])
  const [error, setError] = useState<string>('')
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [userSubscription, setUserSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCheckoutData()
  }, [])

  const loadCheckoutData = async () => {
    try {
      // Load add-ons from session
      const addOnsJson = sessionStorage.getItem('addonsCheckoutAddOns')
      if (!addOnsJson) {
        navigate('/addons/select')
        return
      }

      const addOns = JSON.parse(addOnsJson)
      setSelectedAddOns(addOns)

      // Load user subscription (for existing delivery days)
      const token = sessionStorage.getItem('authToken')
      if (token) {
        // Get subscription details to show existing delivery days
        const response = await getAPI('/api/subs/my-subscription', token)
        if (response.success && response.data) {
          setUserSubscription(response.data)
        }
      }
    } catch (err) {
      setError('Failed to load checkout data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (selectedDates.length === 0) {
      setError('Please select at least one delivery date')
      return
    }

    // Store dates and proceed to review
    sessionStorage.setItem('addonsCheckoutDates', JSON.stringify(selectedDates))

    navigate('/addons/review')
  }

  const totalPrice = selectedAddOns.reduce((sum, ao) => sum + ao.totalPrice, 0)
  const totalWithDates = totalPrice * (selectedDates.length > 0 ? selectedDates.length : 1)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-off-white to-neutral-cream flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading delivery calendar..." />
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <Container maxWidth="lg">
        {/* Progress */}
        <CheckoutProgress currentStep={2} totalSteps={4} flowType="addons" />

        {/* Header */}
        <PageHeader
          title="Choose Delivery Dates"
          subtitle="Select which dates you want your add-ons delivered"
        />

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <Alert
              type="error"
              message={error}
              onDismiss={() => setError('')}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-lg p-8 border border-neutral-light-gray">
            <div className="mb-6">
              <h3 className="font-semibold text-primary-brown text-lg mb-4">
                Select Dates for {new Date(currentYear, currentMonth).toLocaleDateString('en-IN', {
                  month: 'long',
                  year: 'numeric',
                })}
              </h3>
              {userSubscription?.deliveryDays && userSubscription.deliveryDays.length > 0 && (
                <p className="text-sm text-neutral-dark-gray mb-4">
                  Your subscription covers: {userSubscription.deliveryDays.join(', ')} days/week
                </p>
              )}
            </div>

            {/* Calendar Component */}
            <Calendar
              selectedDates={selectedDates}
              onSelectDate={(day) => {
                setSelectedDates([...selectedDates, day])
                setError('')
              }}
              onDeselectDate={(day) =>
                setSelectedDates(selectedDates.filter((d) => d !== day))
              }
              month={currentMonth}
              year={currentYear}
              multiSelect={true}
            />

            {/* Month Navigation */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => {
                  if (currentMonth === 0) {
                    setCurrentYear(currentYear - 1)
                    setCurrentMonth(11)
                  } else {
                    setCurrentMonth(currentMonth - 1)
                  }
                }}
                className="text-primary-gold font-semibold hover:text-primary-copper transition"
              >
                ← Previous
              </button>
              <span className="text-sm text-neutral-dark-gray">
                {new Date(currentYear, currentMonth).toLocaleDateString('en-IN', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <button
                onClick={() => {
                  if (currentMonth === 11) {
                    setCurrentYear(currentYear + 1)
                    setCurrentMonth(0)
                  } else {
                    setCurrentMonth(currentMonth + 1)
                  }
                }}
                className="text-primary-gold font-semibold hover:text-primary-copper transition"
              >
                Next →
              </button>
            </div>

            {/* Info */}
            {userSubscription?.deliveryDays && userSubscription.deliveryDays.length > 0 && (
              <Card className="mt-6 bg-primary-gold bg-opacity-5 border-primary-gold">
                <p className="text-sm text-primary-brown">
                  💡 <strong>Tip:</strong> Select dates outside your regular delivery schedule to get add-ons on specific days
                </p>
              </Card>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="bg-white rounded-lg p-6 border border-neutral-light-gray h-fit sticky top-4">
            <h3 className="font-display text-xl text-primary-brown mb-4">
              Summary
            </h3>

            {/* Selected Add-ons */}
            <div className="pb-4 border-b border-neutral-light-gray mb-4">
              <p className="font-semibold text-primary-brown text-sm mb-2">
                Add-ons ({selectedAddOns.length})
              </p>
              {selectedAddOns.map((ao) => (
                <div key={ao.id} className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-dark-gray">{ao.name} x{ao.quantity}</span>
                  <span>₹{ao.totalPrice.toFixed(0)}</span>
                </div>
              ))}
            </div>

            {/* Dates */}
            <div className="pb-4 border-b border-neutral-light-gray mb-4">
              <p className="font-semibold text-primary-brown text-sm mb-2">
                Dates Selected
              </p>
              <p className="text-2xl font-bold text-primary-gold">
                {selectedDates.length}
              </p>
              <p className="text-xs text-neutral-dark-gray">
                {selectedDates.length === 1 ? 'day' : 'days'}
              </p>
            </div>

            {/* Total */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-primary-brown">Total</span>
                <PriceDisplay
                  amount={totalWithDates}
                  size="lg"
                />
              </div>
              <p className="text-xs text-neutral-dark-gray">
                {selectedDates.length} days × ₹{totalPrice.toFixed(0)}
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleContinue}
              disabled={selectedDates.length === 0}
              className="w-full"
            >
              Continue to Review
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="checkout-nav-buttons">
          <Button variant="ghost" onClick={() => navigate('/addons/select')}>
            ← Back
          </Button>
        </div>
      </Container>
    </div>
  )
}
