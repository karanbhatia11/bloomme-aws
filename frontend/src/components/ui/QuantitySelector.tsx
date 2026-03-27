import React from 'react'
import { Button } from './Button'
import './QuantitySelector.css'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label?: string
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  onChange,
  min = 1,
  max = 10,
  label,
}) => {
  const handleDecrease = () => {
    if (value > min) onChange(value - 1)
  }

  const handleIncrease = () => {
    if (value < max) onChange(value + 1)
  }

  return (
    <div className="quantity-selector-wrapper">
      {label && (
        <label className="quantity-selector__label">
          {label}
        </label>
      )}
      <div className="quantity-selector__container">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDecrease}
          disabled={value <= min}
          className="quantity-selector__btn"
        >
          −
        </Button>
        <span className="quantity-selector__value">
          {value}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleIncrease}
          disabled={value >= max}
          className="quantity-selector__btn"
        >
          +
        </Button>
      </div>
    </div>
  )
}
