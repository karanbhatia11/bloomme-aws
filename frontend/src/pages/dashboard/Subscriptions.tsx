import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  LoadingSpinner,
  Alert,
  Badge,
  PriceDisplay,
  Modal,
  PageHeader,
} from '@/components'
import { getAPI, postAPI } from '@/lib/api'
import type { Subscription } from '@/lib/types'

interface SubscriptionData {
  subscriptions: Subscription[]
}

export const SubscriptionsManagement: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<
    'pause' | 'resume' | 'upgrade' | 'cancel' | null
  >(null)

  useEffect(() => {
    loadSubscriptions()
  }, [])

  const loadSubscriptions = async () => {
    try {
      const token = sessionStorage.getItem('authToken')
      if (!token) {
        navigate('/login')
        return
      }

      const response = await getAPI<SubscriptionData>(
        '/api/subs/my-subscriptions',
        token
      )

      if (response.success && response.data?.subscriptions) {
        setSubscriptions(response.data.subscriptions)
      } else {
        setError('Failed to load subscriptions')
      }
    } catch (err) {
      setError('Failed to load subscriptions')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePauseSubscription = async () => {
    if (!selectedSub) return

    setProcessing(true)
    try {
      const token = sessionStorage.getItem('authToken')
      const response = await postAPI(
        `/api/subs/${selectedSub.id}/pause`,
        {},
        token || ''
      )

      if (response.success) {
        setSuccess('Subscription paused successfully')
        setShowModal(false)
        setModalType(null)
        loadSubscriptions()
      } else {
        setError(
          response.error?.message || 'Failed to pause subscription'
        )
      }
    } catch (err) {
      setError('Failed to pause subscription')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const handleResumeSubscription = async () => {
    if (!selectedSub) return

    setProcessing(true)
    try {
      const token = sessionStorage.getItem('authToken')
      const response = await postAPI(
        `/api/subs/${selectedSub.id}/resume`,
        {},
        token || ''
      )

      if (response.success) {
        setSuccess('Subscription resumed successfully')
        setShowModal(false)
        setModalType(null)
        loadSubscriptions()
      } else {
        setError(
          response.error?.message || 'Failed to resume subscription'
        )
      }
    } catch (err) {
      setError('Failed to resume subscription')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!selectedSub) return

    setProcessing(true)
    try {
      const token = sessionStorage.getItem('authToken')
      const response = await postAPI(
        `/api/subs/${selectedSub.id}/cancel`,
        {},
        token || ''
      )

      if (response.success) {
        setSuccess('Subscription cancelled successfully')
        setShowModal(false)
        setModalType(null)
        loadSubscriptions()
      } else {
        setError(
          response.error?.message || 'Failed to cancel subscription'
        )
      }
    } catch (err) {
      setError('Failed to cancel subscription')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const openModal = (type: 'pause' | 'resume' | 'upgrade' | 'cancel', sub: Subscription) => {
    setSelectedSub(sub)
    setModalType(type)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalType(null)
    setSelectedSub(null)
  }

  const getDeliveryDaysLabel = (days: number[] | undefined): string => {
    if (!days || days.length === 0) return 'N/A'

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days.map((d) => dayNames[d] || 'N/A').join(', ')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading subscriptions..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Manage Subscriptions"
        subtitle="View and manage all your active and inactive subscriptions"
      />

      {/* Alerts */}
      {error && (
        <Alert
          type="error"
          message={error}
          dismissible={true}
          onDismiss={() => setError('')}
        />
      )}

      {success && (
        <Alert
          type="success"
          message={success}
          dismissible={true}
          onDismiss={() => setSuccess('')}
        />
      )}

      {/* Subscriptions List */}
      {subscriptions.length > 0 ? (
        <div className="space-y-4">
          {subscriptions.map((sub) => (
            <Card key={sub.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Subscription Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-primary-brown">
                        {sub.plan?.name || 'Subscription'}
                      </h3>
                      <p className="text-sm text-neutral-dark-gray">
                        Plan ID: {sub.id}
                      </p>
                    </div>
                    <Badge
                      variant={
                        sub.status === 'active'
                          ? 'success'
                          : sub.status === 'paused'
                            ? 'warning'
                            : 'error'
                      }
                    >
                      {sub.status?.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Price */}
                    <div>
                      <p className="text-xs text-neutral-dark-gray mb-1">
                        Monthly Price
                      </p>
                      <p className="text-lg font-bold text-primary-brown">
                        <PriceDisplay amount={sub.plan?.price || sub.price || 0} />
                      </p>
                    </div>

                    {/* Delivery Days */}
                    <div>
                      <p className="text-xs text-neutral-dark-gray mb-1">
                        Delivery Days
                      </p>
                      <p className="text-sm font-semibold text-primary-brown">
                        {sub.deliveryDays?.length || 0}/week
                      </p>
                      <p className="text-xs text-neutral-dark-gray">
                        {getDeliveryDaysLabel(sub.deliveryDays)}
                      </p>
                    </div>

                    {/* Next Delivery */}
                    <div>
                      <p className="text-xs text-neutral-dark-gray mb-1">
                        Next Delivery
                      </p>
                      <p className="text-sm font-semibold text-primary-brown">
                        {sub.nextDeliveryDate
                          ? new Date(
                              sub.nextDeliveryDate
                            ).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'N/A'}
                      </p>
                    </div>

                    {/* Started Date */}
                    <div>
                      <p className="text-xs text-neutral-dark-gray mb-1">
                        Started
                      </p>
                      <p className="text-sm font-semibold text-primary-brown">
                        {sub.createdAt
                          ? new Date(sub.createdAt).toLocaleDateString(
                              'en-IN',
                              {
                                month: 'short',
                                year: '2-digit',
                              }
                            )
                          : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  {sub.plan?.features && sub.plan.features.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-neutral-light-gray">
                      <p className="text-xs font-semibold text-neutral-dark-gray mb-2">
                        FEATURES
                      </p>
                      <ul className="text-sm text-neutral-dark-gray space-y-1">
                        {sub.plan.features.slice(0, 2).map((feature: string, idx: number) => (
                          <li key={idx}>✓ {feature}</li>
                        ))}
                        {sub.plan.features.length > 2 && (
                          <li>
                            +{sub.plan.features.length - 2} more features
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 md:w-48">
                  {sub.status === 'active' && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openModal('pause', sub)}
                      >
                        ⏸ Pause
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openModal('upgrade', sub)}
                      >
                        ⬆ Upgrade
                      </Button>
                    </>
                  )}

                  {sub.status === 'paused' && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => openModal('resume', sub)}
                      >
                        ▶ Resume
                      </Button>
                    </>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      navigate(`/dashboard/calendar?subscription=${sub.id}`)
                    }
                  >
                    📅 View Calendar
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openModal('cancel', sub)}
                    className="text-semantic-error"
                  >
                    🗑 Cancel
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-neutral-dark-gray mb-4">
            No active subscriptions yet
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/checkout/plans')}
          >
            Browse Plans
          </Button>
        </Card>
      )}

      {/* Modal */}
      {showModal && selectedSub && (
        <Modal isOpen={showModal} onClose={closeModal}>
          <div className="max-w-sm mx-auto">
            {modalType === 'pause' && (
              <div>
                <h3 className="text-lg font-semibold text-primary-brown mb-4">
                  ⏸ Pause Subscription?
                </h3>
                <p className="text-neutral-dark-gray mb-4">
                  Your {selectedSub.plan?.name} subscription will be paused.
                  You won't be charged, and you can resume anytime.
                </p>
                <p className="text-sm text-neutral-dark-gray mb-6">
                  💡 You'll still have access to your dashboard and referral
                  balance.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={closeModal}
                    disabled={processing}
                  >
                    Keep Active
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handlePauseSubscription}
                    isLoading={processing}
                  >
                    Yes, Pause
                  </Button>
                </div>
              </div>
            )}

            {modalType === 'resume' && (
              <div>
                <h3 className="text-lg font-semibold text-primary-brown mb-4">
                  ▶ Resume Subscription?
                </h3>
                <p className="text-neutral-dark-gray mb-4">
                  Your {selectedSub.plan?.name} subscription will be resumed.
                  Deliveries will start from the next available date.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={closeModal}
                    disabled={processing}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleResumeSubscription}
                    isLoading={processing}
                  >
                    Resume Subscription
                  </Button>
                </div>
              </div>
            )}

            {modalType === 'upgrade' && (
              <div>
                <h3 className="text-lg font-semibold text-primary-brown mb-4">
                  ⬆ Upgrade Plan?
                </h3>
                <p className="text-neutral-dark-gray mb-4">
                  Select a new plan to upgrade your subscription.
                </p>
                <p className="text-sm text-neutral-dark-gray mb-6">
                  The price difference will be prorated based on your billing
                  cycle.
                </p>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      closeModal()
                      navigate('/checkout/plans')
                    }}
                  >
                    View Plans
                  </Button>
                </div>
              </div>
            )}

            {modalType === 'cancel' && (
              <div>
                <h3 className="text-lg font-semibold text-semantic-error mb-4">
                  🗑 Cancel Subscription?
                </h3>
                <p className="text-neutral-dark-gray mb-2">
                  This action cannot be undone. Your subscription will be
                  immediately cancelled.
                </p>
                <p className="text-sm text-neutral-dark-gray mb-6">
                  ⚠️ Your referral balance will remain in your account and you
                  can withdraw it anytime.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={closeModal}
                    disabled={processing}
                  >
                    Keep Subscription
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleCancelSubscription}
                    isLoading={processing}
                    className="bg-semantic-error hover:bg-semantic-error/90"
                  >
                    Cancel Subscription
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Help Section */}
      <Card className="bg-gradient-to-r from-primary-gold/5 to-primary-copper/5 border border-primary-gold/20">
        <h4 className="font-semibold text-primary-brown mb-2">❓ Need Help?</h4>
        <p className="text-sm text-neutral-dark-gray mb-3">
          Questions about pausing, resuming, or upgrading your subscription?
        </p>
        <Button variant="ghost" size="sm">
          Contact Support
        </Button>
      </Card>
    </div>
  )
}
