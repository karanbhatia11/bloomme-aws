import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  PageHeader,
  Calendar,
  WeekdaySelector,
  Button,
  Card,
  CheckoutProgress,
  OrderSummary as OrderSummaryComponent,
} from '@/components'
import { useCheckout } from '@/contexts/CheckoutContext'
import './Checkout.css'

export const DeliverySelection: React.FC = () => {
  const navigate = useNavigate()
  const { state, setDeliveryDays, setDeliveryMonth, getOrderSummary } = useCheckout()

  const [selectedDays, setSelectedDays] = useState<number[]>(state.selectedDeliveryDays)
  const [currentMonth, setCurrentMonth] = useState(state.deliveryMonth)
  const [currentYear, setCurrentYear] = useState(state.deliveryYear)
  const [mode, setMode] = useState<'calendar' | 'weekday'>('calendar')

  const handleDaySelect = (day: number) => {
    setSelectedDays(prev => [...prev, day])
  }

  const handleDayDeselect = (day: number) => {
    setSelectedDays(prev => prev.filter(d => d !== day))
  }

  const handleWeekdayChange = (days: number[]) => {
    // Convert weekday selection to calendar days for the month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const mappedDays: number[] = []

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i)
      if (days.includes(date.getDay())) {
        mappedDays.push(i)
      }
    }

    setSelectedDays(mappedDays)
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleContinue = () => {
    if (selectedDays.length === 0) {
      alert('Please select at least one delivery day')
      return
    }

    setDeliveryDays(selectedDays)
    setDeliveryMonth(currentMonth, currentYear)
    navigate('/checkout/addons')
  }

  const handleBack = () => {
    navigate('/checkout/plans')
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
        <CheckoutProgress currentStep={2} totalSteps={5} flowType="subscription" />

        {/* Header */}
        <PageHeader
          title="Select Delivery Days"
          subtitle="Choose when you want your flowers delivered"
        />

        {/* Mode Selector */}
        <div className="delivery-mode-selector">
          <button
            className={`delivery-mode-btn ${mode === 'calendar' ? 'delivery-mode-btn--active' : ''}`}
            onClick={() => setMode('calendar')}
          >
            📅 Select Specific Dates
          </button>
          <button
            className={`delivery-mode-btn ${mode === 'weekday' ? 'delivery-mode-btn--active' : ''}`}
            onClick={() => setMode('weekday')}
          >
            📆 Weekly Pattern
          </button>
        </div>

        <div className="checkout-calendar-layout">
          <div className="checkout-calendar-main">
            {mode === 'calendar' && (
              <Card>
                <div className="calendar-wrapper">
                  <div className="calendar-header">
                    <button onClick={handlePrevMonth}>← Prev</button>
                    <h3>
                      {new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </h3>
                    <button onClick={handleNextMonth}>Next →</button>
                  </div>

                  <Calendar
                    selectedDates={selectedDays}
                    onSelectDate={handleDaySelect}
                    onDeselectDate={handleDayDeselect}
                    month={currentMonth}
                    year={currentYear}
                    multiSelect={true}
                  />
                </div>
              </Card>
            )}

            {mode === 'weekday' && (
              <Card>
                <p className="weekday-info">
                  Select the days of the week you want your flowers delivered
                </p>
                <WeekdaySelector
                  selectedDays={[]}
                  onChange={handleWeekdayChange}
                  label="Delivery Days (Weekly)"
                />
              </Card>
            )}

            {/* Help Text */}
            <div className="checkout-help-text">
              <p>Delivery between 5:30 AM - 7:30 AM IST</p>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div>
            <OrderSummaryComponent
              summary={{
                ...orderSummary,
                subscription: state.selectedPlan
                  ? {
                      planId: state.selectedPlan.id,
                      planName: state.selectedPlan.name,
                      price: state.selectedPlan.price,
                      deliveryDays: selectedDays,
                    }
                  : undefined,
                addOns: [],
                subtotal: 0,
                tax: 0,
                discount: 0,
                total: (state.selectedPlan?.price || 0) * selectedDays.length,
              }}
              readonly={true}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="checkout-nav-buttons">
          <Button variant="secondary" onClick={handleBack}>
            ← Back
          </Button>
          <Button variant="primary" size="lg" onClick={handleContinue}>
            Continue to Add-ons →
          </Button>
        </div>
      </Container>
    </div>
  )
}
