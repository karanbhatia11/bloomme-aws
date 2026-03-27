import { getAPI, postAPI } from '@/lib/api'
import type { ApiResponse, SubscriptionPlan, AddOn } from '@/lib/types'

interface ValidatePromoResponse {
  valid: boolean
  discountAmount?: number
  discountPercent?: number
  message: string
}

interface ReferralBalanceResponse {
  balance: number
  totalEarned: number
  code: string
}

interface CreateOrderPayload {
  planId: string
  deliveryDays: number[]
  addOns: { id: string; quantity: number }[]
  promoCode?: string
  referralCode?: string
  guestEmail?: string
  guestPhone?: string
}

interface CreateOrderResponse {
  orderId: string
  razorpayOrderId: string
  amount: number
  currency: string
}

interface VerifyPaymentPayload {
  orderId: string
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
}

interface VerifyPaymentResponse {
  success: boolean
  orderId: string
  status: 'paid' | 'failed'
}

export const checkoutService = {
  // Plans
  getPlans: async (): Promise<ApiResponse<SubscriptionPlan[]>> => {
    return getAPI('/api/config/plans')
  },

  // Add-ons
  getAddOns: async (): Promise<ApiResponse<AddOn[]>> => {
    return getAPI('/api/user/config/add-ons')
  },

  // Promo Code Validation
  validatePromoCode: async (code: string): Promise<ApiResponse<ValidatePromoResponse>> => {
    return postAPI('/api/promo/validate', { code })
  },

  // Referral Balance
  getReferralBalance: async (token: string): Promise<ApiResponse<ReferralBalanceResponse>> => {
    return getAPI('/api/user/referral', token)
  },

  // Create Order (for payment)
  createOrder: async (
    payload: CreateOrderPayload,
    token?: string
  ): Promise<ApiResponse<CreateOrderResponse>> => {
    return postAPI('/api/payments/create', payload, token)
  },

  // Verify Payment
  verifyPayment: async (
    payload: VerifyPaymentPayload,
    token?: string
  ): Promise<ApiResponse<VerifyPaymentResponse>> => {
    return postAPI('/api/payments/verify', payload, token)
  },

  // Get Order Confirmation
  getOrderConfirmation: async (
    orderId: string,
    token?: string
  ): Promise<ApiResponse<any>> => {
    return getAPI(`/api/orders/${orderId}`, token)
  },

  // Create Subscription
  createSubscription: async (
    payload: {
      planId: string
      deliveryDays: number[]
      addOns: { id: string; quantity: number }[]
      promoCode?: string
      referralCode?: string
    },
    token?: string
  ): Promise<ApiResponse<{ subscriptionId: string }>> => {
    return postAPI('/api/subs/subscribe', payload, token)
  },
}
