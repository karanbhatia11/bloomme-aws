import type { Subscription } from '@/lib/types'

/**
 * Format currency values for INR
 */
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`
}

/**
 * Format date for display
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format date with day name
 */
export const formatDateWithDay = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Get day name from number (0 = Sunday)
 */
export const getDayName = (dayNumber: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[dayNumber] || 'Unknown'
}

/**
 * Get short day name
 */
export const getShortDayName = (dayNumber: number): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[dayNumber] || '?'
}

/**
 * Get status badge color
 */
export const getStatusColor = (
  status: string
): 'success' | 'warning' | 'error' | 'info' => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'completed':
    case 'confirmed':
      return 'success'
    case 'pending':
    case 'paused':
      return 'warning'
    case 'cancelled':
    case 'failed':
      return 'error'
    default:
      return 'info'
  }
}

/**
 * Calculate upcoming deliveries in next N days
 */
export const getUpcomingDeliveries = (
  subscriptions: Subscription[],
  days: number = 7
): number => {
  const today = new Date()
  let count = 0

  subscriptions.forEach((sub) => {
    if (sub.status !== 'active' || !sub.deliveryDays) return

    for (let i = 0; i < days; i++) {
      const checkDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000)
      const dayOfWeek = checkDate.getDay()

      if (sub.deliveryDays.includes(dayOfWeek)) {
        count++
      }
    }
  })

  return count
}

/**
 * Check if subscription is active
 */
export const isSubscriptionActive = (subscription: Subscription): boolean => {
  return subscription.status === 'active'
}

/**
 * Get formatted delivery days string
 */
export const formatDeliveryDays = (days: number[] | undefined): string => {
  if (!days || days.length === 0) return 'No days set'
  return days.map((d) => getShortDayName(d)).join(', ')
}

/**
 * Get subscription frequency label
 */
export const getFrequencyLabel = (daysPerWeek: number): string => {
  if (daysPerWeek === 1) return 'Once a week'
  if (daysPerWeek === 3) return '3 times a week'
  if (daysPerWeek === 5) return '5 times a week'
  if (daysPerWeek === 7) return 'Daily'
  return `${daysPerWeek} times a week`
}

/**
 * Calculate monthly spend for subscription
 */
export const calculateMonthlySpend = (
  subscriptions: Subscription[]
): number => {
  return subscriptions
    .filter((s) => s.status === 'active')
    .reduce((total, sub) => {
      const price = sub.plan?.price || sub.price || 0
      return total + price
    }, 0)
}

/**
 * Check if referral withdrawal is available
 */
export const canWithdraw = (
  balance: number,
  minWithdrawal: number
): boolean => {
  return balance >= minWithdrawal
}

/**
 * Get time until next delivery
 */
export const getTimeUntilNextDelivery = (
  deliveryDays: number[] | undefined
): string => {
  if (!deliveryDays || deliveryDays.length === 0) return 'No schedule'

  const today = new Date()

  // Find next delivery day
  for (let i = 1; i <= 7; i++) {
    const checkDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000)
    const checkDay = checkDate.getDay()

    if (deliveryDays.includes(checkDay)) {
      if (i === 1) return 'Tomorrow'
      if (i === 0) return 'Today'
      return `in ${i} days`
    }
  }

  return 'Next week'
}

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone format (Indian)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

/**
 * Validate PIN code format
 */
export const isValidPinCode = (pinCode: string): boolean => {
  const pinRegex = /^\d{6}$/
  return pinRegex.test(pinCode)
}

/**
 * Generate referral share message
 */
export const generateReferralMessage = (referralCode: string): string => {
  return `🌸 Join me on Bloomme - Fresh flowers delivered to your doorstep! Use my referral code: ${referralCode} and get special benefits!`
}

/**
 * Get order status icon
 */
export const getOrderStatusIcon = (status: string): string => {
  switch (status.toLowerCase()) {
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

/**
 * Group orders by month
 */
export const groupOrdersByMonth = (orders: any[]): Map<string, any[]> => {
  const grouped = new Map<string, any[]>()

  orders.forEach((order) => {
    const date = new Date(order.orderDate)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    if (!grouped.has(key)) {
      grouped.set(key, [])
    }
    grouped.get(key)!.push(order)
  })

  return grouped
}

/**
 * Calculate total spent from orders
 */
export const calculateTotalSpent = (orders: any[]): number => {
  return orders.reduce((total, order) => {
    if (order.status !== 'cancelled') {
      return total + (order.amount || 0)
    }
    return total
  }, 0)
}

/**
 * Check if date is today
 */
export const isToday = (date: Date | string): boolean => {
  const checkDate = new Date(date)
  const today = new Date()
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  )
}

/**
 * Check if date is in past
 */
export const isPastDate = (date: Date | string): boolean => {
  return new Date(date) < new Date()
}

/**
 * Format time duration
 */
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}
