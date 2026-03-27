import React from 'react'
import './RadioButtonGroup.css'

interface RadioOption {
  value: string
  label: string
  description?: string
  icon?: string
}

interface RadioButtonGroupProps {
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  label?: string
  layout?: 'vertical' | 'horizontal'
}

export const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  options,
  value,
  onChange,
  label,
  layout = 'vertical',
}) => {
  return (
    <div className="radio-button-group-wrapper">
      {label && (
        <label className="radio-button-group__label">
          {label}
        </label>
      )}
      <div className={`radio-button-group__container radio-button-group__container--${layout}`}>
        {options.map((option) => (
          <label
            key={option.value}
            className="radio-button-group__option"
          >
            <input
              type="radio"
              name="radio-group"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="radio-button-group__input"
            />
            <div className="radio-button-group__content">
              {option.icon && <span className="radio-button-group__icon">{option.icon}</span>}
              <div>
                <p className="radio-button-group__option-label">{option.label}</p>
                {option.description && (
                  <p className="radio-button-group__description">{option.description}</p>
                )}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
