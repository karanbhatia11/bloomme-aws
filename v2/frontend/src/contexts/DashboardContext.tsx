import React, { createContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { Subscription, User } from '@/lib/types'

interface DashboardContextType {
  // User Data
  user: User | null
  setUser: (user: User | null) => void

  // Subscription Data
  subscriptions: Subscription[]
  setSubscriptions: (subs: Subscription[]) => void
  activeSubscriptionId: string | null
  setActiveSubscriptionId: (id: string | null) => void

  // UI State
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  currentTab: string
  setCurrentTab: (tab: string) => void

  // Refresh Functions
  refreshUser: () => Promise<void>
  refreshSubscriptions: () => Promise<void>
  refreshAll: () => Promise<void>

  // Cache Control
  invalidateCache: (type: 'user' | 'subscriptions' | 'all') => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
)

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // User State
  const [user, setUser] = useState<User | null>(null)

  // Subscription State
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [activeSubscriptionId, setActiveSubscriptionId] = useState<
    string | null
  >(null)

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== 'undefined' && window.innerWidth > 1024
  )
  const [currentTab, setCurrentTab] = useState('overview')

  // Refresh Functions
  const refreshUser = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('authToken')
      if (!token) return

      // This would call your API
      // const response = await getAPI('/api/user/profile', token)
      // if (response.success && response.data?.user) {
      //   setUser(response.data.user)
      // }
    } catch (err) {
      console.error('Failed to refresh user:', err)
    }
  }, [])

  const refreshSubscriptions = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('authToken')
      if (!token) return

      // This would call your API
      // const response = await getAPI('/api/subs/my-subscriptions', token)
      // if (response.success && response.data?.subscriptions) {
      //   setSubscriptions(response.data.subscriptions)
      // }
    } catch (err) {
      console.error('Failed to refresh subscriptions:', err)
    }
  }, [])

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshUser(), refreshSubscriptions()])
  }, [refreshUser, refreshSubscriptions])

  const invalidateCache = useCallback(
    (type: 'user' | 'subscriptions' | 'all') => {
      if (type === 'user' || type === 'all') {
        setUser(null)
      }
      if (type === 'subscriptions' || type === 'all') {
        setSubscriptions([])
      }
    },
    []
  )

  const value: DashboardContextType = {
    user,
    setUser,
    subscriptions,
    setSubscriptions,
    activeSubscriptionId,
    setActiveSubscriptionId,
    sidebarOpen,
    setSidebarOpen,
    currentTab,
    setCurrentTab,
    refreshUser,
    refreshSubscriptions,
    refreshAll,
    invalidateCache,
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = (): DashboardContextType => {
  const context = React.useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider')
  }
  return context
}
