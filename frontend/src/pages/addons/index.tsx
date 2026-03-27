import React from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import { AddOnsSelection } from './AddOnsSelection'
import { DeliveryDates } from './DeliveryDates'
import { AddOnsReview } from './Review'
import { AddOnsPayment } from './Payment'
import { AddOnsConfirmation } from './Confirmation'

export const AddOnsRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="select" replace />} />

      {/* Step 1: Select Add-ons */}
      <Route path="select" element={<AddOnsSelection />} />

      {/* Step 2: Choose Delivery Dates */}
      <Route path="delivery" element={<DeliveryDates />} />

      {/* Step 3: Review Order */}
      <Route path="review" element={<AddOnsReview />} />

      {/* Step 4: Payment */}
      <Route path="payment" element={<AddOnsPayment />} />

      {/* Confirmation */}
      <Route path="confirmation/:orderId" element={<AddOnsConfirmation />} />

      {/* 404 handling */}
      <Route path="*" element={<Navigate to="select" replace />} />
    </Routes>
  )
}

export { AddOnsSelection, DeliveryDates, AddOnsReview, AddOnsPayment, AddOnsConfirmation }
