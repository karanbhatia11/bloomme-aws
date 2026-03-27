import { getAPI, postAPI } from '@/lib/api'
import type { Subscription, User } from '@/lib/types'

interface DashboardStats {
  activeSubscriptions: number
  upcomingDeliveries: number
  totalSpentThisMonth: number
  referralBalance: number
}

interface SubscriptionOverview {
  subscriptions: Subscription[]
}

interface AddOnOverview {
  addOns: Array<{
    id: string
    name: string
    quantity: number
    price: number
    totalPrice: number
    deliveryDates: number[]
  }>
}

interface OrderHistoryResponse {
  orders: Array<{
    id: string
    type: 'subscription' | 'addon'
    title: string
    items: string[]
    amount: number
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
    orderDate: string
    deliveryDate?: string
  }>
  hasMore: boolean
  total: number
}

interface ReferralOverview {
  code: string
  balance: number
  totalEarnings: number
  referralCount: number
  minWithdrawal: number
}

interface CalendarData {
  deliveries: Array<{
    date: number
    type: 'subscription' | 'addon'
    items: string[]
  }>
}

interface ReferralsListData {
  referrals: Referral[]
  total: number
}

interface Referral {
  id: string
  referredName: string
  referredEmail: string
  status: 'pending' | 'confirmed' | 'completed'
  earnedAmount: number
  referralDate: string
}

interface UserSettings {
  user: User
  notifications: {
    orderUpdates: boolean
    promotions: boolean
    weeklyDigest: boolean
    sms: boolean
  }
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
}

