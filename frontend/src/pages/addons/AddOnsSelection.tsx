import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Button,
  CheckoutProgress,
  AddOnCardGrid,
  PriceDisplay,
  Alert,
  LoadingSpinner,
  Card,
  Badge,
  PageHeader,
} from '@/components'
import { ADD_ONS } from '@/lib/constants'
import { getAPI } from '@/lib/api'
import type { AddOn } from '@/lib/types'

interface SelectedAddOn {
  id: string
  name: string
  price: number
  quantity: number
  totalPrice: number
}

export const AddOnsSelection: React.FC = () => {
  const navigate = useNavigate()
  const [addOns, setAddOns] = useState<AddOn[]>(ADD_ONS)
  const [selectedAddOns, setSelectedAddOns] = useState<SelectedAddOn[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [userSubscription, setUserSubscription] = useState<any>(null)

  // Verify user is authenticated and has subscription
  useEffect(() => {
    verifyUserSubscription()
  }, [])

  const verifyUserSubscription = async () => {
    try {
      const token = sessionStorage.getItem('authToken')

      if (!token) {
        navigate('/login')
        return
      }

      // Get user's current subscription
      const response = await getAPI('/api/subs/my-subscription', token)

      if (response.success && response.data) {
        setUserSubscription(response.data)
        // Fetch add-ons
        await fetchAddOns(token)
      } else {
        setError('You need an active subscription to order add-ons')
        setTimeout(() => navigate('/'), 2000)
      }
    } catch (err) {
      setError('Error verifying subscription')
      console.error(err)
      setTimeout(() => navigate('/'), 2000)
    } finally {
      setLoading(false)
    }
  }

  const fetchAddOns = async (token: string) => {
    try {
      const response = await getAPI<{ addOns: AddOn[] }>(
        '/api/user/config/add-ons',
        token
      )
      if (response.success && response.data?.addOns) {
        setAddOns(response.data.addOns)
      }
    } catch (err) {
      console.log('Using default add-ons')
    }
  }

  const handleAddOnChange = (id: string, quantity: number) => {
    const addOn = addOns.find((ao) => ao.id === id)

    if (!addOn) return

    if (quantity === 0) {
      setSelectedAddOns((prev) => prev.filter((ao) => ao.id !== id))
    } else {
      const existing = selectedAddOns.find((ao) => ao.id === id)
      const totalPrice = addOn.price * quantity

      if (existing) {
        setSelectedAddOns((prev) =>
          prev.map((ao) =>
            ao.id === id ? { ...ao, quantity, totalPrice } : ao
          )
        )
      } else {
        setSelectedAddOns((prev) => [
          ...prev,
          {
            id,
            name: addOn.name,
            price: addOn.price,
            quantity,
            totalPrice,
          },
        ])
      }
    }

    setError('')
  }

  const handleContinue = () => {
    if (selectedAddOns.length === 0) {
      setError('Please select at least one add-on')
      return
    }

    // Store add-ons for next step
    sessionStorage.setItem('addonsCheckoutAddOns', JSON.stringify(selectedAddOns))
    sessionStorage.setItem('addonsCheckoutType', 'addons-only')

    navigate('/addons/delivery')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-off-white to-neutral-cream flex items-center justify-center">
        <LoadingSpinner size="lg" text="Verifying subscription..." />
      </div>
    )
  }

  const totalAddOnsPrice = selectedAddOns.reduce((sum, ao) => sum + ao.totalPrice, 0)

  return (
    <div className="checkout-page">
      <Container maxWidth="lg">
        {/* Progress */}
        <CheckoutProgress currentStep={1} totalSteps={4} flowType="addons" />

        {/* Header */}
        <PageHeader
          title="Add More to Your Delivery"
          subtitle={`Enhance your ${userSubscription?.plan?.name} subscription with optional add-ons`}
        />

        {/* Subscription Status */}
        {userSubscription && (
          <Card className="mb-6 bg-primary-gold bg-opacity-5 border-primary-gold">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-primary-brown">Active Subscription</p>
                <p className="text-sm text-neutral-dark-gray">
                  {userSubscription.plan?.name} • {userSubscription.deliveryDays?.length || 'N/A'} days/week
                </p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          </Card>
        )}

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
          {/* Add-ons Grid */}
          <div className="lg:col-span-2">
            <AddOnCardGrid
              addOns={addOns}
              selectedAddOns={selectedAddOns.map((ao) => ({
                id: ao.id,
                quantity: ao.quantity,
              }))}
              onAddOnChange={handleAddOnChange}
              showQuantity={true}
            />
          </div>

          {/* Summary Sidebar */}
          <div className="bg-white rounded-lg p-6 border border-neutral-light-gray h-fit sticky top-4">
            <h3 className="font-display text-xl text-primary-brown mb-4">
              Order Summary
            </h3>

            {selectedAddOns.length > 0 ? (
              <>
                <div className="space-y-2 mb-4 pb-4 border-b border-neutral-light-gray">
                  {selectedAddOns.map((ao) => (
                    <div key={ao.id} className="flex justify-between text-sm">
                      <span className="text-neutral-dark-gray">
                        {ao.name} x {ao.quantity}
                      </span>
                      <PriceDisplay amount={ao.totalPrice} />
                    </div>
                  ))}
                </div>

                <div className="mb-4 pb-4 border-b border-neutral-light-gray">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-primary-brown">Total</span>
                    <PriceDisplay
                      amount={totalAddOnsPrice}
                      size="lg"
                    />
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleContinue}
                  className="w-full"
                >
                  Continue to Delivery
                </Button>
              </>
            ) : (
              <div className="text-center">
                <p className="text-sm text-neutral-dark-gray mb-4">
                  Select add-ons to get started
                </p>
                <p className="text-xs text-neutral-dark-gray">
                  You can choose multiple items and quantities
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="checkout-nav-buttons">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleContinue}
            disabled={selectedAddOns.length === 0}
          >
            Continue ({selectedAddOns.length} items)
          </Button>
        </div>
      </Container>
    </div>
  )
}
