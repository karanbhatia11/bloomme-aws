import React, { useState } from 'react'
import './Tabs.css'

interface TabItem {
  id: string
  label: string
  content: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
}

interface TabsProps {
  tabs: TabItem[]
  defaultTab?: string
  variant?: 'pill' | 'underline'
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  variant = 'underline',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id)

  return (
    <div className={`tabs tabs--${variant}`}>
      {/* Tab Headers */}
      <div className="tabs__header">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            disabled={tab.disabled}
            className={`tabs__tab ${
              activeTab === tab.id ? 'tabs__tab--active' : ''
            } ${tab.disabled ? 'tabs__tab--disabled' : ''}`}
          >
            {tab.icon && <span className="tabs__icon">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tabs__content">
        {tabs.find(t => t.id === activeTab)?.content}
      </div>
    </div>
  )
}
