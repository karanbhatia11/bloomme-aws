import React from 'react'
import './Alert.css'

interface AlertProps {
  title?: string
  message: string
  type?: 'info' | 'success' | 'error' | 'warning'
  dismissible?: boolean
  onDismiss?: () => void
  icon?: React.ReactNode
}

const ICONS = {
  info: 'ℹ️',
  success: '✓',
  error: '✕',
  warning: '⚠️',
}

export const Alert: React.FC<AlertProps> = ({
  title,
  message,
  type = 'info',
  dismissible = true,
  onDismiss,
  icon,
}) => {
  return (
    <div className={`alert alert--${type}`}>
      <span className="alert__icon">{icon || ICONS[type]}</span>
      <div className="alert__content">
        {title && <h4 className="alert__title">{title}</h4>}
        <p className="alert__message">{message}</p>
      </div>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="alert__close"
        >
          ✕
        </button>
      )}
    </div>
  )
}