export const dashboardService = {
  // Overview
  getDashboardStats: async (token: string): Promise<DashboardStats | null> => {
    try {
      const response = await getAPI<DashboardStats>(
        '/api/dashboard/stats',
        token
      )
      return response.success ? response.data || null : null
    } catch {
      return null
    }
  },

  // Subscriptions
  getSubscriptions: async (
    token: string
  ): Promise<Subscription[] | null> => {
    try {
      const response = await getAPI<SubscriptionOverview>(
        '/api/subs/my-subscriptions',
        token
      )
      return response.success ? response.data?.subscriptions || null : null
    } catch {
      return null
    }
  },

  pauseSubscription: async (
    subscriptionId: string,
    token: string
  ): Promise<boolean> => {
    try {
      const response = await postAPI(
        `/api/subs/${subscriptionId}/pause`,
        {},
        token
      )
      return response.success
    } catch {
      return false
    }
  },

  resumeSubscription: async (
    subscriptionId: string,
    token: string
  ): Promise<boolean> => {
    try {
      const response = await postAPI(
        `/api/subs/${subscriptionId}/resume`,
        {},
        token
      )
      return response.success
    } catch {
      return false
    }
  },

  cancelSubscription: async (
    subscriptionId: string,
    token: string
  ): Promise<boolean> => {
    try {
      const response = await postAPI(
        `/api/subs/${subscriptionId}/cancel`,
        {},
        token
      )
      return response.success
    } catch {
      return false
    }
  },

  // Add-ons
  getActiveAddOns: async (token: string): Promise<any[] | null> => {
    try {
      const response = await getAPI<AddOnOverview>(
        '/api/addons/my-addons',
        token
      )
      return response.success ? response.data?.addOns || null : null
    } catch {
      return null
    }
  },

  updateAddOnQuantity: async (
    addOnId: string,
    quantity: number,
    token: string
  ): Promise<boolean> => {
    try {
      const response = await postAPI(
        `/api/addons/${addOnId}/quantity`,
        { quantity },
        token
      )
      return response.success
    } catch {
      return false
    }
  },

  updateAddOnDeliveryDates: async (
    addOnId: string,
    deliveryDates: number[],
    token: string
  ): Promise<boolean> => {
    try {
      const response = await postAPI(
        `/api/addons/${addOnId}/delivery-dates`,
        { deliveryDates },
        token
      )
      return response.success
    } catch {
      return false
    }
  },

  removeAddOn: async (addOnId: string, token: string): Promise<boolean> => {
    try {
      const response = await postAPI(
        `/api/addons/${addOnId}/remove`,
        {},
        token
      )
      return response.success
    } catch {
      return false
    }
  },

  // Calendar
  getCalendarData: async (
    month: number,
    year: number,
    token: string
  ): Promise<CalendarData | null> => {
    try {
      const response = await getAPI<CalendarData>(
        `/api/calendar/my-deliveries?month=${month}&year=${year}`,
        token
      )
      return response.success ? response.data || null : null
    } catch {
      return null
    }
  },

  // Orders
  getOrderHistory: async (
    page: number,
    limit: number,
    type?: 'subscription' | 'addon',
    token?: string
  ): Promise<OrderHistoryResponse | null> => {
    try {
      const typeParam = type ? `&type=${type}` : ''
      const response = await getAPI<OrderHistoryResponse>(
        `/api/orders/history?page=${page}&limit=${limit}${typeParam}`,
        token || ''
      )
      return response.success ? response.data || null : null
    } catch {
      return null
    }
  },

  getOrderDetails: async (
    orderId: string,
    token: string
  ): Promise<any | null> => {
    try {
      const response = await getAPI(`/api/orders/${orderId}`, token)
      return response.success ? response.data || null : null
    } catch {
      return null
    }
  },

  // Referrals
  getReferralOverview: async (token: string): Promise<ReferralOverview | null> => {
    try {
      const response = await getAPI<ReferralOverview>(
        '/api/referrals/overview',
        token
      )
      return response.success ? response.data || null : null
    } catch {
      return null
    }
  },

  getReferrals: async (token: string): Promise<any[] | null> => {
    try {
      const response = await getAPI<ReferralsListData>('/api/referrals/list', token)
      return response.success && response.data ? response.data.referrals || null : null
    } catch {
      return null
    }
  },

  withdrawReferralBalance: async (
    amount: number,
    method: 'bank' | 'upi',
    token: string
  ): Promise<boolean> => {
    try {
      const response = await postAPI(
        '/api/referrals/withdraw',
        { amount, method },
        token
      )
      return response.success
    } catch {
      return false
    }
  },

  // Settings
  getUserSettings: async (token: string): Promise<UserSettings | null> => {
    try {
      const response = await getAPI<UserSettings>(
        '/api/user/settings',
        token
      )
      return response.success ? response.data || null : null
    } catch {
      return null
    }
  },

  updateProfile: async (
    data: { name: string; email: string; phone: string },
    token: string
  ): Promise<boolean> => {
    try {
      const response = await postAPI(
        '/api/user/profile/update',
        data,
        token
      )
      return response.success
    } catch {
      return false
    }
  },

  updateAddress: async (
    data: {
      street: string
      city: string
      state: string
      zipCode: string
    },
    token: string
  ): Promise<boolean> => {
    try {
      const response = await postAPI(
        '/api/user/address/update',
        data,
        token
      )
      return response.success
    } catch {
      return false
    }
  },

  updateNotifications: async (
    data: {
      orderUpdates: boolean
      promotions: boolean
      weeklyDigest: boolean
      sms: boolean
    },
    token: string
  ): Promise<boolean> => {
    try {
      const response = await postAPI(
        '/api/user/notifications/update',
        data,
        token
      )
      return response.success
    } catch {
      return false
    }
  },

  deleteAccount: async (token: string): Promise<boolean> => {
    try {
      const response = await postAPI(
        '/api/user/account/delete',
        {},
        token
      )
      return response.success
    } catch {
      return false
    }
  },

  // Caching helpers
  getCachedData: <T,>(key: string): T | null => {
    try {
      const cached = sessionStorage.getItem(`dashboard_${key}`)
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  },

  setCachedData: <T,>(key: string, data: T, ttlSeconds: number = 300) => {
    try {
      sessionStorage.setItem(
        `dashboard_${key}`,
        JSON.stringify({
          data,
          timestamp: Date.now() + ttlSeconds * 1000,
        })
      )
    } catch {
      // Silently fail
    }
  },

  isCacheValid: (key: string): boolean => {
    try {
      const cached = sessionStorage.getItem(`dashboard_${key}`)
      if (!cached) return false
      const { timestamp } = JSON.parse(cached)
      return timestamp > Date.now()
    } catch {
      return false
    }
  },

  clearCache: (key?: string) => {
    try {
      if (key) {
        sessionStorage.removeItem(`dashboard_${key}`)
      } else {
        // Clear all dashboard cache
        Object.keys(sessionStorage).forEach((k) => {
          if (k.startsWith('dashboard_')) {
            sessionStorage.removeItem(k)
          }
        })
      }
    } catch {
      // Silently fail
    }
  },
}
