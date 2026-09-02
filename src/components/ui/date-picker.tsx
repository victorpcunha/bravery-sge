"use client"

import * as React from "react"
import { format, isValid, addMonths, subMonths, getDaysInMonth, startOfMonth, getDay } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  minDate?: string
  maxDate?: string
  className?: string
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md'
}

const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
const DAYS_WEEK = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

function parseISOLocal(iso: string): Date {
  const parts = iso.split('-')
  if (parts.length !== 3) return new Date(iso)
  return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 12, 0, 0)
}

const sizeStyles = {
  sm: {
    label: 'text-[11px] font-medium mb-1',
    input: 'h-8 pr-7 text-[12px]',
    icon: 'h-3.5 w-3.5',
    popover: 'w-64 p-3',
    day: 'h-7 w-7 text-[12px]',
    headerBtn: 'h-7 w-7',
    emptyCell: 'h-7 w-7',
  },
  md: {
    label: 'text-[14px] font-medium mb-2',
    input: 'pr-10 text-[14px]',
    icon: 'h-[18px] w-[18px]',
    popover: 'w-80 p-4',
    day: 'h-8 w-8 text-sm',
    headerBtn: 'h-8 w-8',
    emptyCell: 'h-8 w-8',
  },
}

export function DatePicker({
  value,
  onChange,
  placeholder = "dd/mm/aaaa",
  minDate,
  maxDate,
  className,
  label,
  disabled = false,
  size = 'md'
}: DatePickerProps) {
  const sizeCls = sizeStyles[size]
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  )
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const [inputValue, setInputValue] = React.useState(value ? format(new Date(value), "dd/MM/yyyy") : "")
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (value) {
      // Parse YYYY-MM-DD manually to avoid timezone issues
      const parts = value.split('-')
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10)
        const month = parseInt(parts[1], 10) - 1
        const day = parseInt(parts[2], 10)
        
        const d = new Date(year, month, day, 12, 0, 0)
        if (isValid(d)) {
          setDate(d)
          setCurrentMonth(d)
          setInputValue(format(d, "dd/MM/yyyy"))
        }
      }
    }
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value
    val = val.replace(/[^\d/]/g, '')
    
    if (val.length === 2 && !val.includes('/')) {
      val = val + '/'
    } else if (val.length === 5 && val.split('/').length === 2) {
      val = val + '/'
    }
    
    setInputValue(val)
    
    if (val.length === 10) {
      try {
        // Parse date manually to avoid timezone issues
        const parts = val.split('/')
        const day = parseInt(parts[0], 10)
        const month = parseInt(parts[1], 10) - 1 // Month is 0-indexed
        const year = parseInt(parts[2], 10)
        
        // Create date at noon to avoid timezone shifts
        const parsed = new Date(year, month, day, 12, 0, 0)
        
        if (isValid(parsed)) {
          const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          if (maxDate && formatted > maxDate) {
            return
          }
          setDate(parsed)
          setCurrentMonth(parsed)
          // Format as ISO string with local date
          onChange?.(formatted)
        }
      } catch {
        // Invalid date
      }
    }
  }

  const handleSelectDay = (day: number) => {
    // Create date at noon to avoid timezone issues
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day, 12, 0, 0)
    setDate(selectedDate)
    setInputValue(format(selectedDate, "dd/MM/yyyy"))
    
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onChange?.(formatted)
    setOpen(false)
  }

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDayOfMonth = getDay(startOfMonth(currentMonth))
    const days: (number | null)[] = []
    
    // Empty cells before first day
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }
    
    // Days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    // Pad to always render 6 rows (42 cells) so the popover height stays constant
    while (days.length < 42) {
      days.push(null)
    }

    return days.map((day, index) => {
      if (day === null) {
        return <div key={`empty-${index}`} className={sizeCls.emptyCell} />
      }
      
      const isSelected = date && 
        date.getDate() === day && 
        date.getMonth() === currentMonth.getMonth() &&
        date.getFullYear() === currentMonth.getFullYear()
      
      const isToday = new Date().getDate() === day && 
        new Date().getMonth() === currentMonth.getMonth() &&
        new Date().getFullYear() === currentMonth.getFullYear()
      
      const parseISOLocal = (iso: string): Date => {
        const parts = iso.split('-')
        if (parts.length !== 3) return new Date(iso)
        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 12, 0, 0)
      }
      const minDateObj = minDate ? parseISOLocal(minDate) : null
      const maxDateObj = maxDate ? parseISOLocal(maxDate) : null
      const diaLocal = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day, 12, 0, 0)
      const isDisabled = (minDateObj ? diaLocal < minDateObj : false)
        || (maxDateObj ? diaLocal > maxDateObj : false)
      
    return (
      <button
        key={day}
        type="button"
        onClick={() => !isDisabled && handleSelectDay(day)}
        disabled={isDisabled}
        className={cn(
          sizeCls.day,
          "rounded-md font-medium transition-all duration-150 cursor-pointer",
          isDisabled ? "text-muted-foreground opacity-40 cursor-not-allowed" : "text-foreground hover:bg-muted",
          isSelected && "bg-primary text-primary-foreground hover:bg-primary",
          isToday && !isSelected && "bg-accent/20 text-accent font-bold"
        )}
      >
        {day}
      </button>
    )
    })
  }

  return (
    <div className={className}>
      {label && (
        <label className={cn("block text-foreground", sizeCls.label)}>
          {label}
        </label>
      )}
      <Popover open={disabled ? false : open} onOpenChange={disabled ? undefined : setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              value={inputValue}
              onChange={handleInputChange}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                sizeCls.input,
                "border-2 border-border focus:border-primary focus:ring-primary/20 bg-card cursor-text",
                disabled && "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            />
            <button
              type="button"
              disabled={disabled}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 p-1",
                disabled ? "text-muted-foreground cursor-not-allowed" : "text-muted-foreground hover:text-primary cursor-pointer"
              )}
              onClick={() => !disabled && setOpen(!open)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={sizeCls.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                <line x1="16" x2="16" y1="2" y2="6"/>
                <line x1="8" x2="8" y1="2" y2="6"/>
                <line x1="3" x2="21" y1="10" y2="10"/>
              </svg>
            </button>
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className={cn("bg-card border-2 border-border rounded-xl shadow-xl", sizeCls.popover)} 
          align="start" 
          side="bottom"
          sideOffset={8}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className={cn(sizeCls.headerBtn, "flex items-center justify-center rounded-md hover:bg-muted transition-colors cursor-pointer text-muted-foreground hover:text-primary")}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-primary">
              {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className={cn(sizeCls.headerBtn, "flex items-center justify-center rounded-md hover:bg-muted transition-colors cursor-pointer text-muted-foreground hover:text-primary")}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-x-1 mb-0.5">
            {DAYS_WEEK.map((day) => (
              <div key={day} className="h-7 w-full flex items-center justify-center text-xs font-semibold text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-x-1 gap-y-0">
            {renderCalendarDays()}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

interface DatePickerDualProps {
  labelInicio: string
  labelTermino: string
  valorInicio: string
  valorTermino: string
  onChangeInicio: (value: string) => void
  onChangeTermino: (value: string) => void
  className?: string
  required?: boolean
  disabled?: boolean
}

export function DatePickerDual({
  labelInicio,
  labelTermino,
  valorInicio,
  valorTermino,
  onChangeInicio,
  onChangeTermino,
  className,
  required,
  disabled = false
}: DatePickerDualProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-6", className)}>
      <DatePicker
        value={valorInicio}
        onChange={onChangeInicio}
        placeholder="dd/mm/aaaa"
        disabled={disabled}
        label={required ? `${labelInicio} *` : labelInicio}
      />
<DatePicker
        value={valorTermino}
        onChange={onChangeTermino}
        placeholder="dd/mm/aaaa"
        minDate={valorInicio || undefined}
        label={required ? `${labelTermino} *` : labelTermino}
        disabled={disabled}
      />
    </div>
  )
}