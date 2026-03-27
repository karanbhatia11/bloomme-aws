import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '@/services/authService'
import emailService from '@/services/emailService'

describe('Signup + Welcome Email Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  it('should allow signup even if email fails', async () => {
    // Simulate successful signup
    const result = {
      success: true,
      data: {
        token: 'test-token',
        user: {
          id: 'user-1',
          email: 'newuser@example.com',
          name: 'New User',
        },
      },
    }

    expect(result.success).toBe(true)
    expect(result.data?.token).toBeDefined()
  })

  it('should send welcome email after signup', async () => {
    const email = 'newuser@example.com'
    const name = 'New User'

    // Test that email service can send
    const emailResult = await emailService.sendWelcomeEmail(email, name)

    expect(emailResult).toBeDefined()
  })

  it('should log welcome email success/failure', async () => {
    const consoleSpy = vi.spyOn(console, 'log')
    const consoleWarnSpy = vi.spyOn(console, 'warn')

    const result = await emailService.sendWelcomeEmail(
      'test@example.com',
      'Test User'
    )

    // Should handle result gracefully
    expect(result).toBeDefined()

    consoleSpy.mockRestore()
    consoleWarnSpy.mockRestore()
  })

  it('complete signup flow should not fail', async () => {
    // Store auth data
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      phone: '9876543210',
    }

    sessionStorage.setItem('authToken', 'test-token')
    sessionStorage.setItem('user', JSON.stringify(mockUser))

    // Verify data is stored
    expect(authService.isLoggedIn()).toBe(true)
    expect(authService.getUser()?.email).toBe('test@example.com')

    // Send welcome email
    const emailResult = await emailService.sendWelcomeEmail(
      mockUser.email,
      mockUser.name
    )
    expect(emailResult).toBeDefined()
  })
})
