import { useState } from 'react'
import { postAPI } from '@/lib/api'

/**
 * Hook for add-ons validation
 */
export const useAddOnsValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateAddOns = (addOns: any[]): boolean => {
    const newErrors: Record<string, string> = {}

    if (addOns.length === 0) {
      newErrors.addOns = 'Select at least one add-on'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateDates = (dates: number[]): boolean => {
    const newErrors: Record<string, string> = {}

    if (dates.length === 0) {
      newErrors.dates = 'Select at least one delivery date'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return { validateAddOns, validateDates, errors }
}

/**
 * Hook for promo code validation in add-ons context
 */
export const useAddOnsPromoCode = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const validatePromo = async (
    code: string,
    subtotal: number
  ): Promise<{ valid: boolean; discount: number }> => {
    setLoading(true)
    setError('')

    try {
      const response = await postAPI<{ valid: boolean; discount: number }>(
        '/api/promo/validate',
        { code, subtotal }
      )

      if (response.success && response.data?.valid) {
        return response.data
      } else {
        setError('Invalid promo code')
        return { valid: false, discount: 0 }
      }
    } catch (err) {
      setError('Could not validate promo code')
      return { valid: false, discount: 0 }
    } finally {
      setLoading(false)
    }
  }

  return { validatePromo, loading, error }
}

/**
 * Hook for add-ons subscription verification
 */
export const useAddOnsSubscriptionCheck = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [hasSubscription, setHasSubscription] = useState(false)

  const checkSubscription = async (token: string): Promise<boolean> => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/subs/my-subscription', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data?.id) {
          setHasSubscription(true)
          return true
        }
      }

      setError('No active subscription found')
      setHasSubscription(false)
      return false
    } catch (err) {
      setError('Failed to verify subscription')
      setHasSubscription(false)
      return false
    } finally {
      setLoading(false)
    }
  }

  return { checkSubscription, loading, error, hasSubscription }
}

/**
 * Hook for referral balance management in add-ons checkout
 */
export const useAddOnsReferral = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [balance, setBalance] = useState(0)

  const getReferralBalance = async (token: string): Promise<number> => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/user/referral', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data?.balance) {
          setBalance(data.data.balance)
          return data.data.balance
        }
      }

      setBalance(0)
      return 0
    } catch (err) {
      setError('Failed to load referral balance')
      setBalance(0)
      return 0
    } finally {
      setLoading(false)
    }
  }

  return { getReferralBalance, loading, error, balance }
}
