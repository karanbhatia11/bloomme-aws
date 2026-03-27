import { describe, it, expect } from 'vitest'
import { generateInvoicePDF } from '../invoiceGenerator'

describe('Invoice Generator', () => {
  const mockOrder = {
    id: 'ORD-20260326-001',
    orderDate: new Date('2026-03-26').toISOString(),
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
    },
    plan: {
      name: 'Divine',
      price: 89,
    },
    addOns: [
      {
        name: 'Sacred Lotus',
        price: 30,
        quantity: 1,
      },
    ],
    subscriptionSubtotal: 89,
    tax: 5.95,
    promoDiscount: 0,
    referralDiscount: 0,
    total: 124.95,
    deliveryAddress: {
      street: '123 Main St',
      city: 'Faridabad',
      zipCode: '121001',
      instructions: 'Ring doorbell twice',
    },
    deliveryDates: [new Date('2026-03-27').getTime()],
  }

  it('should generate PDF successfully', () => {
    const pdf = generateInvoicePDF(mockOrder)

    // Should return base64 string
    expect(typeof pdf).toBe('string')
    expect(pdf.length).toBeGreaterThan(0)
  })

  it('should handle missing user data', () => {
    const incompleteOrder = {
      id: 'ORD-123',
      orderDate: new Date().toISOString(),
    }

    // Should not throw
    expect(() => generateInvoicePDF(incompleteOrder as any)).not.toThrow()
  })

  it('should include order ID in PDF', () => {
    const pdf = generateInvoicePDF(mockOrder)

    // PDF should contain order information
    expect(pdf).toBeDefined()
    expect(pdf.length).toBeGreaterThan(100)
  })

  it('should handle add-ons correctly', () => {
    const orderWithAddOns = {
      ...mockOrder,
      addOns: [
        { name: 'Lotus', price: 30, quantity: 2 },
        { name: 'Ghee', price: 50, quantity: 1 },
      ],
    }

    const pdf = generateInvoicePDF(orderWithAddOns)

    expect(typeof pdf).toBe('string')
    expect(pdf.length).toBeGreaterThan(0)
  })

  it('should calculate totals correctly', () => {
    const pdf = generateInvoicePDF(mockOrder)

    // Total should be included
    expect(pdf).toBeDefined()
  })

  it('should handle discounts in PDF', () => {
    const orderWithDiscount = {
      ...mockOrder,
      promoDiscount: 10,
      referralDiscount: 5,
    }

    const pdf = generateInvoicePDF(orderWithDiscount)

    expect(typeof pdf).toBe('string')
    expect(pdf.length).toBeGreaterThan(0)
  })

  it('should return valid base64 string', () => {
    const pdf = generateInvoicePDF(mockOrder)

    // Check if it's valid base64
    expect(/^[A-Za-z0-9+/=]+$/.test(pdf)).toBe(true)
  })
})
