import React from 'react'
import './PriceDisplay.css'

interface PriceDisplayProps {
  amount: number
  currency?: string
  size?: 'sm' | 'md' | 'lg'
  strikethrough?: boolean
  label?: string
  className?: string
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  currency = '₹',
  size = 'md',
  strikethrough = false,
  label,
  className = '',
}) => {
  const formattedAmount = amount.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return (
    <div className={`price-display ${className}`}>
      {label && <p className="price-display__label">{label}</p>}
      <p className={`price-display__amount price-display__amount--${size} ${strikethrough ? 'price-display__amount--strikethrough' : ''}`}>
        {currency}{formattedAmount}
      </p>
    </div>
  )
}
