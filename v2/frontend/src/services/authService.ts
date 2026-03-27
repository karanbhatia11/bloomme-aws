import { postAPI } from '@/lib/api'
import type { ApiResponse, User } from '@/lib/types'
import emailService from './emailService'

interface SignupPayload {
  name: string
  email: string
  phone: string
  password: string
}

interface AuthResponse {
  token: string
  user: User
}

export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await postAPI<AuthResponse>('/api/auth/login', {
      email,
      password,
    })

    // Store token in session storage
    if (response.success && response.data?.token) {
      sessionStorage.setItem('authToken', response.data.token)
      sessionStorage.setItem('user', JSON.stringify(response.data.user))
    }

    return response
  },

  signup: async (payload: SignupPayload): Promise<ApiResponse<AuthResponse>> => {
    const response = await postAPI<AuthResponse>('/api/auth/signup', payload)

    // Store token in session storage
    if (response.success && response.data?.token) {
      sessionStorage.setItem('authToken', response.data.token)
      sessionStorage.setItem('user', JSON.stringify(response.data.user))

      // Send welcome email in background (don't wait for it)
      // This ensures signup completes immediately, email sends asynchronously
      emailService
        .sendWelcomeEmail(payload.email, payload.name)
        .then((result) => {
          if (result.success) {
            console.log('✅ Welcome email sent to:', payload.email)
          } else {
            console.warn('⚠️ Welcome email failed:', result.error)
          }
        })
        .catch((err) => {
          console.error('❌ Email service error:', err)
          // Don't throw - email failure shouldn't affect signup
        })
    }

    return response
  },

  logout: () => {
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('user')
  },

  getToken: (): string | null => {
    return sessionStorage.getItem('authToken')
  },

  getUser: (): User | null => {
    const user = sessionStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  isLoggedIn: (): boolean => {
    return !!sessionStorage.getItem('authToken')
  },
}
