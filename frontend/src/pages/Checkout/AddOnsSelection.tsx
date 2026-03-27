import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  PageHeader,
  AddOnCardGrid,
  Button,
  Card,
  CheckoutProgress,
  LoadingSpinner,
  Alert,
  Accordion,
  OrderSummary as OrderSummaryComponent,
} from '@/components'
import { useCheckout } from '@/contexts/CheckoutContext'
import { checkoutService } from '@/services/checkoutService'
import type { AddOn } from '@/lib/types'
import './Checkout.css'

export const AddOnsSelection: React.FC = () => {
  const navigate = useNavigate()
  const { state, addAddOn, removeAddOn, updateAddOnQuantity, getOrderSummary } = useCheckout()

  const [addOns, setAddOns] = useState<AddOn[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAddOns, setSelectedAddOns] = useState(state.selectedAddOns)

  useEffect(() => {
    const fetchAddOns = async () => {
      try {
        setLoading(true)
        const response = await checkoutService.getAddOns()
        if (response.success && response.data) {
          setAddOns(response.data)
        } else {
          setError('Failed to load add-ons')
        }
      } catch (err) {
        setError('Failed to load add-ons')
      } finally {
        setLoading(false)
      }
    }

    fetchAddOns()
  }, [])

  const handleAddOnChange = (id: string, quantity: number) => {
    const addon = addOns.find((a: AddOn) => a.id === id)
    if (!addon) return

    if (quantity === 0) {
      removeAddOn(id)
      setSelectedAddOns((prev: any[]) => prev.filter((a: any) => a.id !== id))
    } else {
      const existing = selectedAddOns.find((a: any) => a.id === id)
      if (existing) {
        updateAddOnQuantity(id, quantity)
        setSelectedAddOns((prev: any[]) =>
          prev.map((a: any) => (a.id === id ? { ...a, quantity } : a))
        )
      } else {
        addAddOn(addon, quantity)
        setSelectedAddOns((prev: any[]) => [
          ...prev,
          { id, quantity, price: addon.price },
        ])
      }
    }
  }

  const handleContinue = () => {
    navigate('/checkout/review')
  }

  const handleBack = () => {
    navigate('/checkout/delivery')
  }

  const orderSummary = getOrderSummary() || {
    subtotal: 0,
    tax: 0,
    total: 0,
  }

  const faqItems = [
    {
      id: 'faq-1',
      title: 'Can I change add-ons later?',
      content: 'Yes, you can modify your add-ons anytime from your dashboard.',
    },
    {
      id: 'faq-2',
      title: 'Are add-ons delivered with flowers?',
      content: 'Yes, add-ons are delivered together with your flower package.',
    },
    {
      id: 'faq-3',
      title: 'What if I want add-ons only on certain days?',
      content:
        'You can manage specific delivery dates in your dashboard after checkout.',
    },
  ]

  if (loading) {
    return <LoadingSpinner fullScreen={true} text="Loading add-ons..." />
  }

  return (
    <div className="checkout-page">
      <Container maxWidth="lg">
        {/* Progress Indicator */}
        <CheckoutProgress currentStep={3} totalSteps={5} flowType="subscription" />

        {/* Header */}
        <PageHeader
          title="Add Extras"
          subtitle="Make your puja experience even better (Optional)"
        />

        {/* Error Alert */}
        {error && (
          <Alert type="error" message={error} dismissible={true} onDismiss={() => setError(null)} />
        )}

        {/* Add-ons Grid */}
        <AddOnCardGrid
          addOns={addOns}
          selectedAddOns={selectedAddOns}
          onAddOnChange={handleAddOnChange}
          showQuantity={true}
        />

        {/* FAQ Accordion */}
        <Card className="addons-faq">
          <h3 className="addons-faq__title">Frequently Asked Questions</h3>
          <Accordion items={faqItems} allowMultiple={false} />
        </Card>

        {/* Summary Sidebar */}
        <div className="addons-summary">
          <OrderSummaryComponent summary={orderSummary} readonly={true} />
        </div>

        {/* Navigation Buttons */}
        <div className="checkout-nav-buttons">
          <Button variant="secondary" onClick={handleBack}>
            ← Back
          </Button>
          <Button variant="primary" size="lg" onClick={handleContinue}>
            Continue to Review →
          </Button>
        </div>
      </Container>
    </div>
  )
}
