import { postAPI, getAPI } from '@/lib/api'

export interface CreateAddOnsOrderPayload {
  addOns: Array<{
    id: string
    quantity: number
  }>
  dates: number[]
  subtotal: number
  tax: number
  promoCode?: string
  promoDiscount: number
  referralDiscount: number
  total: number
}

export const addonsCheckoutService = {
  /**
   * Create add-ons order
   */
  createOrder: async (payload: CreateAddOnsOrderPayload, token?: string) => {
    return postAPI('/api/addons/create', payload, token)
  },

  /**
   * Verify payment
   */
  verifyPayment: async (
    payload: {
      razorpayOrderId: string
      razorpayPaymentId: string
      razorpaySignature: string
    },
    token?: string
  ) => {
    return postAPI('/api/payments/verify', payload, token)
  },

  /**
   * Get order details
   */
  getOrder: async (orderId: string, token?: string) => {
    return getAPI(`/api/orders/${orderId}`, token)
  },

  /**
   * Validate promo code
   */
  validatePromo: async (code: string, subtotal: number) => {
    return postAPI('/api/promo/validate', { code, subtotal })
  },

  /**
   * Get referral balance
   */
  getReferralBalance: async (token?: string) => {
    return getAPI('/api/user/referral', token)
  },

  /**
   * Get user subscription (to verify they have an active subscription)
   */
  getUserSubscription: async (token?: string) => {
    return getAPI('/api/subs/my-subscription', token)
  },

  /**
   * Get available add-ons
   */
  getAddOns: async (token?: string) => {
    return getAPI('/api/user/config/add-ons', token)
  },
}
