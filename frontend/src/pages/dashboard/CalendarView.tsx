import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Button,
  Card,
  LoadingSpinner,
  Alert,
  Modal,
  PageHeader,
} from '@/components'
import { getAPI } from '@/lib/api'

interface DeliveryItem {
  date: number
  type: 'subscription' | 'addon'
  items: string[]
}

interface CalendarData {
  deliveries: DeliveryItem[]
}

export const CalendarView: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([])
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadCalendarData()
  }, [currentMonth, currentYear])

  const loadCalendarData = async () => {
    try {
      setLoading(true)
      const token = sessionStorage.getItem('authToken')
      if (!token) {
        navigate('/login')
        return
      }

      const subscriptionId = searchParams.get('subscription')

      const endpoint = subscriptionId
        ? `/api/subscriptions/${subscriptionId}/calendar?month=${currentMonth + 1}&year=${currentYear}`
        : `/api/calendar/my-deliveries?month=${currentMonth + 1}&year=${currentYear}`

      const response = await getAPI<CalendarData>(endpoint, token)

      if (response.success && response.data?.deliveries) {
        setDeliveries(response.data.deliveries)
      } else {
        setError('Failed to load calendar data')
      }
    } catch (err) {
      setError('Failed to load calendar data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getDeliveriesForDate = (day: number): DeliveryItem | null => {
    return deliveries.find((d) => d.date === day) || null
  }

  const isToday = (day: number): boolean => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    )
  }

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1)
      setCurrentMonth(11)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1)
      setCurrentMonth(0)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())
  }

  const getSubscriptionDeliveries = (): number[] => {
    return deliveries
      .filter((d) => d.type === 'subscription')
      .map((d) => d.date)
  }

  const getAddOnDeliveries = (): number[] => {
    return deliveries.filter((d) => d.type === 'addon').map((d) => d.date)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading calendar..." />
      </div>
    )
  }

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString(
    'en-IN',
    { month: 'long', year: 'numeric' }
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Delivery Calendar"
        subtitle="View all your upcoming subscription and add-ons deliveries"
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

      {/* Calendar Section */}
      <Card>
        {/* Calendar Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-primary-brown">
              {monthName}
            </h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={goToPreviousMonth}>
                ← Previous
              </Button>
              <Button variant="ghost" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="ghost" size="sm" onClick={goToNextMonth}>
                Next →
              </Button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 p-4 bg-neutral-off-white rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary-gold rounded"></div>
              <span className="text-sm text-neutral-dark-gray">
                Subscription Delivery
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-semantic-success rounded"></div>
              <span className="text-sm text-neutral-dark-gray">
                Add-ons Delivery
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-brown rounded"></div>
              <span className="text-sm text-neutral-dark-gray">
                Today
              </span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-neutral-dark-gray py-2"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {Array.from({ length: 42 }).map((_, idx) => {
            const firstDay = new Date(currentYear, currentMonth, 1).getDay()
            const daysInMonth = new Date(
              currentYear,
              currentMonth + 1,
              0
            ).getDate()
            const day = idx - firstDay + 1

            if (day < 1 || day > daysInMonth) {
              return <div key={idx} className="aspect-square"></div>
            }

            const delivery = getDeliveriesForDate(day)
            const hasSubscription = delivery?.type === 'subscription'
            const hasAddOn = delivery?.type === 'addon'
            const isTodayDate = isToday(day)

            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedDate(day)
                  setShowModal(true)
                }}
                className={`aspect-square p-2 rounded-lg border-2 transition-all ${
                  isTodayDate
                    ? 'border-primary-brown'
                    : 'border-transparent'
                } ${
                  hasSubscription
                    ? 'bg-primary-gold/20'
                    : hasAddOn
                      ? 'bg-semantic-success/20'
                      : 'bg-neutral-light-gray/50'
                } hover:shadow-md`}
              >
                <div className="h-full flex flex-col items-center justify-between">
                  <span className="text-sm font-semibold text-primary-brown">
                    {day}
                  </span>
                  <div className="flex gap-1">
                    {hasSubscription && (
                      <div className="w-2 h-2 bg-primary-gold rounded-full"></div>
                    )}
                    {hasAddOn && (
                      <div className="w-2 h-2 bg-semantic-success rounded-full"></div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Delivery Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Subscription Deliveries */}
        <Card className="bg-gradient-to-br from-primary-gold/5 to-transparent">
          <h4 className="font-semibold text-primary-brown mb-3">
            Subscription Deliveries
          </h4>
          <div className="space-y-2">
            {getSubscriptionDeliveries().length > 0 ? (
              getSubscriptionDeliveries().map((date) => {
                const delivery = getDeliveriesForDate(date)
                return (
                  <div key={date} className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary-gold rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary-brown">
                        {new Date(currentYear, currentMonth, date).toLocaleDateString(
                          'en-IN',
                          { weekday: 'short', month: 'short', day: 'numeric' }
                        )}
                      </p>
                      {delivery?.items && delivery.items.length > 0 && (
                        <p className="text-xs text-neutral-dark-gray">
                          {delivery.items.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-sm text-neutral-dark-gray">
                No subscription deliveries this month
              </p>
            )}
          </div>
        </Card>

        {/* Add-ons Deliveries */}
        <Card className="bg-gradient-to-br from-semantic-success/5 to-transparent">
          <h4 className="font-semibold text-primary-brown mb-3">
            Add-ons Deliveries
          </h4>
          <div className="space-y-2">
            {getAddOnDeliveries().length > 0 ? (
              getAddOnDeliveries().map((date) => {
                const delivery = getDeliveriesForDate(date)
                return (
                  <div key={date} className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-semantic-success rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary-brown">
                        {new Date(currentYear, currentMonth, date).toLocaleDateString(
                          'en-IN',
                          { weekday: 'short', month: 'short', day: 'numeric' }
                        )}
                      </p>
                      {delivery?.items && delivery.items.length > 0 && (
                        <p className="text-xs text-neutral-dark-gray">
                          {delivery.items.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-sm text-neutral-dark-gray">
                No add-ons deliveries this month
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="bg-gradient-to-r from-primary-gold/5 to-primary-copper/5 border border-primary-gold/20">
        <h4 className="font-semibold text-primary-brown mb-2">
          💡 Delivery Information
        </h4>
        <ul className="text-sm text-neutral-dark-gray space-y-1">
          <li>✓ All deliveries are between 5:30 AM - 7:30 AM IST</li>
          <li>✓ Subscription items are delivered on scheduled days</li>
          <li>✓ Add-ons can be delivered on any selected dates</li>
          <li>✓ You can manage delivery dates from the Add-ons section</li>
        </ul>
      </Card>

      {/* Modal for Date Details */}
      {showModal && selectedDate !== null && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="max-w-sm mx-auto">
            <h3 className="text-lg font-semibold text-primary-brown mb-4">
              {new Date(currentYear, currentMonth, selectedDate).toLocaleDateString(
                'en-IN',
                { weekday: 'long', month: 'long', day: 'numeric' }
              )}
            </h3>

            {(() => {
              const delivery = getDeliveriesForDate(selectedDate)

              if (!delivery) {
                return (
                  <p className="text-neutral-dark-gray mb-6">
                    No deliveries scheduled for this date.
                  </p>
                )
              }

              return (
                <div className="mb-6 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-primary-brown mb-2">
                      {delivery.type === 'subscription'
                        ? '📦 Subscription Delivery'
                        : '🎁 Add-ons Delivery'}
                    </p>
                    <ul className="text-sm text-neutral-dark-gray space-y-1">
                      {delivery.items.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-primary-gold/10 rounded-lg">
                    <p className="text-xs text-primary-brown">
                      <strong>Delivery Time:</strong> 5:30 AM - 7:30 AM IST
                    </p>
                  </div>
                </div>
              )
            })()}

            <Button
              variant="primary"
              onClick={() => setShowModal(false)}
              className="w-full"
            >
              Got it
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
