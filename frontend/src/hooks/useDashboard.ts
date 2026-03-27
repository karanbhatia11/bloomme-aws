import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAPI } from '@/lib/api'
import { dashboardService } from '@/services/dashboardService'
import type { Subscription, User } from '@/lib/types'

/**
 * Hook for managing dashboard data with caching
 */
export const useDashboardData = () => {
  const [user, setUser] = useState<User | null>(null)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const loadData = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('authToken')
      if (!token) return

      // Check cache first
      const cachedUser = dashboardService.getCachedData<User>('user')
      const cachedSubs = dashboardService.getCachedData<Subscription[]>('subscriptions')

      if (cachedUser && cachedSubs) {
        setUser(cachedUser)
        setSubscriptions(cachedSubs)
        setLoading(false)
        return
      }

      // Fetch fresh data
      const userResponse = await getAPI<{ user: User }>('/api/user/profile', token)
      const subsResponse = await getAPI<{ subscriptions: Subscription[] }>(
        '/api/subs/my-subscriptions',
        token
      )

      if (userResponse.success && userResponse.data?.user) {
        setUser(userResponse.data.user)
        dashboardService.setCachedData('user', userResponse.data.user)
      }

      if (subsResponse.success && subsResponse.data?.subscriptions) {
        setSubscriptions(subsResponse.data.subscriptions)
        dashboardService.setCachedData(
          'subscriptions',
          subsResponse.data.subscriptions
        )
      }
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  return { user, subscriptions, loading, error, loadData, setError }
}

/**
 * Hook for managing subscriptions
 */
export const useSubscriptions = () => {
  const navigate = useNavigate()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const loadSubscriptions = useCallback(async () => {
    try {
      setLoading(true)
      const token = sessionStorage.getItem('authToken')
      if (!token) {
        navigate('/login')
        return
      }

      const subs = await dashboardService.getSubscriptions(token)
      if (subs) {
        setSubscriptions(subs)
        dashboardService.setCachedData('subscriptions', subs)
      }
    } catch (err) {
      setError('Failed to load subscriptions')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const pauseSubscription = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const token = sessionStorage.getItem('authToken')
        if (!token) return false

        const success = await dashboardService.pauseSubscription(id, token)
        if (success) {
          // Refresh subscriptions
          await loadSubscriptions()
        }
        return success
      } catch {
        return false
      }
    },
    [loadSubscriptions]
  )

  const resumeSubscription = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const token = sessionStorage.getItem('authToken')
        if (!token) return false

        const success = await dashboardService.resumeSubscription(id, token)
        if (success) {
          await loadSubscriptions()
        }
        return success
      } catch {
        return false
      }
    },
    [loadSubscriptions]
  )

  const cancelSubscription = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const token = sessionStorage.getItem('authToken')
        if (!token) return false

        const success = await dashboardService.cancelSubscription(id, token)
        if (success) {
          await loadSubscriptions()
        }
        return success
      } catch {
        return false
      }
    },
    [loadSubscriptions]
  )

  return {
    subscriptions,
    loading,
    error,
    loadSubscriptions,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    setError,
  }
}

/**
 * Hook for managing add-ons
 */
export const useAddOns = () => {
  const navigate = useNavigate()
  const [addOns, setAddOns] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const loadAddOns = useCallback(async () => {
    try {
      setLoading(true)
      const token = sessionStorage.getItem('authToken')
      if (!token) {
        navigate('/login')
        return
      }

      const aos = await dashboardService.getActiveAddOns(token)
      if (aos) {
        setAddOns(aos)
        dashboardService.setCachedData('addons', aos)
      }
    } catch (err) {
      setError('Failed to load add-ons')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const updateQuantity = useCallback(
    async (id: string, quantity: number): Promise<boolean> => {
      try {
        const token = sessionStorage.getItem('authToken')
        if (!token) return false

        const success = await dashboardService.updateAddOnQuantity(
          id,
          quantity,
          token
        )
        if (success) {
          await loadAddOns()
        }
        return success
      } catch {
        return false
      }
    },
    [loadAddOns]
  )

  const updateDeliveryDates = useCallback(
    async (id: string, dates: number[]): Promise<boolean> => {
      try {
        const token = sessionStorage.getItem('authToken')
        if (!token) return false

        const success = await dashboardService.updateAddOnDeliveryDates(
          id,
          dates,
          token
        )
        if (success) {
          await loadAddOns()
        }
        return success
      } catch {
        return false
      }
    },
    [loadAddOns]
  )

  const removeAddOn = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const token = sessionStorage.getItem('authToken')
        if (!token) return false

        const success = await dashboardService.removeAddOn(id, token)
        if (success) {
          await loadAddOns()
        }
        return success
      } catch {
        return false
      }
    },
    [loadAddOns]
  )

  return {
    addOns,
    loading,
    error,
    loadAddOns,
    updateQuantity,
    updateDeliveryDates,
    removeAddOn,
    setError,
  }
}

