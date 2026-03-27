/**
 * Add-ons Checkout Utilities
 * Helper functions for add-ons checkout flow
 */

/**
 * Calculate price per date
 */
export const calculatePricePerDate = (
  addOns: Array<{ price: number; quantity: number }>,
  daysCount: number
): number => {
  const totalPerDay = addOns.reduce((sum, ao) => sum + ao.price * ao.quantity, 0)
  return totalPerDay * daysCount
}

/**
 * Format dates for display
 */
export const formatDatesForDisplay = (dates: number[]): string => {
  if (dates.length === 0) return 'No dates selected'
  if (dates.length <= 5) return `Days ${dates.join(', ')}`
  return `${dates.length} days selected`
}

/**
 * Validate add-ons order
 */
export const validateAddOnsOrder = (
  addOns: any[],
  dates: number[]
): { valid: boolean; error?: string } => {
  if (addOns.length === 0) {
    return { valid: false, error: 'Please select at least one add-on' }
  }

  if (dates.length === 0) {
    return { valid: false, error: 'Please select at least one delivery date' }
  }

  return { valid: true }
}

/**
 * Calculate add-ons order summary
 */
export const calculateAddOnsOrderSummary = (
  addOns: Array<{ price: number; quantity: number }>,
  daysCount: number,
  promoDiscount: number = 0,
  referralDiscount: number = 0,
  taxRate: number = 0.05
) => {
  const subtotal = addOns.reduce((sum, ao) => sum + ao.price * ao.quantity, 0) * daysCount
  const beforeDiscount = subtotal - promoDiscount - referralDiscount
  const tax = beforeDiscount * taxRate
  const total = beforeDiscount + tax

  return { subtotal, beforeDiscount, tax, total }
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
 * Check if user can order add-ons (must have active subscription)
 */
export const canOrderAddOns = (subscription: any): boolean => {
  return subscription && subscription.status === 'active'
}

/**
 * Get next delivery date from selected dates
 */
export const getNextDeliveryFromDates = (selectedDates: number[], currentDate: Date = new Date()): Date => {
  const today = currentDate
  let nextDate = new Date(today)

  // Check today first
  if (selectedDates.includes(today.getDate())) {
    return nextDate
  }

  // Check next 31 days
  for (let i = 1; i <= 31; i++) {
    nextDate = new Date(today)
    nextDate.setDate(nextDate.getDate() + i)

    if (selectedDates.includes(nextDate.getDate())) {
      return nextDate
    }
  }

  // Fallback to tomorrow
  nextDate = new Date(today)
  nextDate.setDate(nextDate.getDate() + 1)
  return nextDate
}

/**
 * Convert add-ons data to session storage format
 */
export const serializeAddOnsData = (data: any): string => {
  return JSON.stringify(data)
}

/**
 * Parse add-ons data from session storage
 */
export const deserializeAddOnsData = (data: string): any => {
  try {
    return JSON.parse(data)
  } catch (err) {
    console.error('Failed to parse add-ons data', err)
    return null
  }
}

/**
 * Clear all add-ons checkout session data
 */
export const clearAddOnsCheckoutSession = (): void => {
  sessionStorage.removeItem('addonsCheckoutAddOns')
  sessionStorage.removeItem('addonsCheckoutDates')
  sessionStorage.removeItem('addonsCheckoutOrder')
  sessionStorage.removeItem('addonsCheckoutType')
}

/**
 * Get all add-ons checkout session data
 */
export const getAddOnsCheckoutSession = () => {
  const addOns = sessionStorage.getItem('addonsCheckoutAddOns')
  const dates = sessionStorage.getItem('addonsCheckoutDates')
  const order = sessionStorage.getItem('addonsCheckoutOrder')
  const type = sessionStorage.getItem('addonsCheckoutType')

  return {
    addOns: addOns ? JSON.parse(addOns) : null,
    dates: dates ? JSON.parse(dates) : null,
    order: order ? JSON.parse(order) : null,
    type,
  }
}
