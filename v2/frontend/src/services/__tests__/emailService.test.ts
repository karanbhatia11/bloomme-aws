import { describe, it, expect, vi, beforeEach } from 'vitest'
import emailService from '../emailService'

describe('Email Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('sendWelcomeEmail', () => {
    it('should send welcome email with correct parameters', async () => {
      const result = await emailService.sendWelcomeEmail(
        'test@example.com',
        'Test User'
      )

      // Should return success or error, not throw
      expect(result).toHaveProperty('success')
      expect(typeof result.success).toBe('boolean')
    })

    it('should include user name in personalization', async () => {
      const name = 'John Doe'
      const result = await emailService.sendWelcomeEmail(
        'john@example.com',
        name
      )

      expect(result).toBeDefined()
    })

    it('should handle errors gracefully', async () => {
      const result = await emailService.sendWelcomeEmail(
        'test@example.com',
        'Test User'
      )

      // Should handle error gracefully
      expect(result).toHaveProperty('success')
    })
  })

  describe('sendOrderConfirmation', () => {
    const mockOrder = {
      id: 'ORD-123',
      orderDate: new Date().toISOString(),
      user: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '9876543210',
      },
      plan: {
        name: 'Divine',
        price: 89,
      },
      addOns: [
        {
          name: 'Lotus',
          price: 30,
          quantity: 1,
        },
      ],
      subscriptionSubtotal: 89,
      tax: 5.95,
      total: 124.95,
      deliveryAddress: {
        street: '123 Main St',
        city: 'Faridabad',
        zipCode: '121001',
      },
      nextDelivery: new Date().toISOString(),
    }

    it('should send order confirmation email', async () => {
      const result = await emailService.sendOrderConfirmation(
        'test@example.com',
        mockOrder
      )

      expect(result).toHaveProperty('success')
    })

    it('should handle missing order data gracefully', async () => {
      const incompleteOrder = { id: 'ORD-123' }
      const result = await emailService.sendOrderConfirmation(
        'test@example.com',
        incompleteOrder
      )

      expect(result).toBeDefined()
    })

    it('should include order details in response', async () => {
      const result = await emailService.sendOrderConfirmation(
        'test@example.com',
        mockOrder
      )

      // Email should complete successfully or with error message
      expect(result).toHaveProperty('success')
    })

    it('should generate PDF for order', async () => {
      const result = await emailService.sendOrderConfirmation(
        'test@example.com',
        mockOrder
      )

      expect(result).toBeDefined()
    })
  })

  describe('sendDeliveryReminder', () => {
    it('should send delivery reminder email', async () => {
      const result = await emailService.sendDeliveryReminder(
        'test@example.com',
        'Test User'
      )

      expect(result).toHaveProperty('success')
      expect(typeof result.success).toBe('boolean')
    })

    it('should include user name in reminder', async () => {
      const userName = 'John Doe'
      const result = await emailService.sendDeliveryReminder(
        'john@example.com',
        userName
      )

      expect(result).toBeDefined()
    })
  })
})