/**
 * Hook for managing referrals
 */
export const useReferrals = () => {
  const navigate = useNavigate()
  const [referralData, setReferralData] = useState<any>(null)
  const [referrals, setReferrals] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const loadReferralData = useCallback(async () => {
    try {
      setLoading(true)
      const token = sessionStorage.getItem('authToken')
      if (!token) {
        navigate('/login')
        return
      }

      const data = await dashboardService.getReferralOverview(token)
      const refs = await dashboardService.getReferrals(token)

      if (data) setReferralData(data)
      if (refs) setReferrals(refs)
    } catch (err) {
      setError('Failed to load referral data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const withdraw = useCallback(
    async (
      amount: number,
      method: 'bank' | 'upi'
    ): Promise<boolean> => {
      try {
        const token = sessionStorage.getItem('authToken')
        if (!token) return false

        const success = await dashboardService.withdrawReferralBalance(
          amount,
          method,
          token
        )
        if (success) {
          await loadReferralData()
        }
        return success
      } catch {
        return false
      }
    },
    [loadReferralData]
  )

  return {
    referralData,
    referrals,
    loading,
    error,
    loadReferralData,
    withdraw,
    setError,
  }
}

/**
 * Hook for managing account settings
 */
export const useAccountSettings = () => {
  const navigate = useNavigate()
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true)
      const token = sessionStorage.getItem('authToken')
      if (!token) {
        navigate('/login')
        return
      }

      const data = await dashboardService.getUserSettings(token)
      if (data) {
        setSettings(data)
      }
    } catch (err) {
      setError('Failed to load settings')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const updateProfile = useCallback(
    async (data: {
      name: string
      email: string
      phone: string
    }): Promise<boolean> => {
      try {
        const token = sessionStorage.getItem('authToken')
        if (!token) return false

        const success = await dashboardService.updateProfile(data, token)
        if (success) {
          await loadSettings()
        }
        return success
      } catch {
        return false
      }
    },
    [loadSettings]
  )

  const updateAddress = useCallback(
    async (data: {
      street: string
      city: string
      state: string
      zipCode: string
    }): Promise<boolean> => {
      try {
        const token = sessionStorage.getItem('authToken')
        if (!token) return false

        const success = await dashboardService.updateAddress(data, token)
        if (success) {
          await loadSettings()
        }
        return success
      } catch {
        return false
      }
    },
    [loadSettings]
  )

  const updateNotifications = useCallback(
    async (data: {
      orderUpdates: boolean
      promotions: boolean
      weeklyDigest: boolean
      sms: boolean
    }): Promise<boolean> => {
      try {
        const token = sessionStorage.getItem('authToken')
        if (!token) return false

        return await dashboardService.updateNotifications(data, token)
      } catch {
        return false
      }
    },
    []
  )

  const deleteAccount = useCallback(async (): Promise<boolean> => {
    try {
      const token = sessionStorage.getItem('authToken')
      if (!token) return false

      return await dashboardService.deleteAccount(token)
    } catch {
      return false
    }
  }, [])

  return {
    settings,
    loading,
    error,
    loadSettings,
    updateProfile,
    updateAddress,
    updateNotifications,
    deleteAccount,
    setError,
  }
}

/**
 * Hook for authentication check
 */
export const useAuthCheck = () => {
  const navigate = useNavigate()

  const isAuthenticated = useCallback((): boolean => {
    const token = sessionStorage.getItem('authToken')
    return !!token
  }, [])

  const requireAuth = useCallback(() => {
    if (!isAuthenticated()) {
      navigate('/login')
      return false
    }
    return true
  }, [navigate, isAuthenticated])

  return { isAuthenticated, requireAuth }
}

/**
 * Hook for data caching management
 */
export const useCacheManager = () => {
  const clearCache = useCallback((key?: string) => {
    dashboardService.clearCache(key)
  }, [])

  const isCacheValid = useCallback((key: string): boolean => {
    return dashboardService.isCacheValid(key)
  }, [])

  return { clearCache, isCacheValid }
}
