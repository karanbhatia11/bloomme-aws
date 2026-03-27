import React from 'react'
import type { OrderSummary as OrderSummaryType } from '../../lib/types'
import { PriceDisplay } from './PriceDisplay'
import { Input } from './Input'
import './OrderSummary.css'

interface OrderSummaryProps {
  summary: OrderSummaryType
  onPromoCodeChange?: (code: string) => void
  loading?: boolean
  readonly?: boolean
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  summary,
  onPromoCodeChange,
  loading = false,
  readonly = false,
}) => {
  return (
    <div className="order-summary">
      <h3 className="order-summary__title">Order Summary</h3>

      {/* Subscription */}
      {summary.subscription && (
        <div className="order-summary__section">
          <div className="order-summary__item">
            <div className="order-summary__item-content">
              <p className="order-summary__item-title">{summary.subscription.planName}</p>
              <p className="order-summary__item-description">
                {summary.subscription.deliveryDays.length} days/week
              </p>
            </div>
            <PriceDisplay amount={summary.subscription.price} size="md" />
          </div>
        </div>
      )}

      {/* Add-ons */}
      {summary.addOns.length > 0 && (
        <div className="order-summary__section">
          {summary.addOns.map(addOn => (
            <div key={addOn.id} className="order-summary__item order-summary__item--addon">
              <span className="order-summary__item-title">
                {addOn.name} x {addOn.quantity}
              </span>
              <PriceDisplay amount={addOn.totalPrice} />
            </div>
          ))}
        </div>
      )}

      {/* Subtotal */}
      <div className="order-summary__row">
        <span className="order-summary__label">Subtotal</span>
        <PriceDisplay amount={summary.subtotal} />
      </div>

      {/* Promo Code */}
      {!readonly && (
        <div className="order-summary__promo-section">
          <Input
            placeholder="Enter promo code"
            onChange={(e) => onPromoCodeChange?.(e.target.value)}
            disabled={loading}
          />
          {summary.promoCode && (
            <p className="order-summary__promo-applied">
              Promo applied: {summary.promoCode}
            </p>
          )}
        </div>
      )}

      {/* Discount */}
      {summary.discount > 0 && (
        <div className="order-summary__row order-summary__row--success">
          <span className="order-summary__label">Discount</span>
          <span className="order-summary__value">-₹{summary.discount}</span>
        </div>
      )}

      {/* Tax */}
      <div className="order-summary__row">
        <span className="order-summary__label">Tax (GST)</span>
        <PriceDisplay amount={summary.tax} />
      </div>

      {/* Total */}
      <div className="order-summary__total-row">
        <span className="order-summary__total-label">Total</span>
        <PriceDisplay amount={summary.total} size="lg" className="order-summary__total-price" />
      </div>
    </div>
  )
}
