import React from 'react'
import './Badge.css'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'success' | 'error' | 'warning' | 'info'
  size?: 'sm' | 'md'
  icon?: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
}) => {
  return (
    <span className={`badge badge--${variant} badge--${size}`}>
      {icon && <span className="badge__icon">{icon}</span>}
      {children}
    </span>
  )
}
