import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { DashboardLayout } from './DashboardLayout'
import { DashboardOverview } from './Overview'
import { SubscriptionsManagement } from './Subscriptions'
import { AddOnsManagement } from './AddOnsManagement'
import { CalendarView } from './CalendarView'
import { OrderHistory } from './OrderHistory'
import { ReferralsTracking } from './Referrals'
import { AccountSettings } from './Settings'

export const DashboardRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        {/* Overview */}
        <Route index element={<DashboardOverview />} />
        <Route path="overview" element={<DashboardOverview />} />

        {/* Subscriptions */}
        <Route path="subscriptions" element={<SubscriptionsManagement />} />

        {/* Add-ons */}
        <Route path="addons" element={<AddOnsManagement />} />

        {/* Calendar */}
        <Route path="calendar" element={<CalendarView />} />

        {/* Order History */}
        <Route path="orders" element={<OrderHistory />} />
        <Route path="orders/:orderId" element={<OrderHistory />} />

        {/* Referrals */}
        <Route path="referrals" element={<ReferralsTracking />} />

        {/* Settings */}
        <Route path="settings" element={<AccountSettings />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default DashboardRoutes
