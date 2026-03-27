import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  LoadingSpinner,
  Alert,
  Badge,
  PriceDisplay,
  PageHeader,
} from '@/components'
import { getAPI } from '@/lib/api'

interface Order {
  id: string
  type: 'subscription' | 'addon'
  title: string
  items: string[]
  amount: number
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  orderDate: string
  deliveryDate?: string
}

interface OrdersData {
  orders: Order[]
  hasMore: boolean
  total: number
}

export const OrderHistory: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string>('')
  const [orders, setOrders] = useState<Order[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<'all' | 'subscription' | 'addon'>('all')

  const pageSize = 10

  useEffect(() => {
    loadOrders(true)
  }, [filter])

  const loadOrders = async (reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true)
        setPage(1)
      } else {
        setLoadingMore(true)
      }

      const token = sessionStorage.getItem('authToken')
      if (!token) {
        navigate('/login')
        return
      }

      const typeParam =
        filter === 'all' ? '' : `&type=${filter}`
      const currentPage = reset ? 1 : page + 1

      const response = await getAPI<OrdersData>(
        `/api/orders/history?page=${currentPage}&limit=${pageSize}${typeParam}`,
        token
      )

      if (response.success && response.data) {
        if (reset) {
          setOrders(response.data?.orders || [])
        } else {
          setOrders((prev) => [...prev, ...(response.data?.orders || [])])
        }
        setHasMore(response.data?.hasMore || false)
        setPage(currentPage)
      } else {
        setError('Failed to load order history')
      }
    } catch (err) {
      setError('Failed to load order history')
      console.error(err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const getStatusBadgeVariant = (
    status: Order['status']
  ): 'success' | 'warning' | 'error' | 'info' => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return 'success'
      case 'pending':
        return 'info'
      case 'cancelled':
        return 'error'
      default:
        return 'warning'
    }
  }

  const getStatusIcon = (status: Order['status']): string => {
    switch (status) {
      case 'confirmed':
        return '✓'
      case 'completed':
        return '✅'
      case 'pending':
        return '⏳'
      case 'cancelled':
        return '✕'
      default:
        return '•'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading order history..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Order History"
        subtitle="View all your past and current orders"
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

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-neutral-light-gray">
        <button
          onClick={() => {
            setFilter('all')
            loadOrders(true)
          }}
          className={`px-4 py-3 font-medium transition-colors ${
            filter === 'all'
              ? 'border-b-2 border-primary-gold text-primary-brown'
              : 'text-neutral-dark-gray hover:text-primary-brown'
          }`}
        >
          All Orders ({orders.length})
        </button>
        <button
          onClick={() => {
            setFilter('subscription')
            loadOrders(true)
          }}
          className={`px-4 py-3 font-medium transition-colors ${
            filter === 'subscription'
              ? 'border-b-2 border-primary-gold text-primary-brown'
              : 'text-neutral-dark-gray hover:text-primary-brown'
          }`}
        >
          Subscriptions
        </button>
        <button
          onClick={() => {
            setFilter('addon')
            loadOrders(true)
          }}
          className={`px-4 py-3 font-medium transition-colors ${
            filter === 'addon'
              ? 'border-b-2 border-primary-gold text-primary-brown'
              : 'text-neutral-dark-gray hover:text-primary-brown'
          }`}
        >
          Add-ons
        </button>
      </div>

      {/* Orders List */}
      {orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() =>
                navigate(`/dashboard/orders/${order.id}`)
              }
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl">
                      {order.type === 'subscription' ? '📦' : '🎁'}
                    </span>
                    <div>
                      <h4 className="font-semibold text-primary-brown">
                        {order.title}
                      </h4>
                      <p className="text-xs text-neutral-dark-gray">
                        Order ID: {order.id}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    {/* Order Date */}
                    <div>
                      <p className="text-xs text-neutral-dark-gray mb-1">
                        Ordered
                      </p>
                      <p className="text-sm font-semibold text-primary-brown">
                        {new Date(order.orderDate).toLocaleDateString(
                          'en-IN',
                          {
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </p>
                    </div>

                    {/* Delivery Date */}
                    {order.deliveryDate && (
                      <div>
                        <p className="text-xs text-neutral-dark-gray mb-1">
                          Delivery
                        </p>
                        <p className="text-sm font-semibold text-primary-brown">
                          {new Date(order.deliveryDate).toLocaleDateString(
                            'en-IN',
                            {
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </p>
                      </div>
                    )}

                    {/* Items Count */}
                    <div>
                      <p className="text-xs text-neutral-dark-gray mb-1">
                        Items
                      </p>
                      <p className="text-sm font-semibold text-primary-brown">
                        {order.items.length}
                      </p>
                    </div>

                    {/* Amount */}
                    <div>
                      <p className="text-xs text-neutral-dark-gray mb-1">
                        Amount
                      </p>
                      <p className="text-lg font-bold text-primary-gold">
                        <PriceDisplay amount={order.amount} />
                      </p>
                    </div>
                  </div>

                  {/* Items Preview */}
                  {order.items.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-neutral-light-gray">
                      <p className="text-xs font-semibold text-neutral-dark-gray mb-2">
                        ITEMS
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-neutral-light-gray text-primary-brown px-2 py-1 rounded"
                          >
                            {item}
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-xs bg-neutral-light-gray text-primary-brown px-2 py-1 rounded">
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Status & Action */}
                <div className="flex flex-col items-end gap-2 md:w-48">
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {getStatusIcon(order.status)} {order.status.toUpperCase()}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/dashboard/orders/${order.id}`)
                    }}
                  >
                    View Details →
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <span className="text-4xl mb-4 block">📭</span>
          <p className="text-neutral-dark-gray mb-4">
            No orders yet
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/checkout/plans')}
          >
            Start Subscription
          </Button>
        </Card>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="secondary"
            onClick={() => loadOrders(false)}
            isLoading={loadingMore}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load More Orders'}
          </Button>
        </div>
      )}

      {/* Summary Stats */}
      {orders.length > 0 && (
        <Card className="bg-gradient-to-r from-primary-gold/5 to-primary-copper/5">
          <h4 className="font-semibold text-primary-brown mb-4">Order Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-neutral-dark-gray mb-1">
                Total Orders
              </p>
              <p className="text-2xl font-bold text-primary-brown">
                {orders.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-dark-gray mb-1">
                Total Spent
              </p>
              <p className="text-2xl font-bold text-primary-gold">
                <PriceDisplay
                  amount={orders.reduce((sum, o) => sum + o.amount, 0)}
                />
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-dark-gray mb-1">
                Completed Orders
              </p>
              <p className="text-2xl font-bold text-semantic-success">
                {orders.filter((o) => o.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Help Section */}
      <Card className="bg-gradient-to-r from-primary-gold/5 to-primary-copper/5 border border-primary-gold/20">
        <h4 className="font-semibold text-primary-brown mb-2">
          📚 Need Help?
        </h4>
        <p className="text-sm text-neutral-dark-gray mb-3">
          Looking for details about a specific order?
        </p>
        <Button variant="ghost" size="sm">
          Contact Support
        </Button>
      </Card>
    </div>
  )
}
