'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FormCard } from '@/components/layout/form-card'
import { ClickablePill } from '@/components/ui/clickable-pill'
import { ProfissionaisSelectField } from './profissionais-select-field'
import { AlunosSelectField } from './alunos-select-field'
import { CalendarIcon, Loader2, Save, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useState } from 'react'
import type { TipoOcorrencia } from '@/lib/actions/ocorrencias'

export type OcorrenciaFormValues = {
  titulo: string
  tipo: TipoOcorrencia | null
  dataOcorrencia: string
  detalhes: string
  apresentarPortal: boolean
  profissionalIds: string[]
  alunoIds: string[]
}

export type OcorrenciaFormInitial = Partial<OcorrenciaFormValues> & {
  nomesProfissionais?: Record<string, string>
  nomesAlunos?: Record<string, string>
}

type OcorrenciaFormProps = {
  schoolId: string
  pessoaId?: string | null
  initial?: OcorrenciaFormInitial
  saving: boolean
  submitLabel?: string
  onCancel: () => void
  onSave: (values: OcorrenciaFormValues) => void
}

const MAX_DESCRICAO = 500

function parseDataLocal(iso: string): Date | undefined {
  if (!iso) return undefined
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return undefined
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
}

export function OcorrenciaForm({ schoolId, pessoaId, initial, saving, submitLabel = 'Salvar', onCancel, onSave }: OcorrenciaFormProps) {
  const [titulo, setTitulo] = useState(initial?.titulo ?? '')
  const [tipo, setTipo] = useState<TipoOcorrencia | null>(initial?.tipo ?? null)
  const [dataOcorrencia, setDataOcorrencia] = useState(initial?.dataOcorrencia ?? '')
  const [detalhes, setDetalhes] = useState(initial?.detalhes ?? '')
  const [apresentarPortal, setApresentarPortal] = useState(initial?.apresentarPortal ?? false)
  const [profissionalIds, setProfissionalIds] = useState<string[]>(initial?.profissionalIds ?? [])
  const [alunoIds, setAlunoIds] = useState<string[]>(initial?.alunoIds ?? [])

  const dataSelecionada = parseDataLocal(dataOcorrencia)

  const handleSave = () => {
    if (titulo.trim().length < 3) {
      toast.error('Informe o título da ocorrência (mínimo 3 caracteres)')
      return
    }
    if (!tipo) {
      toast.error('Selecione o tipo da ocorrência (Positiva ou Negativa)')
      return
    }
    if (!dataSelecionada) {
      toast.error('Informe uma data válida para a ocorrência')
      return
    }
    if (profissionalIds.length === 0) {
      toast.error('Selecione ao menos um profissional da ocorrência')
      return
    }
    if (alunoIds.length === 0) {
      toast.error('Selecione ao menos um aluno envolvido')
      return
    }
    if (!detalhes.trim()) {
      toast.error('Informe a descrição da ocorrência')
      return
    }
    if (detalhes.trim().length > MAX_DESCRICAO) {
      toast.error(`A descrição está limitada a ${MAX_DESCRICAO} caracteres`)
      return
    }
    onSave({
      titulo: titulo.trim(),
      tipo,
      dataOcorrencia: format(dataSelecionada, 'yyyy-MM-dd'),
      detalhes: detalhes.trim(),
      apresentarPortal,
      profissionalIds,
      alunoIds,
    })
  }

  return (
    <div className="space-y-6">
      <FormCard title="Identificação">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="ocorrencia-titulo" className="text-[14px] font-medium">Título *</Label>
            <Input
              id="ocorrencia-titulo"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder="Ex: Agressão no recreio"
              maxLength={150}
              className="mt-1 h-10"
              aria-required="true"
            />
          </div>

          <div className="sm:col-span-2">
            <Label className="text-[14px] font-medium">Tipo *</Label>
            <div className="flex flex-wrap gap-2 mt-1" role="group" aria-label="Tipo da ocorrência">
              <ClickablePill label="Positiva" active={tipo === 'positiva'} onClick={() => setTipo('positiva')} />
              <ClickablePill label="Negativa" active={tipo === 'negativa'} onClick={() => setTipo('negativa')} />
            </div>
          </div>

          <div>
            <Label className="text-[14px] font-medium">Data da ocorrência *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'mt-1 h-10 w-full justify-start text-left font-normal',
                    !dataSelecionada && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                  {dataSelecionada ? format(dataSelecionada, 'dd/MM/yyyy') : 'Selecione a data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dataSelecionada}
                  onSelect={(d) => setDataOcorrencia(d ? format(d, 'yyyy-MM-dd') : '')}
                  captionLayout="dropdown"
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="sm:col-span-2 flex items-end pb-0.5">
            <ClickablePill
              label="Apresentar ocorrência no Portal"
              active={apresentarPortal}
              onClick={() => setApresentarPortal(v => !v)}
              title="Quando ativo, a ocorrência fica sinalizada para exibição no Portal dos Responsáveis"
            />
          </div>
        </div>
      </FormCard>

      <FormCard title="Detalhes">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ProfissionaisSelectField
            schoolId={schoolId}
            values={profissionalIds}
            onChange={setProfissionalIds}
            pessoaId={pessoaId}
            nomesIniciais={initial?.nomesProfissionais}
          />
          <AlunosSelectField
            schoolId={schoolId}
            values={alunoIds}
            onChange={setAlunoIds}
            nomesIniciais={initial?.nomesAlunos}
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="ocorrencia-descricao" className="text-[14px] font-medium">Descrição *</Label>
            <span className="text-[13px] text-muted-foreground tabular-nums" aria-live="polite">
              {detalhes.length}/{MAX_DESCRICAO}
            </span>
          </div>
          <Textarea
            id="ocorrencia-descricao"
            value={detalhes}
            onChange={e => setDetalhes(e.target.value)}
            placeholder="Descreva o ocorrido..."
            rows={5}
            maxLength={MAX_DESCRICAO + 50}
            className="mt-1"
            aria-required="true"
          />
        </div>
      </FormCard>

      <div className="sticky bottom-0 z-10 -mx-4 px-4 py-3 bg-background/95 backdrop-blur border-t border-border flex justify-end gap-3">
        <Button variant="outline" size="lg" className="h-11 min-w-[120px]" onClick={onCancel} disabled={saving}>
          <X className="h-4 w-4 mr-1.5" />
          Cancelar
        </Button>
        <Button size="lg" className="h-11 min-w-[140px] shadow-md" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
          {saving ? 'Salvando...' : submitLabel}
        </Button>
      </div>
    </div>
  )
}
