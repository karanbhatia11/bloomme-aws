import React from 'react'
import './AppLayout.css'

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app-layout">
      {children}
    </div>
  )
}

interface ContainerProps {
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export const Container: React.FC<ContainerProps> = ({ children, maxWidth = 'lg', className = '' }) => {
  return (
    <div className={`container container--${maxWidth} ${className}`}>
      {children}
    </div>
  )
}

interface CardProps {
  children: React.ReactNode
  highlighted?: boolean
  onClick?: () => void
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, highlighted = false, onClick, className = '' }) => {
  return (
    <div
      onClick={onClick}
      className={`card ${highlighted ? 'card--highlighted' : ''} ${onClick ? 'card--clickable' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

interface SectionProps {
  children: React.ReactNode
  className?: string
}

export const Section: React.FC<SectionProps> = ({ children, className = '' }) => {
  return (
    <section className={`section ${className}`}>
      {children}
    </section>
  )
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, className = '' }) => {
  return (
    <div className={`page-header ${className}`}>
      <h1 className="page-header__title">{title}</h1>
      {subtitle && (
        <p className="page-header__subtitle">{subtitle}</p>
      )}
    </div>
  )
}
