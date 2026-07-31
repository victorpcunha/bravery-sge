'use client'

import { useState } from 'react'
import { CalendarIcon, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { CompromissoInput, Compromisso } from '@/lib/actions/agenda'

type Categoria = 'reuniao' | 'aula' | 'formacao' | 'outro'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (input: CompromissoInput) => Promise<{ data?: Compromisso; error?: string }>
}

export function AgendaModalNovo({ open, onOpenChange, onSave }: Props) {
  const [titulo, setTitulo] = useState('')
  const [diaTodo, setDiaTodo] = useState(false)
  const [dataInicial, setDataInicial] = useState<Date | undefined>(undefined)
  const [dataFinal, setDataFinal] = useState<Date | undefined>(undefined)
  const [categoria, setCategoria] = useState<Categoria>('outro')
  const [horarioInicial, setHorarioInicial] = useState('')
  const [horarioFinal, setHorarioFinal] = useState('')
  const [detalhes, setDetalhes] = useState('')
  const [loading, setLoading] = useState(false)

  const validar = (): string | null => {
    if (!titulo.trim()) return 'Título é obrigatório'
    if (!dataInicial) return 'Data inicial é obrigatória'
    if (!dataFinal) return 'Data final é obrigatória'
    if (!diaTodo) {
      if (!horarioInicial) return 'Horário inicial é obrigatório'
      if (!horarioFinal) return 'Horário final é obrigatório'
    }
    return null
  }

  const handleSalvar = async () => {
    const erro = validar()
    if (erro) {
      toast.error(erro)
      return
    }

    setLoading(true)

    const input: CompromissoInput = {
      titulo: titulo.trim(),
      data_inicial: format(dataInicial!, 'yyyy-MM-dd'),
      data_final: format(dataFinal!, 'yyyy-MM-dd'),
      horario_inicial: diaTodo ? null : horarioInicial || null,
      horario_final: diaTodo ? null : horarioFinal || null,
      dia_todo: diaTodo,
      categoria,
      detalhes: detalhes.trim() || null,
    }

    const result = await onSave(input)

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Compromisso adicionado com sucesso')
    onOpenChange(false)
    limparForm()
  }

  const limparForm = () => {
    setTitulo('')
    setDiaTodo(false)
    setDataInicial(undefined)
    setDataFinal(undefined)
    setCategoria('outro')
    setHorarioInicial('')
    setHorarioFinal('')
    setDetalhes('')
  }

  return (
    <Dialog open={open} onOpenChange={(v) => {
      if (!v) limparForm()
      onOpenChange(v)
    }}>
      <DialogContent className="p-0 gap-0 flex flex-col max-h-[90vh] max-w-lg">
        <DialogHeader className="shrink-0 border-b border-border px-6 py-4">
          <DialogTitle className="text-[16px] font-semibold">
            Adicionar Novo Compromisso
          </DialogTitle>
          <DialogDescription className="text-[13px] text-muted-foreground">
            Preencha os dados do compromisso
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="agenda-titulo" className="text-[14px] font-medium text-foreground">
              Título do Compromisso <span className="text-destructive">*</span>
            </label>
            <Input
              id="agenda-titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Reunião com coordenadores"
              aria-required="true"
            />
          </div>

          <button
            type="button"
            onClick={() => setDiaTodo(!diaTodo)}
            aria-pressed={diaTodo}
            className={cn(
              'inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 text-[13px] font-medium transition-colors',
              diaTodo
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'bg-card text-muted-foreground border-border hover:bg-muted'
            )}
          >
            {diaTodo && <span className="text-primary">✓</span>}
            Dia todo
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[14px] font-medium text-foreground">
                Data inicial <span className="text-destructive">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !dataInicial && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataInicial ? format(dataInicial, "dd 'de' MMM", { locale: ptBR }) : 'Selecionar'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataInicial}
                    onSelect={setDataInicial}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-medium text-foreground">
                Data final <span className="text-destructive">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !dataFinal && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataFinal ? format(dataFinal, "dd 'de' MMM", { locale: ptBR }) : 'Selecionar'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataFinal}
                    onSelect={setDataFinal}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[14px] font-medium text-foreground">
              Categoria
            </label>
            <Select value={categoria} onValueChange={(v) => setCategoria(v as Categoria)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reuniao">Reunião</SelectItem>
                <SelectItem value="aula">Aula</SelectItem>
                <SelectItem value="formacao">Formação</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!diaTodo && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="agenda-hora-ini" className="text-[14px] font-medium text-foreground">
                  Horário inicial <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="agenda-hora-ini"
                    type="time"
                    value={horarioInicial}
                    onChange={(e) => setHorarioInicial(e.target.value)}
                    className="pl-9"
                    aria-required="true"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="agenda-hora-fim" className="text-[14px] font-medium text-foreground">
                  Horário final <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="agenda-hora-fim"
                    type="time"
                    value={horarioFinal}
                    onChange={(e) => setHorarioFinal(e.target.value)}
                    className="pl-9"
                    aria-required="true"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="agenda-detalhes" className="text-[14px] font-medium text-foreground">
              Detalhes
            </label>
            <Textarea
              id="agenda-detalhes"
              value={detalhes}
              onChange={(e) => setDetalhes(e.target.value)}
              placeholder="Informações complementares..."
              rows={3}
            />
          </div>
        </div>

        <div className="shrink-0 border-t border-border px-6 py-3 flex justify-end gap-2 bg-muted/30">
          <Button
            variant="outline"
            onClick={() => {
              limparForm()
              onOpenChange(false)
            }}
            className="min-h-[40px] sm:min-h-[44px]"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSalvar}
            disabled={loading}
            className="min-h-[40px] sm:min-h-[44px]"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
