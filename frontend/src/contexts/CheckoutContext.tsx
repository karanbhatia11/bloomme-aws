import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { SubscriptionPlan, AddOn } from '../lib/types'

interface CheckoutState {
  // Step 1: Plan Selection
  selectedPlan: SubscriptionPlan | null
  isGuest: boolean
  guestEmail?: string
  guestPhone?: string
  userToken?: string

  // Step 2: Delivery Selection
  selectedDeliveryDays: number[] // ISO dates or day numbers
  deliveryMonth: number
  deliveryYear: number

  // Step 3: Add-ons Selection
  selectedAddOns: {
    id: string
    quantity: number
    price: number
  }[]

  // Step 4: Order Review
  promoCode?: string
  promoDiscount: number
  referralCode?: string
  referralDiscount: number

  // Step 5: Payment
  paymentMethod: 'upi' | 'card' | 'netbanking' | null
  razorpayOrderId?: string
  razorpayPaymentId?: string
  razorpaySignature?: string

  // Step 6: Confirmation
  orderId?: string
}

interface CheckoutContextType {
  state: CheckoutState
  // Step 1
  setPlan: (plan: SubscriptionPlan) => void
  setAuthMode: (isGuest: boolean, email?: string, phone?: string, token?: string) => void
  // Step 2
  setDeliveryDays: (days: number[]) => void
  setDeliveryMonth: (month: number, year: number) => void
  // Step 3
  addAddOn: (addon: AddOn, quantity: number) => void
  removeAddOn: (addonId: string) => void
  updateAddOnQuantity: (addonId: string, quantity: number) => void
  // Step 4
  setPromoCode: (code: string, discount: number) => void
  setReferralDiscount: (code: string, discount: number) => void
  // Step 5
  setPaymentMethod: (method: 'upi' | 'card' | 'netbanking') => void
  setRazorpayDetails: (orderId: string, paymentId?: string, signature?: string) => void
  // Step 6
  setOrderId: (orderId: string) => void
  // Utils
  reset: () => void
  getOrderSummary: () => any
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

const initialState: CheckoutState = {
  selectedPlan: null,
  isGuest: true,
  selectedDeliveryDays: [],
  deliveryMonth: new Date().getMonth(),
  deliveryYear: new Date().getFullYear(),
  selectedAddOns: [],
  promoDiscount: 0,
  referralDiscount: 0,
  paymentMethod: null,
}

export const CheckoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CheckoutState>(initialState)

  const setPlan = (plan: SubscriptionPlan) => {
    setState(prev => ({ ...prev, selectedPlan: plan }))
  }

  const setAuthMode = (isGuest: boolean, email?: string, phone?: string, token?: string) => {
    setState(prev => ({
      ...prev,
      isGuest,
      guestEmail: email,
      guestPhone: phone,
      userToken: token,
    }))
  }

  const setDeliveryDays = (days: number[]) => {
    setState(prev => ({ ...prev, selectedDeliveryDays: days }))
  }

  const setDeliveryMonth = (month: number, year: number) => {
    setState(prev => ({ ...prev, deliveryMonth: month, deliveryYear: year }))
  }

  const addAddOn = (addon: AddOn, quantity: number) => {
    setState(prev => ({
      ...prev,
      selectedAddOns: [
        ...prev.selectedAddOns,
        { id: addon.id, quantity, price: addon.price },
      ],
    }))
  }

  const removeAddOn = (addonId: string) => {
    setState(prev => ({
      ...prev,
      selectedAddOns: prev.selectedAddOns.filter(a => a.id !== addonId),
    }))
  }

  const updateAddOnQuantity = (addonId: string, quantity: number) => {
    setState(prev => ({
      ...prev,
      selectedAddOns: prev.selectedAddOns.map(a =>
        a.id === addonId ? { ...a, quantity } : a
      ),
    }))
  }

  const setPromoCode = (code: string, discount: number) => {
    setState(prev => ({ ...prev, promoCode: code, promoDiscount: discount }))
  }

  const setReferralDiscount = (code: string, discount: number) => {
    setState(prev => ({ ...prev, referralCode: code, referralDiscount: discount }))
  }

  const setPaymentMethod = (method: 'upi' | 'card' | 'netbanking') => {
    setState(prev => ({ ...prev, paymentMethod: method }))
  }

  const setRazorpayDetails = (orderId: string, paymentId?: string, signature?: string) => {
    setState(prev => ({
      ...prev,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
    }))
  }

  const setOrderId = (orderId: string) => {
    setState(prev => ({ ...prev, orderId }))
  }

  const reset = () => {
    setState(initialState)
  }

  const getOrderSummary = () => {
    const daysCount = state.selectedDeliveryDays.length
    const planPrice = state.selectedPlan?.price || 0
    const subscriptionSubtotal = (planPrice / 30) * daysCount

    const addOnsSubtotal = state.selectedAddOns.reduce(
      (sum, addon) => sum + addon.price * addon.quantity,
      0
    )

    const subtotal = subscriptionSubtotal + addOnsSubtotal
    const tax = subtotal * 0.05 // 5% GST
    const total = subtotal + tax - state.promoDiscount - state.referralDiscount

    return {
      plan: state.selectedPlan,
      deliveryDays: state.selectedDeliveryDays,
      addOns: state.selectedAddOns,
      subscriptionSubtotal,
      addOnsSubtotal,
      subtotal,
      tax,
      promoCode: state.promoCode,
      promoDiscount: state.promoDiscount,
      referralCode: state.referralCode,
      referralDiscount: state.referralDiscount,
      total,
    }
  }

  const value: CheckoutContextType = {
    state,
    setPlan,
    setAuthMode,
    setDeliveryDays,
    setDeliveryMonth,
    addAddOn,
    removeAddOn,
    updateAddOnQuantity,
    setPromoCode,
    setReferralDiscount,
    setPaymentMethod,
    setRazorpayDetails,
    setOrderId,
    reset,
    getOrderSummary,
  }

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  )
}

export const useCheckout = () => {
  const context = useContext(CheckoutContext)
  if (!context) {
    throw new Error('useCheckout must be used within CheckoutProvider')
  }
  return context
}
