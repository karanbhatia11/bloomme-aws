import React from 'react'
import './LoadingSpinner.css'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
}) => {
  const sizeClass = `loading-spinner__icon--${size}`

  const spinner = (
    <div className="loading-spinner">
      <div className={`loading-spinner__icon ${sizeClass}`} />
      {text && <p className="loading-spinner__text">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="loading-spinner--fullscreen">
        {spinner}
      </div>
    )
  }

  return spinner
}
