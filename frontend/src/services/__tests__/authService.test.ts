import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '../authService'

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  describe('getToken', () => {
    it('should return null when no token stored', () => {
      const token = authService.getToken()
      expect(token).toBeNull()
    })

    it('should return token when stored', () => {
      sessionStorage.setItem('authToken', 'test-token-123')
      const token = authService.getToken()
      expect(token).toBe('test-token-123')
    })
  })

  describe('getUser', () => {
    it('should return null when no user stored', () => {
      const user = authService.getUser()
      expect(user).toBeNull()
    })

    it('should return user object when stored', () => {
      const mockUser = {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        phone: '9876543210',
      }
      sessionStorage.setItem('user', JSON.stringify(mockUser))
      const user = authService.getUser()
      expect(user).toEqual(mockUser)
    })

    it('should return null when user field is empty', () => {
      sessionStorage.setItem('user', '')
      const user = authService.getUser()
      expect(user).toBeNull()
    })
  })

  describe('isLoggedIn', () => {
    it('should return false when no token', () => {
      sessionStorage.removeItem('authToken')
      const isLoggedIn = authService.isLoggedIn()
      expect(isLoggedIn).toBe(false)
    })

    it('should return true when token exists', () => {
      sessionStorage.setItem('authToken', 'test-token')
      const isLoggedIn = authService.isLoggedIn()
      expect(isLoggedIn).toBe(true)
    })
  })

  describe('logout', () => {
    it('should remove auth token and user', () => {
      sessionStorage.setItem('authToken', 'test-token')
      sessionStorage.setItem('user', '{"name":"Test"}')

      authService.logout()

      expect(sessionStorage.getItem('authToken')).toBeNull()
      expect(sessionStorage.getItem('user')).toBeNull()
    })

    it('should work even when nothing is stored', () => {
      expect(() => authService.logout()).not.toThrow()
    })
  })
})
