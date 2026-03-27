import React from 'react'
import './DateRangeSelector.css'

interface DateRangeSelectorProps {
  startDate: Date | null
  endDate: Date | null
  onChangeStart: (date: Date) => void
  onChangeEnd: (date: Date) => void
  minDate?: Date
  label?: string
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDate,
  endDate,
  onChangeStart,
  onChangeEnd,
  minDate = new Date(),
  label = 'Select Date Range',
}) => {
  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  return (
    <div className="date-range-selector-wrapper">
      <label className="date-range-selector__label">
        {label}
      </label>
      <div className="date-range-selector__grid">
        <div className="date-range-selector__group">
          <label className="date-range-selector__group-label">Start Date</label>
          <input
            type="date"
            value={formatDate(startDate)}
            onChange={(e) => onChangeStart(new Date(e.target.value))}
            min={formatDate(minDate)}
            className="date-range-selector__input"
          />
        </div>
        <div className="date-range-selector__group">
          <label className="date-range-selector__group-label">End Date</label>
          <input
            type="date"
            value={formatDate(endDate)}
            onChange={(e) => onChangeEnd(new Date(e.target.value))}
            min={startDate ? formatDate(startDate) : formatDate(minDate)}
            className="date-range-selector__input"
          />
        </div>
      </div>
      {startDate && endDate && (
        <p className="date-range-selector__info">
          {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days selected
        </p>
      )}
    </div>
  )
}
