import React from 'react'
import type { AddOn } from '../../lib/types'
import { QuantitySelector } from './QuantitySelector'
import { PriceDisplay } from './PriceDisplay'
import './AddOnCardGrid.css'

interface AddOnCardGridProps {
  addOns: AddOn[]
  selectedAddOns: { id: string; quantity: number }[]
  onAddOnChange: (id: string, quantity: number) => void
  showQuantity?: boolean
}

export const AddOnCardGrid: React.FC<AddOnCardGridProps> = ({
  addOns,
  selectedAddOns,
  onAddOnChange,
  showQuantity = true,
}) => {
  return (
    <div className="addon-card-grid">
      {addOns.map(addOn => {
        const selected = selectedAddOns.find(s => s.id === addOn.id)
        const quantity = selected?.quantity || 0

        return (
          <div
            key={addOn.id}
            className={`addon-card-grid__item ${
              quantity > 0 ? 'addon-card-grid__item--selected' : ''
            }`}
          >
            {/* Icon */}
            <div className="addon-card-grid__icon">{addOn.icon}</div>

            {/* Name & Description */}
            <h4 className="addon-card-grid__name">{addOn.name}</h4>
            <p className="addon-card-grid__description">{addOn.description}</p>

            {/* Price */}
            <PriceDisplay
              amount={addOn.price}
              label="Per Day"
              size="md"
              className="addon-card-grid__price"
            />

            {/* Quantity Selector */}
            {showQuantity && (
              <div className="addon-card-grid__selector">
                <QuantitySelector
                  value={quantity}
                  onChange={(val) => onAddOnChange(addOn.id, val)}
                  max={10}
                  min={0}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
