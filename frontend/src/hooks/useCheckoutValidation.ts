import { useState, useCallback } from 'react'
import { validateEmailFormat, validatePhoneFormat, validatePromoCodeFormat } from '@/lib/checkoutUtils'

export interface ValidationError {
  [key: string]: string
}

/**
 * Hook for form validation in checkout
 */
export const useCheckoutValidation = () => {
  const [errors, setErrors] = useState<ValidationError>({})

  const validateEmail = useCallback((email: string): boolean => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: 'Email is required' }))
      return false
    }

    if (!validateEmailFormat(email)) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email' }))
      return false
    }

    setErrors((prev) => {
      const { email: _, ...rest } = prev
      return rest
    })

    return true
  }, [])

  const validatePhone = useCallback((phone: string): boolean => {
    if (!phone) {
      setErrors((prev) => ({ ...prev, phone: 'Phone number is required' }))
      return false
    }

    if (!validatePhoneFormat(phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: 'Please enter a valid 10-digit phone number',
      }))
      return false
    }

    setErrors((prev) => {
      const { phone: _, ...rest } = prev
      return rest
    })

    return true
  }, [])

  const validatePromoCode = useCallback((code: string): boolean => {
    if (!code) {
      setErrors((prev) => ({ ...prev, promoCode: 'Promo code is required' }))
      return false
    }

    if (!validatePromoCodeFormat(code)) {
      setErrors((prev) => ({
        ...prev,
        promoCode: 'Invalid promo code format',
      }))
      return false
    }

    setErrors((prev) => {
      const { promoCode: _, ...rest } = prev
      return rest
    })

    return true
  }, [])

  const validatePassword = useCallback((password: string): boolean => {
    if (!password) {
      setErrors((prev) => ({ ...prev, password: 'Password is required' }))
      return false
    }

    if (password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: 'Password must be at least 6 characters',
      }))
      return false
    }

    setErrors((prev) => {
      const { password: _, ...rest } = prev
      return rest
    })

    return true
  }, [])

  const validatePasswordConfirm = useCallback(
    (password: string, confirmPassword: string): boolean => {
      if (!confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: 'Please confirm your password' }))
        return false
      }

      if (password !== confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: 'Passwords do not match',
        }))
        return false
      }

      setErrors((prev) => {
        const { confirmPassword: _, ...rest } = prev
        return rest
      })

      return true
    },
    []
  )

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
  }, [])

  const clearAllErrors = useCallback(() => {
    setErrors({})
  }, [])

  const getError = useCallback((field: string): string | undefined => {
    return errors[field]
  }, [errors])

  const hasErrors = useCallback((): boolean => {
    return Object.keys(errors).length > 0
  }, [errors])

  return {
    errors,
    validateEmail,
    validatePhone,
    validatePromoCode,
    validatePassword,
    validatePasswordConfirm,
    clearError,
    clearAllErrors,
    getError,
    hasErrors,
  }
}
