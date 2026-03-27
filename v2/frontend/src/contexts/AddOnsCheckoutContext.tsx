import React, { createContext, useState, useContext } from 'react'
import type { ReactNode } from 'react'

interface AddOnSelected {
  id: string
  quantity: number
  price: number
  totalPrice: number
}

interface AddOnsCheckoutState {
  selectedAddOns: AddOnSelected[]
  selectedDates: number[]
  promoCode: string | null
  promoDiscount: number
  referralDiscount: number
  subtotal: number
  tax: number
  total: number
}

interface AddOnsCheckoutContextType {
  state: AddOnsCheckoutState
  setSelectedAddOns: (addOns: AddOnSelected[]) => void
  setSelectedDates: (dates: number[]) => void
  setPromoCode: (code: string | null, discount: number) => void
  setReferralDiscount: (discount: number) => void
  updateTotal: () => void
  reset: () => void
}

const AddOnsCheckoutContext = createContext<AddOnsCheckoutContextType | undefined>(undefined)

const initialState: AddOnsCheckoutState = {
  selectedAddOns: [],
  selectedDates: [],
  promoCode: null,
  promoDiscount: 0,
  referralDiscount: 0,
  subtotal: 0,
  tax: 0,
  total: 0,
}

export const AddOnsCheckoutProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AddOnsCheckoutState>(initialState)

  const updateTotal = () => {
    const subtotal = state.selectedAddOns.reduce((sum, ao) => sum + ao.totalPrice, 0)
    const tax = subtotal * 0.05
    const total = subtotal - state.promoDiscount - state.referralDiscount + tax

    setState((prev) => ({
      ...prev,
      subtotal,
      tax,
      total,
    }))
  }

  const value: AddOnsCheckoutContextType = {
    state,
    setSelectedAddOns: (addOns) => {
      setState((prev) => {
        const newState = { ...prev, selectedAddOns: addOns }
        const subtotal = addOns.reduce((sum, ao) => sum + ao.totalPrice, 0)
        const tax = subtotal * 0.05
        newState.subtotal = subtotal
        newState.tax = tax
        newState.total = subtotal - prev.promoDiscount - prev.referralDiscount + tax
        return newState
      })
    },
    setSelectedDates: (dates) => setState((prev) => ({ ...prev, selectedDates: dates })),
    setPromoCode: (code, discount) => {
      setState((prev) => {
        const newTotal = prev.subtotal - discount - prev.referralDiscount + prev.tax
        return {
          ...prev,
          promoCode: code,
          promoDiscount: discount,
          total: newTotal,
        }
      })
    },
    setReferralDiscount: (discount) => {
      setState((prev) => {
        const newTotal = prev.subtotal - prev.promoDiscount - discount + prev.tax
        return {
          ...prev,
          referralDiscount: discount,
          total: newTotal,
        }
      })
    },
    updateTotal,
    reset: () => setState(initialState),
  }

  return (
    <AddOnsCheckoutContext.Provider value={value}>
      {children}
    </AddOnsCheckoutContext.Provider>
  )
}

export const useAddOnsCheckout = () => {
  const context = useContext(AddOnsCheckoutContext)
  if (!context) {
    throw new Error('useAddOnsCheckout must be used within AddOnsCheckoutProvider')
  }
  return context
}
