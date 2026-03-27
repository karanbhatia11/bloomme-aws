import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  LoadingSpinner,
  Alert,
  PageHeader,
  Modal,
} from '@/components'
import { getAPI, postAPI } from '@/lib/api'
import type { User } from '@/lib/types'

interface SettingsData {
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

export const AccountSettings: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')

  // Notification states
  const [orderUpdates, setOrderUpdates] = useState(true)
  const [promotions, setPromotions] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [sms, setSms] = useState(false)

  // Modal states
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const token = sessionStorage.getItem('authToken')
      if (!token) {
        navigate('/login')
        return
      }

      const response = await getAPI<SettingsData>(
        '/api/user/settings',
        token
      )

      if (response.success && response.data) {
        const data = response.data
        setName(data.user.name || '')
        setEmail(data.user.email || '')
        setPhone(data.user.phone || '')
        setStreet(data.address?.street || '')
        setCity(data.address?.city || '')
        setState(data.address?.state || '')
        setZipCode(data.address?.zipCode || '')

        setOrderUpdates(data.notifications?.orderUpdates ?? true)
        setPromotions(data.notifications?.promotions ?? true)
        setWeeklyDigest(data.notifications?.weeklyDigest ?? true)
        setSms(data.notifications?.sms ?? false)
      } else {
        setError('Failed to load settings')
      }
    } catch (err) {
      setError('Failed to load settings')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!name || !email || !phone) {
      setError('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const token = sessionStorage.getItem('authToken')
      const response = await postAPI(
        '/api/user/profile/update',
        {
          name,
          email,
          phone,
        },
        token || ''
      )

      if (response.success) {
        setSuccess('Profile updated successfully!')
        setError('')
      } else {
        setError(response.error?.message || 'Failed to update profile')
      }
    } catch (err) {
      setError('Failed to update profile')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAddress = async () => {
    if (!street || !city || !state || !zipCode) {
      setError('Please fill in all address fields')
      return
    }

    setSaving(true)
    try {
      const token = sessionStorage.getItem('authToken')
      const response = await postAPI(
        '/api/user/address/update',
        {
          street,
          city,
          state,
          zipCode,
        },
        token || ''
      )

      if (response.success) {
        setSuccess('Address updated successfully!')
        setError('')
      } else {
        setError(response.error?.message || 'Failed to update address')
      }
    } catch (err) {
      setError('Failed to update address')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    setSaving(true)
    try {
      const token = sessionStorage.getItem('authToken')
      const response = await postAPI(
        '/api/user/notifications/update',
        {
          orderUpdates,
          promotions,
          weeklyDigest,
          sms,
        },
        token || ''
      )

      if (response.success) {
        setSuccess('Notification preferences updated!')
        setError('')
      } else {
        setError(
          response.error?.message || 'Failed to update notifications'
        )
      }
    } catch (err) {
      setError('Failed to update notifications')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('user')
    navigate('/login')
  }

  const handleDeleteAccount = async () => {
    setSaving(true)
    try {
      const token = sessionStorage.getItem('authToken')
      const response = await postAPI(
        '/api/user/account/delete',
        {},
        token || ''
      )

      if (response.success) {
        sessionStorage.removeItem('authToken')
        sessionStorage.removeItem('user')
        navigate('/')
      } else {
        setError(
          response.error?.message || 'Failed to delete account'
        )
      }
    } catch (err) {
      setError('Failed to delete account')
      console.error(err)
    } finally {
      setSaving(false)
      setShowDeleteModal(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading settings..." />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <PageHeader
        title="Account Settings"
        subtitle="Manage your profile, address, and preferences"
      />

      {/* Alerts */}
      {error && (
        <Alert
          type="error"
          message={error}
          dismissible={true}
          onDismiss={() => setError('')}
        />
      )}

      {success && (
        <Alert
          type="success"
          message={success}
          dismissible={true}
          onDismiss={() => setSuccess('')}
        />
      )}

      {/* Profile Section */}
      <Card>
        <h3 className="text-lg font-semibold text-primary-brown mb-4">
          👤 Personal Information
        </h3>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-primary-brown mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold"
              placeholder="Your full name"
              disabled={saving}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-primary-brown mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold"
              placeholder="your@email.com"
              disabled={saving}
            />
            <p className="text-xs text-neutral-dark-gray mt-1">
              Used for login and order updates
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-primary-brown mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold"
              placeholder="+91 XXXXX XXXXX"
              disabled={saving}
            />
          </div>

          <Button
            variant="primary"
            onClick={handleSaveProfile}
            isLoading={saving}
            disabled={saving}
          >
            Save Profile
          </Button>
        </div>
      </Card>

      {/* Address Section */}
      <Card>
        <h3 className="text-lg font-semibold text-primary-brown mb-4">
          📍 Delivery Address
        </h3>

        <div className="space-y-4">
          {/* Street */}
          <div>
            <label className="block text-sm font-semibold text-primary-brown mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold"
              placeholder="123 Main Street, Apt 4B"
              disabled={saving}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-primary-brown mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold"
                placeholder="Faridabad"
                disabled={saving}
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-semibold text-primary-brown mb-1">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold"
                placeholder="Haryana"
                disabled={saving}
              />
            </div>
          </div>

          {/* ZIP Code */}
          <div>
            <label className="block text-sm font-semibold text-primary-brown mb-1">
              PIN Code
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold"
              placeholder="121001"
              disabled={saving}
            />
          </div>

          <Button
            variant="primary"
            onClick={handleSaveAddress}
            isLoading={saving}
            disabled={saving}
          >
            Save Address
          </Button>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <h3 className="text-lg font-semibold text-primary-brown mb-4">
          🔔 Notification Preferences
        </h3>

        <div className="space-y-4">
          {/* Order Updates */}
          <div className="flex items-center justify-between p-3 border border-neutral-light-gray rounded-lg">
            <div>
              <p className="font-semibold text-primary-brown">
                📦 Order Updates
              </p>
              <p className="text-xs text-neutral-dark-gray">
                Get notified about order status changes
              </p>
            </div>
            <input
              type="checkbox"
              checked={orderUpdates}
              onChange={(e) => setOrderUpdates(e.target.checked)}
              className="w-5 h-5 rounded border-neutral-light-gray"
              disabled={saving}
            />
          </div>

          {/* Promotions */}
          <div className="flex items-center justify-between p-3 border border-neutral-light-gray rounded-lg">
            <div>
              <p className="font-semibold text-primary-brown">
                🎉 Promotions & Offers
              </p>
              <p className="text-xs text-neutral-dark-gray">
                Receive exclusive deals and special offers
              </p>
            </div>
            <input
              type="checkbox"
              checked={promotions}
              onChange={(e) => setPromotions(e.target.checked)}
              className="w-5 h-5 rounded border-neutral-light-gray"
              disabled={saving}
            />
          </div>

          {/* Weekly Digest */}
          <div className="flex items-center justify-between p-3 border border-neutral-light-gray rounded-lg">
            <div>
              <p className="font-semibold text-primary-brown">
                📰 Weekly Digest
              </p>
              <p className="text-xs text-neutral-dark-gray">
                Get a weekly summary of your subscriptions
              </p>
            </div>
            <input
              type="checkbox"
              checked={weeklyDigest}
              onChange={(e) => setWeeklyDigest(e.target.checked)}
              className="w-5 h-5 rounded border-neutral-light-gray"
              disabled={saving}
            />
          </div>

          {/* SMS */}
          <div className="flex items-center justify-between p-3 border border-neutral-light-gray rounded-lg">
            <div>
              <p className="font-semibold text-primary-brown">
                💬 SMS Notifications
              </p>
              <p className="text-xs text-neutral-dark-gray">
                Important updates via SMS
              </p>
            </div>
            <input
              type="checkbox"
              checked={sms}
              onChange={(e) => setSms(e.target.checked)}
              className="w-5 h-5 rounded border-neutral-light-gray"
              disabled={saving}
            />
          </div>

          <Button
            variant="primary"
            onClick={handleSaveNotifications}
            isLoading={saving}
            disabled={saving}
          >
            Save Preferences
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-semantic-error/20 bg-semantic-error/5">
        <h3 className="text-lg font-semibold text-semantic-error mb-4">
          ⚠️ Account Actions
        </h3>

        <div className="space-y-3">
          {/* Logout */}
          <Button
            variant="secondary"
            onClick={() => setShowLogoutModal(true)}
            className="w-full justify-center"
          >
            🚪 Logout from All Devices
          </Button>

          {/* Delete Account */}
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(true)}
            className="w-full justify-center text-semantic-error"
          >
            🗑 Delete Account
          </Button>
        </div>

        <p className="text-xs text-neutral-dark-gray mt-4">
          💡 <strong>Note:</strong> Deleting your account is permanent and cannot be
          undone. You will lose all data including referral balance.
        </p>
      </Card>

      {/* Help Section */}
      <Card className="bg-gradient-to-r from-primary-gold/5 to-primary-copper/5 border border-primary-gold/20">
        <h4 className="font-semibold text-primary-brown mb-2">
          ❓ Need Help?
        </h4>
        <p className="text-sm text-neutral-dark-gray mb-3">
          Have questions about your account or settings?
        </p>
        <Button variant="ghost" size="sm">
          Contact Support
        </Button>
      </Card>

      {/* Logout Modal */}
      {showLogoutModal && (
        <Modal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
        >
          <div className="max-w-sm mx-auto">
            <h3 className="text-lg font-semibold text-primary-brown mb-4">
              🚪 Logout?
            </h3>

            <p className="text-neutral-dark-gray mb-6">
              You will be logged out from all devices. You'll need to sign in
              again to access your account.
            </p>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowLogoutModal(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShowLogoutModal(false)
                  handleLogout()
                }}
                isLoading={saving}
              >
                Yes, Logout
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
        >
          <div className="max-w-sm mx-auto">
            <h3 className="text-lg font-semibold text-semantic-error mb-4">
              🗑 Delete Account?
            </h3>

            <p className="text-neutral-dark-gray mb-2">
              This action is <strong>permanent</strong> and cannot be undone.
            </p>

            <p className="text-sm text-neutral-dark-gray mb-6">
              You will lose:
            </p>

            <ul className="text-sm text-neutral-dark-gray space-y-1 mb-6">
              <li>✕ All subscription and order history</li>
              <li>✕ Your referral balance and earnings</li>
              <li>✕ Saved addresses and payment methods</li>
              <li>✕ Account preferences and settings</li>
            </ul>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowDeleteModal(false)}
                disabled={saving}
              >
                Keep Account
              </Button>
              <Button
                variant="primary"
                onClick={handleDeleteAccount}
                isLoading={saving}
                className="bg-semantic-error hover:bg-semantic-error/90"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
