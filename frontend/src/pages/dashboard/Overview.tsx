import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  LoadingSpinner,
  Alert,
  Badge,
  PriceDisplay,
} from '@/components'
import { getAPI } from '@/lib/api'
import type { Subscription } from '@/lib/types'

interface SubscriptionData {
  subscriptions: Subscription[]
}

interface AddOnsData {
  addOns: Array<{
    id: string
    name: string
    quantity: number
    price: number
    totalPrice: number
    deliveryDates: number[]
  }>
}

export const DashboardOverview: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [activeAddOns, setActiveAddOns] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalSpentThisMonth: 0,
    upcomingDeliveries: 0,
    activeSubscriptions: 0,
    referralBalance: 0,
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const token = sessionStorage.getItem('authToken')
      if (!token) {
        navigate('/login')
        return
      }

      // Fetch subscriptions
      const subResponse = await getAPI<SubscriptionData>(
        '/api/subs/my-subscriptions',
        token
      )
      if (subResponse.success && subResponse.data?.subscriptions) {
        setSubscriptions(subResponse.data.subscriptions)
      }

      // Fetch active add-ons
      const addOnsResponse = await getAPI<AddOnsData>(
        '/api/addons/my-addons',
        token
      )
      if (addOnsResponse.success && addOnsResponse.data?.addOns) {
        setActiveAddOns(addOnsResponse.data.addOns)
      }

      // Fetch referral balance
      const referralResponse = await getAPI<{ balance: number }>(
        '/api/referrals/balance',
        token
      )
      if (referralResponse.success && referralResponse.data?.balance) {
        setStats((prev) => ({
          ...prev,
          referralBalance: referralResponse.data?.balance || 0,
        }))
      }

      // Fetch spending data
      const spendingResponse = await getAPI<{ totalSpent: number }>(
        '/api/orders/spending-this-month',
        token
      )
      if (
        spendingResponse.success &&
        spendingResponse.data?.totalSpent !== undefined
      ) {
        setStats((prev) => ({
          ...prev,
          totalSpentThisMonth: spendingResponse.data?.totalSpent || 0,
        }))
      }

      // Calculate stats
      setStats((prev) => ({
        ...prev,
        activeSubscriptions: subResponse.data?.subscriptions?.length || 0,
        upcomingDeliveries: calculateUpcomingDeliveries(
          subResponse.data?.subscriptions || []
        ),
      }))
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const calculateUpcomingDeliveries = (subs: Subscription[]): number => {
    // Count upcoming deliveries in next 7 days
    const today = new Date()
    let count = 0

    subs.forEach((sub) => {
      // Simple calculation based on delivery days
      if (sub.deliveryDays && sub.deliveryDays.length > 0) {
        // Count days this week that match delivery days
        for (let i = 0; i < 7; i++) {
          const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000)
          const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc
          if (sub.deliveryDays.includes(dayOfWeek)) {
            count++
          }
        }
      }
    })

    return count
  }

  const getPrimarySubscription = (): Subscription | null => {
    if (subscriptions.length === 0) return null
    // Return the first active subscription
    return subscriptions.find((s) => s.status === 'active') || subscriptions[0]
  }

  const getTotalAddOnsSpend = (): number => {
    return activeAddOns.reduce((sum, ao) => sum + ao.totalPrice, 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    )
  }

  const primarySub = getPrimarySubscription()
  const totalAddOnsSpend = getTotalAddOnsSpend()

  return (
    <div className="space-y-8">
      {/* Error Alert */}
      {error && (
        <Alert
          type="error"
          message={error}
          dismissible={true}
          onDismiss={() => setError('')}
        />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Subscriptions */}
        <Card className="bg-gradient-to-br from-primary-gold/5 to-transparent">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-dark-gray mb-1">
                Active Subscriptions
              </p>
              <p className="text-3xl font-bold text-primary-brown">
                {stats.activeSubscriptions}
              </p>
            </div>
            <span className="text-3xl">📦</span>
          </div>
          <p className="text-xs text-neutral-dark-gray mt-2">
            {stats.activeSubscriptions === 1
              ? '1 active plan'
              : `${stats.activeSubscriptions} active plans`}
          </p>
        </Card>

        {/* Upcoming Deliveries */}
        <Card className="bg-gradient-to-br from-semantic-success/5 to-transparent">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-dark-gray mb-1">
                Upcoming Deliveries
              </p>
              <p className="text-3xl font-bold text-semantic-success">
                {stats.upcomingDeliveries}
              </p>
            </div>
            <span className="text-3xl">📅</span>
          </div>
          <p className="text-xs text-neutral-dark-gray mt-2">
            Next 7 days
          </p>
        </Card>

        {/* Spent This Month */}
        <Card className="bg-gradient-to-br from-primary-copper/5 to-transparent">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-dark-gray mb-1">
                Spent This Month
              </p>
              <div className="text-2xl font-bold text-primary-copper">
                <PriceDisplay amount={stats.totalSpentThisMonth} />
              </div>
            </div>
            <span className="text-3xl">💰</span>
          </div>
          <p className="text-xs text-neutral-dark-gray mt-2">
            Updated today
          </p>
        </Card>

        {/* Referral Balance */}
        <Card className="bg-gradient-to-br from-primary-gold/5 to-transparent">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-dark-gray mb-1">
                Referral Balance
              </p>
              <div className="text-2xl font-bold text-primary-gold">
                <PriceDisplay amount={stats.referralBalance} />
              </div>
            </div>
            <span className="text-3xl">🎁</span>
          </div>
          <p className="text-xs text-neutral-dark-gray mt-2">
            Ready to withdraw
          </p>
        </Card>
      </div>

      {/* Main Subscription Card */}
      {primarySub ? (
        <Card className="bg-gradient-to-r from-primary-gold/10 to-primary-copper/5">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-primary-brown mb-1">
                {primarySub.plan?.name || 'Subscription'}
              </h2>
              <p className="text-neutral-dark-gray">
                {primarySub.deliveryDays?.length || 0} days per week
              </p>
            </div>
            <Badge
              variant={primarySub.status === 'active' ? 'success' : 'warning'}
            >
              {primarySub.status?.toUpperCase()}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-neutral-light-gray">
            <div>
              <p className="text-xs text-neutral-dark-gray mb-1">Monthly Cost</p>
              <p className="text-xl font-bold text-primary-brown">
                <PriceDisplay amount={primarySub.plan?.price || primarySub.price || 0} />
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-dark-gray mb-1">Status</p>
              <p className="text-sm font-semibold text-primary-brown">
                {primarySub.status === 'active'
                  ? 'Active'
                  : primarySub.status === 'paused'
                    ? 'Paused'
                    : 'Inactive'}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-dark-gray mb-1">
                Delivery Days
              </p>
              <p className="text-sm font-semibold text-primary-brown">
                {primarySub.deliveryDays?.join(', ') || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-dark-gray mb-1">Started</p>
              <p className="text-sm font-semibold text-primary-brown">
                {primarySub.createdAt
                  ? new Date(primarySub.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={() => navigate('/dashboard/subscriptions')}
            >
              Manage Subscription
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/addons/select')}
            >
              + Add More Items
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard/calendar')}
            >
              View Calendar
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="text-center py-8">
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

      {/* Active Add-ons Section */}
      {activeAddOns.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-primary-brown">
              Active Add-ons ({activeAddOns.length})
            </h3>
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard/addons')}
            >
              Manage →
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeAddOns.map((addOn) => (
              <Card
                key={addOn.id}
                className="flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <h4 className="font-semibold text-primary-brown mb-1">
                    {addOn.name}
                  </h4>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-neutral-dark-gray">
                      Quantity: {addOn.quantity}
                    </span>
                    <Badge variant="info">${addOn.price}</Badge>
                  </div>
                  <p className="text-lg font-bold text-primary-gold">
                    <PriceDisplay amount={addOn.totalPrice} />
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-light-gray">
                  <p className="text-xs text-neutral-dark-gray mb-2">
                    Delivery dates:{' '}
                    {addOn.deliveryDates?.length > 0
                      ? `Day ${addOn.deliveryDates.join(', ')}`
                      : 'All days'}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/dashboard/addons')}
                    className="w-full"
                  >
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-4 p-4 bg-semantic-info/10 rounded-lg border border-semantic-info/20">
            <p className="text-sm text-semantic-info">
              💡 <strong>Tip:</strong> Spending ₹
              {totalAddOnsSpend.toFixed(0)} on add-ons this month. Manage
              quantities or delivery dates from the Add-ons section.
            </p>
          </div>
        </div>
      )}

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Add More Add-ons */}
        <Card className="bg-gradient-to-br from-primary-gold/10 to-transparent cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/addons/select')}
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-semibold text-primary-brown mb-2">
                📦 Add More Items
              </h4>
              <p className="text-sm text-neutral-dark-gray">
                Enhance your subscription with fresh flowers, essentials, or
                gifts
              </p>
            </div>
            <span className="text-2xl">➕</span>
          </div>
          <div className="mt-4">
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                navigate('/addons/select')
              }}
            >
              Browse Add-ons
            </Button>
          </div>
        </Card>

        {/* Referral Program */}
        <Card className="bg-gradient-to-br from-semantic-success/10 to-transparent cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/dashboard/referrals')}
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-semibold text-primary-brown mb-2">
                🎁 Share & Earn
              </h4>
              <p className="text-sm text-neutral-dark-gray">
                Invite friends to Bloomme and earn ₹100 per referral
              </p>
            </div>
            <span className="text-2xl">🌟</span>
          </div>
          <div className="mt-4">
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                navigate('/dashboard/referrals')
              }}
            >
              View Referrals
            </Button>
          </div>
        </Card>
      </div>

      {/* Empty State for Add-ons */}
      {activeAddOns.length === 0 && (
        <Card className="bg-gradient-to-r from-neutral-light-gray/20 to-transparent text-center py-8">
          <p className="text-neutral-dark-gray mb-4">
            No add-ons added yet. Enhance your subscription with fresh flowers,
            essentials, or gifts!
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/addons/select')}
          >
            Add Items Now
          </Button>
        </Card>
      )}

      {/* Help Section */}
      <Card className="bg-gradient-to-r from-primary-gold/5 to-primary-copper/5 border border-primary-gold/20">
        <div className="flex items-start gap-3">
          <span className="text-2xl">❓</span>
          <div>
            <h4 className="font-semibold text-primary-brown mb-1">
              Need Help?
            </h4>
            <p className="text-sm text-neutral-dark-gray mb-3">
              Have questions about your subscription, add-ons, or account?
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard/settings')}
              >
                Settings
              </Button>
              <Button variant="ghost" size="sm">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
