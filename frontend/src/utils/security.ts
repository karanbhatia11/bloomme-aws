/**
 * Security utilities for input validation and sanitization
 */

/**
 * Sanitize user input to prevent XSS attacks
 * Removes all HTML tags
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return ''
  }
  // Remove HTML tags
  return input
    .replace(/<[^>]*>/g, '')
    .trim()
}

/**
 * Escape HTML special characters
 */
export const escapeHTML = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (char) => map[char])
}

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

/**
 * Validate phone number (Indian format: 10 digits)
 */
export const isValidPhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') {
    return false
  }
  const phoneRegex = /^[0-9]{10}$/
  const digits = phone.replace(/\D/g, '')
  return phoneRegex.test(digits)
}

/**
 * Validate password strength
 * Requirements:
 * - At least 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character
 */
export const isValidPassword = (password: string): boolean => {
  if (!password || password.length < 8) {
    return false
  }

  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

  return hasUppercase && hasLowercase && hasNumber && hasSpecial
}

/**
 * Validate name field (only letters, spaces, and hyphens)
 */
export const isValidName = (name: string): boolean => {
  if (!name || typeof name !== 'string') {
    return false
  }
  const nameRegex = /^[a-zA-Z\s\-']{2,100}$/
  return nameRegex.test(name.trim())
}

/**
 * Secure token storage
 */
export const secureStorage = {
  setToken: (token: string) => {
    // Store in sessionStorage (cleared on browser close)
    try {
      sessionStorage.setItem('authToken', token)
    } catch (e) {
      console.error('Failed to store token:', e)
    }
  },

  getToken: (): string | null => {
    try {
      return sessionStorage.getItem('authToken')
    } catch (e) {
      console.error('Failed to retrieve token:', e)
      return null
    }
  },

  removeToken: () => {
    try {
      sessionStorage.removeItem('authToken')
    } catch (e) {
      console.error('Failed to remove token:', e)
    }
  },

  hasToken: (): boolean => {
    try {
      return !!sessionStorage.getItem('authToken')
    } catch (e) {
      return false
    }
  },
}

/**
 * Get secure API headers with CSRF protection
 */
export const getSecureHeaders = () => {
  const token = secureStorage.getToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    'X-Requested-With': 'XMLHttpRequest', // CSRF protection
  }
}

/**
 * Prevent sensitive field autocomplete
 */
export const disableSensitiveAutocomplete = (element: HTMLInputElement) => {
  if (element) {
    element.setAttribute('autocomplete', 'off')
    element.setAttribute('autocorrect', 'off')
    element.setAttribute('autocapitalize', 'off')
    element.setAttribute('spellcheck', 'false')
  }
}

/**
 * Validate amount (for payment)
 */
export const isValidAmount = (amount: number): boolean => {
  return (
    typeof amount === 'number' &&
    amount > 0 &&
    amount <= 1000000 && // Max 10 lakh rupees
    Number.isFinite(amount)
  )
}

/**
 * Sanitize API response data
 */
export const sanitizeResponseData = (data: any): any => {
  if (typeof data === 'string') {
    return sanitizeInput(data)
  }
  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      return data.map(sanitizeResponseData)
    }
    const sanitized: { [key: string]: any } = {}
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        sanitized[key] = sanitizeResponseData(data[key])
      }
    }
    return sanitized
  }
  return data
}
