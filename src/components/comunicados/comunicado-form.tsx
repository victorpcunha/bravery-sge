'use client'

import { useState, useEffect, useRef } from 'react'
import { getTurmas } from '@/lib/actions/turmas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FormCard } from '@/components/layout/form-card'
import { ClickablePill } from '@/components/ui/clickable-pill'
import { PeriodoDatasField, HoraField } from '@/components/comunicados/periodo-visibilidade-field'
import { Loader2, Save, X, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export type ComunicadoFormValues = {
  turmaIds: string[]
  titulo: string
  descricao: string
  dataInicio: string
  dataFim: string
  horaInicio: string
  horaFim: string
}

type ComunicadoFormProps = {
  schoolId: string
  anoLetivo: { id: string; descricao: string }
  initial?: Partial<ComunicadoFormValues>
  saving: boolean
  submitLabel?: string
  onCancel: () => void
  onSave: (values: ComunicadoFormValues) => void
}

type TurmaOpcao = {
  id: string
  nome: string
  etapa_ensino_id: string
  etapaNome: string
  etapaTipo: string
}

const ETAPA_TIPO_LABELS: Record<string, string> = {
  infantil: 'Educação Infantil',
  fundamental_inicial: 'Fundamental (Anos Iniciais)',
  fundamental_final: 'Fundamental (Anos Finais)',
  fundamental_outros: 'Fundamental (Outros)',
  medio: 'Ensino Médio',
  eja: 'EJA',
}

function agruparTurmas(turmas: TurmaOpcao[]): Array<{ chave: string; rotulo: string; itens: TurmaOpcao[] }> {
  const grupos = new Map<string, TurmaOpcao[]>()
  for (const t of turmas) {
    const chave = t.etapa_ensino_id || 'outros'
    if (!grupos.has(chave)) grupos.set(chave, [])
    grupos.get(chave)!.push(t)
  }
  return [...grupos.entries()].map(([chave, itens]) => ({
    chave,
    rotulo: ETAPA_TIPO_LABELS[itens[0]?.etapaTipo] || itens[0]?.etapaNome || 'Outras turmas',
    itens,
  }))
}

export function ComunicadoForm({ schoolId, anoLetivo, initial, saving, submitLabel = 'Salvar', onCancel, onSave }: ComunicadoFormProps) {
  const [turmasCarregadas, setTurmasCarregadas] = useState(false)
  const [turmas, setTurmas] = useState<TurmaOpcao[]>([])
  const [turmaIds, setTurmaIds] = useState<string[]>(initial?.turmaIds ?? [])
  const [titulo, setTitulo] = useState(initial?.titulo ?? '')
  const [descricao, setDescricao] = useState(initial?.descricao ?? '')
  const [dataInicio, setDataInicio] = useState(initial?.dataInicio ?? '')
  const [dataFim, setDataFim] = useState(initial?.dataFim ?? '')
  const [horaInicio, setHoraInicio] = useState(initial?.horaInicio ?? '')
  const [horaFim, setHoraFim] = useState(initial?.horaFim ?? '')
  const inicializado = useRef(false)

  useEffect(() => {
    if (!schoolId || !anoLetivo.id) return
    getTurmas(schoolId, undefined, undefined, anoLetivo.id)
      .then(list => {
        setTurmas(list.map((t: {
          id: string
          nome: string
          etapa_ensino_id: string
          academico_etapas_ensino?: { etapa_nome: string; etapa_tipo: string } | null
        }) => ({
          id: t.id,
          nome: t.nome,
          etapa_ensino_id: t.etapa_ensino_id,
          etapaNome: t.academico_etapas_ensino?.etapa_nome ?? '',
          etapaTipo: t.academico_etapas_ensino?.etapa_tipo ?? '',
        })))
        setTurmasCarregadas(true)
      })
      .catch(() => {
        setTurmasCarregadas(true)
        toast.error('Erro ao carregar turmas')
      })
  }, [schoolId, anoLetivo.id])

  useEffect(() => {
    if (inicializado.current || !turmasCarregadas) return
    inicializado.current = true
    if (!initial?.turmaIds) {
      setTurmaIds(turmas.map(t => t.id))
    }
  }, [turmasCarregadas, turmas, initial?.turmaIds])

  const turmasAgrupadas = agruparTurmas(turmas)

  const toggleTurma = (id: string) => {
    setTurmaIds(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
  }

  const handleSave = () => {
    if (turmaIds.length === 0) {
      toast.error('Selecione ao menos uma turma')
      return
    }
    if (!titulo.trim()) {
      toast.error('Informe o título do comunicado')
      return
    }
    if (!descricao.trim()) {
      toast.error('Informe a descrição do comunicado')
      return
    }
    if (!dataInicio || !dataFim || !horaInicio || !horaFim) {
      toast.error('Informe o período completo de visualização (datas e horários)')
      return
    }
    const de = new Date(`${dataInicio}T${horaInicio}:00`)
    const ate = new Date(`${dataFim}T${horaFim}:00`)
    if (de.getTime() >= ate.getTime()) {
      toast.error('O fim da visualização deve ser posterior ao início')
      return
    }
    onSave({
      turmaIds,
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      dataInicio,
      dataFim,
      horaInicio,
      horaFim,
    })
  }

  return (
    <div className="space-y-6">
      <FormCard title="Identificação" description="Ano letivo e turmas do comunicado">
        <div>
          <Label className="text-[14px] font-medium">Ano Letivo</Label>
          <Input value={anoLetivo.descricao} disabled className="mt-1 h-10 max-w-[160px]" aria-label="Ano letivo (fixo)" />
        </div>

        <div>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Label className="text-[14px] font-medium">Turmas *</Label>
            {turmas.length > 0 && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setTurmaIds(turmas.map(t => t.id))}>Selecionar todas</Button>
                <Button variant="destructive" size="sm" onClick={() => setTurmaIds([])}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpar
                </Button>
              </div>
            )}
          </div>
          {turmas.length === 0 ? (
            <p className="text-[15px] text-muted-foreground mt-1.5">Nenhuma turma encontrada para este ano letivo.</p>
          ) : (
            <div className="space-y-3 mt-1.5">
              {turmasAgrupadas.map(grupo => (
                <div key={grupo.chave}>
                  <p className="text-[13px] font-semibold text-foreground mb-1.5">{grupo.rotulo}</p>
                  <div className="flex flex-wrap gap-2">
                    {grupo.itens.map(t => (
                      <ClickablePill
                        key={t.id}
                        label={t.nome}
                        active={turmaIds.includes(t.id)}
                        onClick={() => toggleTurma(t.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </FormCard>

      <FormCard title="Detalhes do Comunicado" description="Título, período de visualização e descrição">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="comunicado-titulo" className="text-[14px] font-medium">Título *</Label>
            <Input
              id="comunicado-titulo"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder="Ex: Reforma"
              maxLength={200}
              className="mt-1 h-10"
              aria-required="true"
            />
          </div>

          <PeriodoDatasField
            dataInicio={dataInicio}
            dataFim={dataFim}
            onDataInicio={setDataInicio}
            onDataFim={setDataFim}
          />

          <HoraField
            id="comunicado-hora-ini"
            label="Horário inicial"
            value={horaInicio}
            onChange={setHoraInicio}
          />

          <HoraField
            id="comunicado-hora-fim"
            label="Horário final"
            value={horaFim}
            onChange={setHoraFim}
          />
        </div>

        <div>
          <Label htmlFor="comunicado-descricao" className="text-[14px] font-medium">Descrição *</Label>
          <Textarea
            id="comunicado-descricao"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            placeholder="Descreva o comunicado..."
            rows={5}
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
