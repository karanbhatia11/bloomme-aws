import React, { useState } from 'react'
import './EmailInput.css'

interface EmailInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
  label?: string
  disabled?: boolean
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const EmailInput: React.FC<EmailInputProps> = ({
  value,
  onChange,
  error,
  label = 'Email Address',
  disabled = false,
}) => {
  const [touched, setTouched] = useState(false)

  const isValid = EMAIL_REGEX.test(value) || value.length === 0
  const displayError = touched && !isValid ? 'Invalid email format' : error

  return (
    <div className="email-input-wrapper">
      <label className="email-input__label">
        {label}
      </label>
      <input
        type="email"
        placeholder="your@email.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        disabled={disabled}
        className={`email-input ${displayError ? 'email-input--error' : ''}`}
      />
      {displayError && <p className="email-input__error">{displayError}</p>}
      {EMAIL_REGEX.test(value) && !displayError && (
        <p className="email-input__success">✓ Valid email</p>
      )}
    </div>
  )
}
