import React from 'react'
import './Input.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  type?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  type = 'text',
  className = '',
  ...props
}) => {
  return (
    <div className="input-wrapper">
      {label && (
        <label className="input__label">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`input ${error ? 'input--error' : ''} ${className}`}
        {...props}
      />
      {error && <p className="input__error">{error}</p>}
      {helperText && !error && <p className="input__helper">{helperText}</p>}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: { value: string; label: string }[]
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  className = '',
  ...props
}) => {
  return (
    <div className="input-wrapper">
      {label && (
        <label className="input__label">
          {label}
        </label>
      )}
      <select
        className={`input select ${error ? 'input--error' : ''} ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="input__error">{error}</p>}
      {helperText && !error && <p className="input__helper">{helperText}</p>}
    </div>
  )
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  className = '',
  ...props
}) => {
  return (
    <label className="checkbox-wrapper">
      <input
        type="checkbox"
        className={`checkbox ${className}`}
        {...props}
      />
      <span className="checkbox__label">{label}</span>
    </label>
  )
}
