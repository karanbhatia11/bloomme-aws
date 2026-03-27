/**
 * Checkout Utilities
 * Helper functions for checkout flow calculations and validations
 */

export interface PriceCalculation {
  planPrice: number
  addOnsTotal: number
  subtotal: number
  discount: number
  tax: number
  total: number
}

/**
 * Calculate order total with tax and discounts
 */
export const calculateOrderTotal = (
  planPrice: number,
  planQuantity: number = 1,
  addOnsTotal: number = 0,
  discountAmount: number = 0,
  taxRate: number = 0.05
): PriceCalculation => {
  const planSubtotal = planPrice * planQuantity
  const subtotal = planSubtotal + addOnsTotal
  const subtotalAfterDiscount = subtotal - discountAmount
  const tax = Math.round(subtotalAfterDiscount * taxRate * 100) / 100
  const total = subtotalAfterDiscount + tax

  return {
    planPrice: planSubtotal,
    addOnsTotal,
    subtotal,
    discount: discountAmount,
    tax,
    total,
  }
}

/**
 * Format date to readable string
 */
export const formatDate = (date: Date | string, format: 'short' | 'long' = 'short'): string => {
  const d = typeof date === 'string' ? new Date(date) : date

  if (format === 'short') {
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Get delivery dates for a month based on selected days
 */
export const getDeliveryDatesForMonth = (
  month: number,
  year: number,
  selectedDays: number[]
): Date[] => {
  const dates: Date[] = []
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const weekday = date.getDay()

    if (selectedDays.includes(weekday)) {
      dates.push(date)
    }
  }

  return dates
}

/**
 * Get weekday name from date
 */
export const getWeekdayName = (date: Date | number): string => {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  if (typeof date === 'number') {
    return weekdays[date]
  }

  return weekdays[date.getDay()]
}

/**
 * Validate promo code format
 */
export const validatePromoCodeFormat = (code: string): boolean => {
  // Promo code should be alphanumeric, 3-20 characters
  const promoRegex = /^[A-Z0-9]{3,20}$/i
  return promoRegex.test(code)
}

/**
 * Validate email format
 */
export const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone format (10 digits for India)
 */
export const validatePhoneFormat = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

/**
 * Calculate number of days between two dates
 */
export const daysBetween = (date1: Date | string, date2: Date | string): number => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2

  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

/**
 * Get next delivery date based on selected days and current date
 */
export const getNextDeliveryDate = (selectedDays: number[]): Date => {
  const today = new Date()
  let nextDate = new Date(today)

  // Check today first
  if (selectedDays.includes(today.getDay())) {
    return nextDate
  }

  // Check next 7 days
  for (let i = 1; i <= 7; i++) {
    nextDate = new Date(today)
    nextDate.setDate(nextDate.getDate() + i)

    if (selectedDays.includes(nextDate.getDay())) {
      return nextDate
    }
  }

  // Fallback to tomorrow
  nextDate = new Date(today)
  nextDate.setDate(nextDate.getDate() + 1)
  return nextDate
}

/**
 * Get month and year from date
 */
export const getMonthYear = (date: Date | string): { month: number; year: number } => {
  const d = typeof date === 'string' ? new Date(date) : date
  return {
    month: d.getMonth(),
    year: d.getFullYear(),
  }
}

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  if (currency === 'INR') {
    return `₹${amount.toFixed(0)}`
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Parse query parameters from URL
 */
export const getQueryParam = (param: string): string | null => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(param)
}

/**
 * Scroll to element
 */
export const scrollToElement = (elementId: string): void => {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

/**
 * Check if user is on mobile device
 */
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(later, wait)
  }
}

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Merge objects
 */
export const mergeObjects = <T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T => {
  return { ...target, ...source }
}

/**
 * Get page header meta tags
 */
export const getPageMeta = (page: string): { title: string; description: string } => {
  const meta = {
    plans: {
      title: 'Subscription Plans | Bloomme',
      description: 'Choose your perfect flower subscription plan',
    },
    delivery: {
      title: 'Select Delivery Days | Bloomme',
      description: 'Choose when you want your flowers delivered',
    },
    addons: {
      title: 'Add Extras | Bloomme',
      description: 'Enhance your flower subscription with add-ons',
    },
    review: {
      title: 'Review Your Order | Bloomme',
      description: 'Review your subscription before checkout',
    },
    payment: {
      title: 'Secure Payment | Bloomme',
      description: 'Complete your order with secure payment',
    },
    confirmation: {
      title: 'Order Confirmed | Bloomme',
      description: 'Your subscription is now active',
    },
  }

  return meta[page as keyof typeof meta] || { title: 'Bloomme', description: '' }
}
