import { useState, useCallback } from 'react'
import { checkoutService } from '@/services/checkoutService'
import { authService } from '@/services/authService'

export interface PaymentState {
  isProcessing: boolean
  error: string | null
  success: boolean
  orderId: string | null
}

/**
 * Hook for handling payment processing with Razorpay
 */
export const usePaymentProcessor = () => {
  const [state, setState] = useState<PaymentState>({
    isProcessing: false,
    error: null,
    success: false,
    orderId: null,
  })

  const startPayment = useCallback(
    async (orderData: any): Promise<any> => {
      setState((prev) => ({ ...prev, isProcessing: true, error: null }))

      try {
        const token = authService.getToken()

        if (!token) {
          throw new Error('User not authenticated. Please login first.')
        }

        // Create Razorpay order
        const createOrderResponse = await checkoutService.createOrder(
          {
            planId: orderData.plan.id,
            deliveryDays: orderData.deliveryDays,
            addOns: orderData.addOns.map((a: any) => ({
              id: a.id,
              quantity: a.quantity,
            })),
            promoCode: orderData.promoCode,
          },
          token
        )

        if (!createOrderResponse.success || !createOrderResponse.data?.razorpayOrderId) {
          throw new Error(createOrderResponse.error?.message || 'Failed to create order')
        }

        const razorpayOrderId = createOrderResponse.data.razorpayOrderId

        // Check if Razorpay is loaded
        if (!window.Razorpay) {
          throw new Error('Payment system is not loaded. Please refresh and try again.')
        }

        // Open Razorpay checkout
        return new Promise((resolve, reject) => {
          const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID

          const options = {
            key: keyId || 'rzp_test_SVnAcBxaftra4r',
            amount: Math.round(orderData.total * 100), // Convert to paise
            currency: 'INR',
            order_id: razorpayOrderId,
            name: 'Bloomme',
            description: `${orderData.plan.name} Subscription`,
            handler: async (response: any) => {
              try {
                // Verify payment
                const verifyResponse = await checkoutService.verifyPayment(
                  {
                    orderId: orderData.orderId,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                  },
                  token
                )

                if (verifyResponse.success && verifyResponse.data?.orderId) {
                  const orderData = verifyResponse.data
                  setState((prev) => ({
                    ...prev,
                    isProcessing: false,
                    success: true,
                    orderId: orderData.orderId,
                  }))
                  resolve(orderData)
                } else {
                  throw new Error('Payment verification failed')
                }
              } catch (err) {
                reject(err)
              }
            },
            prefill: {
              email: authService.getUser()?.email || '',
              contact: authService.getUser()?.phone || '',
            },
            notes: {
              planId: orderData.plan.id,
              deliveryDays: orderData.deliveryDays.join(','),
            },
            theme: {
              color: '#C4A052',
            },
            modal: {
              ondismiss: () => {
                setState((prev) => ({
                  ...prev,
                  isProcessing: false,
                  error: 'Payment cancelled by user',
                }))
                reject(new Error('Payment cancelled'))
              },
            },
          }

          const razorpay = new window.Razorpay(options)
          razorpay.open()
        })
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to process payment'
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          error: errorMessage,
        }))
        throw err
      }
    },
    []
  )

  const resetState = useCallback(() => {
    setState({
      isProcessing: false,
      error: null,
      success: false,
      orderId: null,
    })
  }, [])

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  return {
    ...state,
    startPayment,
    resetState,
    clearError,
  }
}
