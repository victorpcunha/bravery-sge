"use client"

import * as React from "react"
import { format, parse, isValid, addMonths, subMonths, getDaysInMonth, startOfMonth, getDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  minDate?: string
  className?: string
  label?: string
  disabled?: boolean
}

const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
const DAYS_WEEK = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export function DatePicker({
  value,
  onChange,
  placeholder = "dd/mm/aaaa",
  minDate,
  className,
  label,
  disabled = false
}: DatePickerProps) {
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
          setDate(parsed)
          setCurrentMonth(parsed)
          // Format as ISO string with local date
          const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
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
    
    return days.map((day, index) => {
      if (day === null) {
        return <div key={`empty-${index}`} className="h-8 w-8" />
      }
      
      const isSelected = date && 
        date.getDate() === day && 
        date.getMonth() === currentMonth.getMonth() &&
        date.getFullYear() === currentMonth.getFullYear()
      
      const isToday = new Date().getDate() === day && 
        new Date().getMonth() === currentMonth.getMonth() &&
        new Date().getFullYear() === currentMonth.getFullYear()
      
      const minDateObj = minDate ? new Date(minDate) : null
      const isDisabled = minDateObj ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) < minDateObj : false
      
      return (
        <button
          key={day}
          type="button"
          onClick={() => !isDisabled && handleSelectDay(day)}
          disabled={isDisabled}
          className={cn(
            "h-9 w-9 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer",
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
        <label className="text-foreground font-medium block mb-2">
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
                "border-2 border-border focus:border-primary focus:ring-primary/20 bg-card pr-10 cursor-text",
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
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                <line x1="16" x2="16" y1="2" y2="6"/>
                <line x1="8" x2="8" y1="2" y2="6"/>
                <line x1="3" x2="21" y1="10" y2="10"/>
              </svg>
            </button>
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="w-80 p-4 bg-card border-2 border-border rounded-xl shadow-xl" 
          align="start" 
          side="bottom"
          sideOffset={8}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors cursor-pointer text-muted-foreground hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-primary">
              {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors cursor-pointer text-muted-foreground hover:text-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS_WEEK.map((day) => (
              <div key={day} className="h-8 w-9 flex items-center justify-center text-xs font-semibold text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
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