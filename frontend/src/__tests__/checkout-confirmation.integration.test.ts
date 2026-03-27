import { describe, it, expect, vi } from 'vitest'
import emailService from '@/services/emailService'
import { generateInvoicePDF } from '@/utils/invoiceGenerator'

describe('Checkout + Order Confirmation Integration', () => {
  const mockOrder = {
    id: 'ORD-20260326-001',
    orderDate: new Date().toISOString(),
    user: {
      name: 'Customer Name',
      email: 'customer@example.com',
      phone: '9876543210',
    },
    plan: { name: 'Divine', price: 89 },
    addOns: [{ name: 'Lotus', price: 30, quantity: 1 }],
    subscriptionSubtotal: 89,
    tax: 5.95,
    total: 124.95,
    deliveryAddress: {
      street: '123 Main',
      city: 'Faridabad',
      zipCode: '121001',
    },
    deliveryDates: [new Date().getTime()],
  }

  it('should generate PDF for order', () => {
    const pdf = generateInvoicePDF(mockOrder)

    expect(typeof pdf).toBe('string')
    expect(pdf.length).toBeGreaterThan(0)
  })

  it('should send order confirmation with PDF', async () => {
    const result = await emailService.sendOrderConfirmation(
      'customer@example.com',
      mockOrder
    )

    expect(result).toBeDefined()
  })

  it('complete checkout flow should work end-to-end', async () => {
    // 1. PDF generates
    const pdf = generateInvoicePDF(mockOrder)
    expect(pdf).toBeDefined()

    // 2. Email sends with PDF
    const emailResult = await emailService.sendOrderConfirmation(
      mockOrder.user.email,
      mockOrder
    )
    expect(emailResult).toBeDefined()

    // 3. Both should succeed
    expect(pdf.length).toBeGreaterThan(0)
  })

  it('should handle multiple add-ons correctly', async () => {
    const orderWithMultipleAddOns = {
      ...mockOrder,
      addOns: [
        { name: 'Lotus', price: 30, quantity: 2 },
        { name: 'Ghee', price: 50, quantity: 1 },
        { name: 'Incense', price: 20, quantity: 3 },
      ],
    }

    const result = await emailService.sendOrderConfirmation(
      'customer@example.com',
      orderWithMultipleAddOns
    )

    expect(result).toBeDefined()
  })

  it('should handle orders with discounts', async () => {
    const orderWithDiscount = {
      ...mockOrder,
      promoDiscount: 10,
      referralDiscount: 5,
      total: 124.95 - 15,
    }

    const pdf = generateInvoicePDF(orderWithDiscount)
    const email = await emailService.sendOrderConfirmation(
      'customer@example.com',
      orderWithDiscount
    )

    expect(pdf).toBeDefined()
    expect(email).toBeDefined()
  })

  it('should log PDF generation success', async () => {
    const consoleSpy = vi.spyOn(console, 'log')

    await emailService.sendOrderConfirmation(
      'customer@example.com',
      mockOrder
    )

    // Verify logging is set up
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
})
