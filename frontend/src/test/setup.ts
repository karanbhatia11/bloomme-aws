import { afterEach, vi, beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock localStorage with actual storage capability
const createStorageMock = () => {
  const store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      Object.keys(store).forEach((key) => delete store[key])
    },
  }
}

global.localStorage = createStorageMock() as any
global.sessionStorage = createStorageMock() as any

// Mock fetch
global.fetch = vi.fn()

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})

// Mock environment variables
process.env.VITE_RESEND_API_KEY = 'test-key-12345'
process.env.VITE_RAZORPAY_KEY = 'test-razorpay-key'
process.env.VITE_API_URL = 'http://localhost:3001'
