'use client'

import * as React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { ChevronsUpDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
  searchLabel?: string
}

interface ComboboxProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
  label?: string
  /** Máximo de itens renderizados na lista. Default: 200 */
  maxOptions?: number
  /** Mínimo de caracteres para começar a filtrar. 0 = mostra todos ao focar. Default: 0 */
  searchThreshold?: number
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'Nenhum resultado encontrado.',
  className,
  disabled = false,
  label,
  maxOptions = 200,
  searchThreshold = 0,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const selected = options.find(o => o.value === value)

  const filtered = React.useMemo(() => {
    if (searchThreshold > 0 && search.length < searchThreshold) return []
    const q = search.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return options
      .filter(o => {
        if (!q) return true
        const label = o.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        const sLabel = (o.searchLabel || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        return label.includes(q) || sLabel.includes(q)
      })
      .slice(0, maxOptions)
  }, [options, search, maxOptions, searchThreshold])

  React.useEffect(() => {
    if (open) setSearch('')
  }, [open])

  return (
    <div className={cn('space-y-2', className)}>
      {label && <label className="text-foreground font-medium block text-sm">{label}</label>}
      <Popover open={open && !disabled} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'w-full justify-between font-normal border-border bg-card hover:bg-card h-9 px-2.5',
              !value && 'text-muted-foreground'
            )}
          >
            <span className="truncate">{selected ? selected.label : placeholder}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput placeholder={searchPlaceholder} value={search} onValueChange={setSearch} />
            <CommandList>
              {searchThreshold > 0 && search.length < searchThreshold ? (
                <CommandEmpty>Digite pelo menos {searchThreshold} caracteres para buscar.</CommandEmpty>
              ) : filtered.length === 0 ? (
                <CommandEmpty>{emptyMessage}</CommandEmpty>
              ) : (
                <CommandGroup>
                  {filtered.map(option => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => {
                        onChange(option.value)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === option.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
