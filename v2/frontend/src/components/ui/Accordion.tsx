import React, { useState } from 'react'
import './Accordion.css'

interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
  icon?: React.ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  defaultOpen?: string[]
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpen = [],
}) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen)

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      )
    } else {
      setOpenItems(prev => prev.includes(id) ? [] : [id])
    }
  }

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div key={item.id} className="accordion__item">
          <button
            onClick={() => toggleItem(item.id)}
            className="accordion__trigger"
          >
            <div className="accordion__header">
              {item.icon && <span className="accordion__icon">{item.icon}</span>}
              <h3 className="accordion__title">{item.title}</h3>
            </div>
            <span className={`accordion__chevron ${openItems.includes(item.id) ? 'accordion__chevron--open' : ''}`}>
              ▼
            </span>
          </button>
          {openItems.includes(item.id) && (
            <div className="accordion__content">
              {item.content}
            </div>
          )}
          {index < items.length - 1 && <div className="accordion__divider" />}
        </div>
      ))}
    </div>
  )
}
