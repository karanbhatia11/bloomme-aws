import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { PlanSelection } from './PlanSelection'
import { DeliverySelection } from './DeliverySelection'
import { AddOnsSelection } from './AddOnsSelection'
import { OrderReview } from './OrderReview'
import { Payment } from './Payment'
import { Confirmation } from './Confirmation'

export const CheckoutRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Step 1: Plan Selection */}
      <Route path="/plans" element={<PlanSelection />} />

      {/* Step 2: Delivery Days */}
      <Route path="/delivery" element={<DeliverySelection />} />

      {/* Step 3: Add-ons Selection */}
      <Route path="/addons" element={<AddOnsSelection />} />

      {/* Step 4: Order Review */}
      <Route path="/review" element={<OrderReview />} />

      {/* Step 5: Payment */}
      <Route path="/payment" element={<Payment />} />

      {/* Step 6: Order Confirmation */}
      <Route path="/confirmation/:orderId" element={<Confirmation />} />

      {/* Default redirect to plans */}
      <Route path="/" element={<PlanSelection />} />
    </Routes>
  )
}

export { PlanSelection, DeliverySelection, AddOnsSelection, OrderReview, Payment, Confirmation }
