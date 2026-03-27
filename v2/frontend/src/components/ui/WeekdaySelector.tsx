import React from 'react'
import './WeekdaySelector.css'

interface WeekdaySelectorProps {
  selectedDays: number[] // 0-6 (Sunday-Saturday)
  onChange: (days: number[]) => void
  label?: string
}

const WEEKDAYS = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
]

export const WeekdaySelector: React.FC<WeekdaySelectorProps> = ({
  selectedDays,
  onChange,
  label = 'Select Delivery Days',
}) => {
  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter(d => d !== day))
    } else {
      onChange([...selectedDays, day].sort())
    }
  }

  return (
    <div className="weekday-selector-wrapper">
      <label className="weekday-selector__label">
        {label}
      </label>
      <div className="weekday-selector__grid">
        {WEEKDAYS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => toggleDay(value)}
            className={`weekday-selector__btn ${
              selectedDays.includes(value)
                ? 'weekday-selector__btn--selected'
                : ''
            }`}
          >
            {label.slice(0, 3)}
          </button>
        ))}
      </div>
      {selectedDays.length > 0 && (
        <p className="weekday-selector__count">
          {selectedDays.length} day{selectedDays.length !== 1 ? 's' : ''} per week
        </p>
      )}
    </div>
  )
}
