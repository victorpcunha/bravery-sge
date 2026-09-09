'use client'

import * as React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { ChevronsUpDown, Check, X, BrushCleaning } from 'lucide-react'
import { cn } from '@/lib/utils'

export type MultiSelectOption = {
  value: string
  label: string
  searchLabel?: string
}

type MultiSelectFieldProps = {
  options: MultiSelectOption[]
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
  label?: string
  /** Máximo de itens renderizados na lista. Default: 200 */
  maxOptions?: number
  /** Exibe o botão "Limpar tudo". Default: true */
  showClearAll?: boolean
  /** Texto do trigger quando há seleção. `{n}` = quantidade. Default: '{n} selecionado(s)' */
  selectedLabel?: string
  /** Busca controlada (modo assíncrono): texto atual */
  searchText?: string
  /** Busca controlada (modo assíncrono): callback de alteração */
  onSearchTextChange?: (value: string) => void
  /** Classe extra do rótulo (ex.: padrão de filtros) */
  labelClassName?: string
  /** Modo seleção única: exibe o nome dentro do campo, sem chips. Default: false */
  single?: boolean
}

function normalizar(texto: string): string {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function MultiSelectField({
  options,
  values,
  onChange,
  placeholder = 'Selecione...',
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'Nenhum resultado encontrado.',
  className,
  disabled = false,
  label,
  maxOptions = 200,
  showClearAll = true,
  selectedLabel = '{n} selecionado(s)',
  searchText: controlledSearch,
  onSearchTextChange,
  labelClassName,
  single = false,
}: MultiSelectFieldProps) {
  const [open, setOpen] = React.useState(false)
  const [innerSearch, setInnerSearch] = React.useState('')
  const search = controlledSearch ?? innerSearch
  const setSearch = onSearchTextChange ?? setInnerSearch

  const porValor = React.useMemo(() => new Map(options.map(o => [o.value, o])), [options])
  const selecionados = values.map(v => porValor.get(v)).filter((o): o is MultiSelectOption => !!o)

  const filtered = React.useMemo(() => {
    const q = normalizar(search)
    return options
      .filter(o => {
        if (!q) return true
        return normalizar(o.label).includes(q) || normalizar(o.searchLabel || '').includes(q)
      })
      .slice(0, maxOptions)
  }, [options, search, maxOptions])

  React.useEffect(() => {
    if (open && controlledSearch === undefined) setInnerSearch('')
  }, [open, controlledSearch])

  const toggle = (value: string) => {
    if (single) {
      onChange(values.includes(value) ? [] : [value])
      setOpen(false)
      return
    }
    onChange(values.includes(value) ? values.filter(v => v !== value) : [...values, value])
  }

  const unico = single ? selecionados[0] : undefined

  return (
    <div className={cn('space-y-2', className)}>
      {label && <label className={cn('text-foreground font-medium block text-sm leading-none', labelClassName)}>{label}</label>}
      <Popover open={open && !disabled} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'w-full justify-between font-normal border-border bg-card hover:bg-card h-10 px-2.5',
              (single ? !unico : values.length === 0) && 'text-muted-foreground'
            )}
          >
            <span className="truncate">
              {single ? (unico?.label ?? placeholder) : values.length === 0 ? placeholder : selectedLabel.replace('{n}', String(values.length))}
            </span>
            <span className="ml-2 flex shrink-0 items-center gap-1">
              {single && unico && !disabled && (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Remover ${unico.label}`}
                  onClick={e => {
                    e.stopPropagation()
                    onChange([])
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      e.stopPropagation()
                      onChange([])
                    }
                  }}
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full opacity-50 hover:opacity-100 hover:bg-muted-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </span>
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput placeholder={searchPlaceholder} value={search} onValueChange={setSearch} />
            <CommandList>
              {filtered.length === 0 ? (
                <CommandEmpty>{emptyMessage}</CommandEmpty>
              ) : (
                <CommandGroup>
                  {filtered.map(option => {
                    const ativo = values.includes(option.value)
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={() => toggle(option.value)}
                      >
                        <Check className={cn('mr-2 h-4 w-4', ativo ? 'opacity-100' : 'opacity-0')} />
                        {option.label}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {!single && selecionados.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {selecionados.map(o => (
            <span
              key={o.value}
              className="inline-flex items-center gap-1 rounded-sm border border-primary/20 bg-primary/10 py-0.5 pl-2 pr-1 text-[13px] font-normal text-primary"
            >
              <span className="max-w-[180px] truncate">{o.label}</span>
              <button
                type="button"
                aria-label={`Remover ${o.label}`}
                disabled={disabled}
                onClick={() => toggle(o.value)}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </span>
          ))}
          {showClearAll && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={disabled}
              onClick={() => onChange([])}
            >
              <BrushCleaning className="mr-2 h-4 w-4" />
              Limpar tudo
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
