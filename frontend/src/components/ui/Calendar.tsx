import React from 'react'
import './Calendar.css'

interface CalendarProps {
  selectedDates: number[]
  onSelectDate: (day: number) => void
  onDeselectDate: (day: number) => void
  month?: number
  year?: number
  disabled?: (day: number) => boolean
  multiSelect?: boolean
}

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay()
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const Calendar: React.FC<CalendarProps> = ({
  selectedDates,
  onSelectDate,
  onDeselectDate,
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
  disabled,
  multiSelect = false,
}) => {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const days = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1))

  const handleSelectDay = (day: number) => {
    if (!multiSelect) {
      selectedDates.forEach(d => onDeselectDate(d))
    }

    if (selectedDates.includes(day)) {
      onDeselectDate(day)
    } else {
      onSelectDate(day)
    }
  }

  return (
    <div className="calendar">
      {/* Month/Year Header */}
      <div className="calendar__header">
        <h3 className="calendar__title">
          {MONTHS[month]} {year}
        </h3>
      </div>

      {/* Day Headers */}
      <div className="calendar__day-headers">
        {DAYS.map(day => (
          <div key={day} className="calendar__day-header">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar__grid">
        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => day && handleSelectDay(day)}
            disabled={!day || (disabled && day && disabled(day))}
            className={`calendar__day ${
              !day
                ? 'calendar__day--empty'
                : selectedDates.includes(day)
                ? 'calendar__day--selected'
                : disabled && day && disabled(day)
                ? 'calendar__day--disabled'
                : 'calendar__day--available'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Selected Count */}
      {selectedDates.length > 0 && (
        <p className="calendar__count">
          {selectedDates.length} day{selectedDates.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  )
}
