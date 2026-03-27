import React, { useEffect } from 'react'
import './Toast.css'

interface ToastProps {
  id: string
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  onClose: (id: string) => void
}

const ICONS = {
  success: '✓',
  error: '✕',
  info: 'ℹ️',
  warning: '⚠️',
}

export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration)
    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  return (
    <div className={`toast toast--${type}`}>
      <span className="toast__icon">{ICONS[type]}</span>
      <p className="toast__message">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="toast__close"
      >
        ✕
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastProps[]
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}
