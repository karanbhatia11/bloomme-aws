import React, { useState } from 'react'
import './PhoneInput.css'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
  label?: string
  disabled?: boolean
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  error,
  label = 'Phone Number',
  disabled = false,
}) => {
  const [touched, setTouched] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '').slice(0, 10)
    onChange(newValue)
  }

  const isValid = value.length === 10 || value.length === 0
  const displayError = touched && !isValid ? 'Must be 10 digits' : error

  return (
    <div className="phone-input-wrapper">
      <label className="phone-input__label">
        {label}
      </label>
      <div className="phone-input__container">
        <span className="phone-input__prefix">+91</span>
        <input
          type="text"
          inputMode="numeric"
          placeholder="98765 43210"
          value={value}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          disabled={disabled}
          className="phone-input__field"
          maxLength={10}
        />
      </div>
      {displayError && <p className="phone-input__error">{displayError}</p>}
      {value.length === 10 && !displayError && (
        <p className="phone-input__success">✓ Valid number</p>
      )}
    </div>
  )
}
