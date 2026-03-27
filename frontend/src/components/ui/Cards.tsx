import React from 'react'
import type { SubscriptionPlan, AddOn } from '../../lib/types'
import './Cards.css'

interface PlanCardProps {
  plan: SubscriptionPlan
  selected?: boolean
  onSelect?: () => void
  highlighted?: boolean
  pricePerDay?: number
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  selected = false,
  onSelect,
  highlighted = false,
  pricePerDay,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`plan-card ${selected ? 'plan-card--selected' : ''} ${highlighted ? 'plan-card--highlighted' : ''} ${onSelect ? 'plan-card--clickable' : ''}`}
    >
      {/* Header with badge */}
      <div className="plan-card__header">
        <h3 className="plan-card__name">{plan.name}</h3>
        {highlighted && <span className="plan-card__badge">Popular</span>}
      </div>

      {/* Price */}
      <p className="plan-card__price">₹{plan.price}/month</p>

      {/* Price per day */}
      {pricePerDay && (
        <p className="plan-card__price-per-day">
          ≈ ₹{(pricePerDay).toFixed(2)}/day
        </p>
      )}

      {/* Description */}
      <p className="plan-card__description">{plan.description}</p>

      {/* Features */}
      <ul className="plan-card__features">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="plan-card__feature">✓ {feature}</li>
        ))}
      </ul>

      {/* Selection indicator */}
      {selected && (
        <div className="plan-card__selected-indicator">
          Selected ✓
        </div>
      )}
    </div>
  )
}

interface AddOnCardProps {
  addOn: AddOn
  selected?: boolean
  onClick?: () => void
  quantity?: number
}

export const AddOnCard: React.FC<AddOnCardProps> = ({ addOn, selected = false, onClick, quantity = 1 }) => {
  return (
    <div
      onClick={onClick}
      className={`addon-card ${selected ? 'addon-card--selected' : ''} ${onClick ? 'addon-card--clickable' : ''}`}
    >
      <div className="addon-card__icon">{addOn.icon}</div>
      <h4 className="addon-card__name">{addOn.name}</h4>
      <p className="addon-card__description">{addOn.description}</p>
      <p className="addon-card__price">₹{addOn.price}</p>
      {quantity > 1 && (
        <p className="addon-card__quantity">x {quantity}</p>
      )}
    </div>
  )
}

interface OrderCardProps {
  title: string
  amount: number
  description?: string
  icon?: string
}

export const OrderCard: React.FC<OrderCardProps> = ({ title, amount, description, icon }) => {
  return (
    <div className="order-card">
      <div className="order-card__content">
        {icon && <span className="order-card__icon">{icon}</span>}
        <div className="order-card__text">
          <p className="order-card__title">{title}</p>
          {description && <p className="order-card__description">{description}</p>}
        </div>
      </div>
      <p className="order-card__amount">₹{amount}</p>
    </div>
  )
}
