import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Button, LoadingSpinner, Container } from '@/components'
import { getAPI } from '@/lib/api'
import type { User, Subscription } from '@/lib/types'

interface NavItem {
  id: string
  label: string
  icon: string
  path: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: '🏠', path: '/dashboard' },
  { id: 'subscriptions', label: 'Subscriptions', icon: '📦', path: '/dashboard/subscriptions' },
  { id: 'addons', label: 'Add-ons', icon: '➕', path: '/dashboard/addons' },
  { id: 'calendar', label: 'Calendar', icon: '📅', path: '/dashboard/calendar' },
  { id: 'history', label: 'History', icon: '📜', path: '/dashboard/history' },
  { id: 'referrals', label: 'Referrals', icon: '🎁', path: '/dashboard/referrals' },
  { id: 'settings', label: 'Settings', icon: '⚙️', path: '/dashboard/settings' },
]

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== 'undefined' && window.innerWidth > 1024
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [user, setUser] = useState<User | null>(null)
  const [hasSubscription, setHasSubscription] = useState(false)

  // Verify authentication and subscription on mount
  useEffect(() => {
    verifyAccess()
  }, [])

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false) // Close on mobile
      } else if (window.innerWidth > 1024) {
        setSidebarOpen(true) // Open on desktop
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const verifyAccess = async () => {
    try {
      // Check authentication
      const token = sessionStorage.getItem('authToken')
      if (!token) {
        navigate('/login')
        return
      }

      // Check if user has active subscription
      const subResponse = await getAPI<{ subscriptions: Subscription[] }>(
        '/api/subs/my-subscriptions',
        token
      )
      if (!subResponse.success || !subResponse.data?.subscriptions?.length) {
        // No subscription - redirect to checkout
        navigate('/checkout/plans')
        return
      }

      // Get user profile
      const userResponse = await getAPI<{ user: User }>('/api/user/profile', token)
      if (userResponse.success && userResponse.data?.user) {
        setUser(userResponse.data.user)
        setHasSubscription(true)
      } else {
        setError('Failed to load user profile')
      }
    } catch (err) {
      setError('Failed to verify access')
      console.error(err)
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('user')
    navigate('/login')
  }

  const getActiveNavItem = (path: string) => {
    return window.location.pathname.includes(path.split('/dashboard')[1] || '')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-off-white">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    )
  }

  if (error || !hasSubscription) {
    return (
      <Container>
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold text-primary-brown mb-4">
            {error || 'Dashboard unavailable'}
          </h1>
          <p className="text-neutral-dark-gray mb-6">
            {error ? 'Please try again later' : 'You need an active subscription to access the dashboard'}
          </p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Go Home
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <div className="flex min-h-screen bg-neutral-off-white">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 left-0 h-screen ${
          sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
        } bg-white border-r border-neutral-light-gray transition-all duration-300 flex flex-col z-50 lg:z-auto`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-neutral-light-gray flex-shrink-0">
          <div className="text-2xl font-bold text-primary-brown">
            {sidebarOpen ? '🌸 Bloomme' : '🌸'}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = getActiveNavItem(item.path)
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path)
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false)
                  }
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-gold bg-opacity-10 text-primary-brown font-semibold'
                    : 'text-neutral-dark-gray hover:bg-neutral-light-gray'
                }`}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-6 border-t border-neutral-light-gray space-y-3 flex-shrink-0">
          {sidebarOpen && user && (
            <div className="text-sm">
              <p className="font-semibold text-primary-brown truncate">
                {user.name || 'User'}
              </p>
              <p className="text-xs text-neutral-dark-gray truncate">
                {user.email}
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-center"
          >
            {sidebarOpen ? 'Logout' : '🚪'}
          </Button>
        </div>

        {/* Sidebar Toggle - Desktop Only */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:block p-4 hover:bg-neutral-light-gray transition-colors text-center border-t border-neutral-light-gray"
        >
          {sidebarOpen ? '←' : '→'}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-4 hover:bg-neutral-light-gray transition-colors text-center border-t border-neutral-light-gray text-xl"
        >
          ✕
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-auto">
        <div className="p-4 md:p-8">
          {/* Mobile Header with Hamburger */}
          <div className="lg:hidden flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary-brown">Bloomme</h2>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-neutral-light-gray rounded-lg text-2xl"
            >
              ☰
            </button>
          </div>

          {/* Page Content */}
          <Outlet />
        </div>
      </main>
    </div>
  )
}
