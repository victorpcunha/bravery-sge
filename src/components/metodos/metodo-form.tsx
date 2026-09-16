'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { ClickablePill } from '@/components/ui/clickable-pill'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Plus, Trash2, Info } from 'lucide-react'
import { getMetodoCompleto, saveMetodo, type MetodoConceito, type MetodoNivel } from '@/lib/actions/metodos'
import { useAuth } from '@/components/providers/auth-provider'
import { toast } from 'sonner'

type FormData = {
  id?: string
  nome: string
  criterio_frequencia: string
  frecuencia_minima: number
  faixa_atencao_pp: number
  tipos_avaliacao: { numerico: boolean; parecer: boolean; conceito: boolean; nivel: boolean }
  quantidade_periodos_numerico: number
  quantidade_periodos_parecer: number
  quantidade_periodos_conceito: number
  quantidade_periodos_nivel: number
  ativo: boolean

  forma_registro: string
  permite_recuperacao: string[]
  tipo_media_periodo: string
  tipo_resultado_final: string
  media_maxima_periodo: number
  permite_conselho_componente: boolean
  atribui_media_minima_conselho: boolean
  usa_media_5_conceito: boolean
  permite_recuperacao_final_reprovados: boolean
  recuperacao_substitutiva: boolean
  recuperacao_periodo_substitutiva: boolean
  recuperacao_final_substitutiva: boolean
  realizava_avaliacao_reclassificacao: boolean
  limitar_avaliacoes: boolean
  avaliacoes_list: { nome: string; peso: number; nota_maxima: number }[]

  aprovacao_automatica: boolean
  media_minima: number
  pesos_periodos: number[]
  permite_recuperacao_final: boolean
  media_minima_recuperacao: number
  usa_media_ponderada_recuperacao: boolean
  peso_media_anual: number
  peso_recuperacao_final: number

  tipo_arredondamento: string
  intervalo_inicial: number
  intervalo_final: number
  margem_decimal: number
  aplica_media_periodo: boolean
  aplica_media_anual: boolean
  aplica_media_final: boolean

  registro_geral: boolean
  conceitos: MetodoConceito[]
  niveis: MetodoNivel[]
}

const defaultForm: FormData = {
  nome: '',
  criterio_frequencia: 'por_dia',
  frecuencia_minima: 75,
  faixa_atencao_pp: 5,
  tipos_avaliacao: { numerico: false, parecer: false, conceito: false, nivel: false },
  quantidade_periodos_numerico: 4,
  quantidade_periodos_parecer: 4,
  quantidade_periodos_conceito: 4,
  quantidade_periodos_nivel: 4,
  ativo: true,

  forma_registro: 'decimal',
  permite_recuperacao: [],
  tipo_media_periodo: 'ponderada',
  tipo_resultado_final: 'media_periodos',
  media_maxima_periodo: 10,
  permite_conselho_componente: false,
  atribui_media_minima_conselho: false,
  usa_media_5_conceito: false,
  permite_recuperacao_final_reprovados: false,
  recuperacao_substitutiva: false,
  recuperacao_periodo_substitutiva: false,
  recuperacao_final_substitutiva: false,
  realizava_avaliacao_reclassificacao: false,
  limitar_avaliacoes: false,
  avaliacoes_list: [],

  aprovacao_automatica: false,
  media_minima: 7,
  pesos_periodos: [1, 1, 1, 1],
  permite_recuperacao_final: false,
  media_minima_recuperacao: 5,
  usa_media_ponderada_recuperacao: false,
  peso_media_anual: 1,
  peso_recuperacao_final: 1,

  tipo_arredondamento: 'nenhum',
  intervalo_inicial: 3,
  intervalo_final: 7,
  margem_decimal: 5,
  aplica_media_periodo: false,
  aplica_media_anual: false,
  aplica_media_final: true,

  registro_geral: false,
  conceitos: [],
  niveis: [],
}

const tooltips: Record<string, string> = {
  permite_conselho_componente: 'Habilita conselho de classe por componente curricular, permitindo que cada disciplina tenha seu próprio conselho.',
  atribui_media_minima_conselho: 'Atribui automaticamente a média mínima para alunos aprovados em Conselho de Classe.',
  usa_media_5_conceito: 'Esta média não é uma recuperação. Após informada, irá substituir a média final do aluno.',
  permite_recuperacao_final_reprovados: 'Restringe a recuperação final apenas para alunos reprovados.',
  recuperacao_substitutiva: 'Ao marcar, a nota da recuperação substitui a nota original da avaliação. Se desmarcado, o sistema mantém a maior nota.',
  recuperacao_periodo_substitutiva: 'Ao marcar, o sistema mantém a maior nota entre a média do período e a recuperação.',
  recuperacao_final_substitutiva: 'Ao marcar, o sistema mantém a maior nota entre a média anual e a recuperação. Se desmarcado, a nota da recuperação substitui a média anual.',
  realizava_avaliacao_reclassificacao: 'Habilita uma nova avaliação para alunos sem frequência mínima mas com nota mínima para aprovação.',
}

function CheckboxWithTooltip({
  id,
  checked,
  onCheckedChange,
  label,
  tooltipKey,
}: {
  id: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
  label: string
  tooltipKey: string
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <Label htmlFor={id} className="cursor-pointer flex items-center gap-1">
        {label}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-muted-foreground cursor-help transition-colors" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{tooltips[tooltipKey]}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
    </div>
  )
}

interface Props {
  schoolId: string | null
  editId: string | null
  onSaved: () => void
  onCancel: () => void
}

export function MetodoForm({ schoolId, editId, onSaved, onCancel }: Props) {
  const { pessoaId } = useAuth()
  const [form, setForm] = useState<FormData>({ ...defaultForm, pesos_periodos: [...defaultForm.pesos_periodos] })
  const [saving, setSaving] = useState(false)
  const [loadingEdit, setLoadingEdit] = useState(false)

  useEffect(() => {
    if (!editId) {
      setForm({ ...defaultForm, pesos_periodos: [...defaultForm.pesos_periodos] })
      return
    }
    setLoadingEdit(true)
    getMetodoCompleto(editId)
      .then((data) => {
        const p = data.principal
        const n = data.numerico
        const a = data.aprovacao
        const ar = data.arredondamento
        const par = data.parecer
        setForm({
          id: p.id,
          nome: p.nome || '',
          criterio_frequencia: p.criterio_frequencia || 'por_dia',
          frecuencia_minima: p.frecuencia_minima ?? 75,
          faixa_atencao_pp: Number((p as unknown as Record<string, unknown>)?.faixa_atencao_pp ?? 5),
          tipos_avaliacao: {
            numerico: !!(p.tipos_avaliacao as Record<string, boolean>)?.numerico,
            parecer: !!(p.tipos_avaliacao as Record<string, boolean>)?.parecer,
            conceito: !!(p.tipos_avaliacao as Record<string, boolean>)?.conceito,
            nivel: !!(p.tipos_avaliacao as Record<string, boolean>)?.nivel,
          },
          quantidade_periodos_numerico: p.quantidade_periodos_numerico ?? 4,
          quantidade_periodos_parecer: p.quantidade_periodos_parecer ?? 4,
          quantidade_periodos_conceito: p.quantidade_periodos_conceito ?? 4,
          quantidade_periodos_nivel: p.quantidade_periodos_nivel ?? 4,
          ativo: p.ativo ?? true,

          forma_registro: n?.forma_registro || 'decimal',
          permite_recuperacao: n?.permite_recuperacao ? n.permite_recuperacao.split(',').filter(Boolean) : [],
          tipo_media_periodo: n?.tipo_media_periodo || 'ponderada',
          tipo_resultado_final: n?.tipo_resultado_final || 'media_periodos',
          media_maxima_periodo: n?.media_maxima_periodo ?? 10,
          permite_conselho_componente: n?.permite_conselho_componente ?? false,
          atribui_media_minima_conselho: n?.atribui_media_minima_conselho ?? false,
          usa_media_5_conceito: n?.usa_media_5_conceito ?? false,
          permite_recuperacao_final_reprovados: n?.permite_recuperacao_final_reprovados ?? false,
          recuperacao_substitutiva: n?.recuperacao_substitutiva ?? false,
          recuperacao_periodo_substitutiva: n?.recuperacao_periodo_substitutiva ?? false,
          recuperacao_final_substitutiva: n?.recuperacao_final_substitutiva ?? false,
          realizava_avaliacao_reclassificacao: n?.realizava_avaliacao_reclassificacao ?? false,
          limitar_avaliacoes: (n as any)?.limitar_avaliacoes ?? false,
          avaliacoes_list: (n as any)?.avaliacoes_list ?? [],

          aprovacao_automatica: a?.aprovacao_automatica ?? false,
          media_minima: a?.media_minima ?? 7,
          pesos_periodos: Array.isArray(a?.pesos_periodos) ? [...a.pesos_periodos] : [1, 1, 1, 1],
          permite_recuperacao_final: a?.permite_recuperacao_final ?? false,
          media_minima_recuperacao: a?.media_minima_recuperacao ?? 5,
          usa_media_ponderada_recuperacao: a?.usa_media_ponderada_recuperacao ?? false,
          peso_media_anual: a?.peso_media_anual ?? 1,
          peso_recuperacao_final: a?.peso_recuperacao_final ?? 1,

          tipo_arredondamento: ar?.tipo_arredondamento || 'nenhum',
          intervalo_inicial: ar?.intervalo_inicial ?? 3,
          intervalo_final: ar?.intervalo_final ?? 7,
          margem_decimal: ar?.margem_decimal ?? 5,
          aplica_media_periodo: ar?.aplica_media_periodo ?? false,
          aplica_media_anual: ar?.aplica_media_anual ?? false,
          aplica_media_final: ar?.aplica_media_final ?? true,

          registro_geral: par?.registro_geral ?? false,
          conceitos: data.conceitos || [],
          niveis: data.niveis || [],
        })
      })
      .catch((err) => {
        console.error('Erro ao carregar método:', err)
        toast.error('Erro ao carregar dados do método')
      })
      .finally(() => setLoadingEdit(false))
  }, [editId])

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    if (!form.nome.trim()) {
      toast.error('O campo Descrição é obrigatório')
      return
    }

    setSaving(true)
    try {
      const payload = {
        principal: {
          id: form.id,
          nome: form.nome,
          ativo: form.ativo,
          criterio_frequencia: form.criterio_frequencia,
          frecuencia_minima: form.frecuencia_minima,
          faixa_atencao_pp: Math.min(50, Math.max(0, Number(form.faixa_atencao_pp) || 0)),
          tipos_avaliacao: form.tipos_avaliacao,
          quantidade_periodos_numerico: form.tipos_avaliacao.numerico ? form.quantidade_periodos_numerico : null,
          quantidade_periodos_parecer: form.tipos_avaliacao.parecer ? form.quantidade_periodos_parecer : null,
          quantidade_periodos_conceito: form.tipos_avaliacao.conceito ? form.quantidade_periodos_conceito : null,
          quantidade_periodos_nivel: form.tipos_avaliacao.nivel ? form.quantidade_periodos_nivel : null,
        },
        numerico: form.tipos_avaliacao.numerico
          ? {
              forma_registro: form.forma_registro,
              permite_recuperacao: form.permite_recuperacao.length > 0 ? form.permite_recuperacao.join(',') : null,
              tipo_media_periodo: form.tipo_media_periodo,
              tipo_resultado_final: form.tipo_resultado_final,
              media_maxima_periodo: form.media_maxima_periodo,
              permite_conselho_componente: form.permite_conselho_componente,
              atribui_media_minima_conselho: form.atribui_media_minima_conselho,
              usa_media_5_conceito: form.usa_media_5_conceito,
              permite_recuperacao_final_reprovados: form.permite_recuperacao_final_reprovados,
              recuperacao_substitutiva: form.recuperacao_substitutiva,
              recuperacao_periodo_substitutiva: form.recuperacao_periodo_substitutiva,
              recuperacao_final_substitutiva: form.recuperacao_final_substitutiva,
              realizava_avaliacao_reclassificacao: form.realizava_avaliacao_reclassificacao,
              limitar_avaliacoes: form.limitar_avaliacoes,
              avaliacoes_list: form.avaliacoes_list,
            }
          : null,
        aprovacao: form.tipos_avaliacao.numerico
          ? {
              aprovacao_automatica: form.aprovacao_automatica,
              media_minima: form.media_minima,
              pesos_periodos: form.pesos_periodos,
              permite_recuperacao_final: form.permite_recuperacao.includes('final'),
              media_minima_recuperacao: form.media_minima_recuperacao,
              usa_media_ponderada_recuperacao: form.usa_media_ponderada_recuperacao,
              peso_media_anual: form.peso_media_anual,
              peso_recuperacao_final: form.peso_recuperacao_final,
            }
          : null,
        arredondamento: form.tipos_avaliacao.numerico
          ? {
              tipo_arredondamento: form.tipo_arredondamento === 'nenhum' ? null : form.tipo_arredondamento,
              intervalo_inicial: form.tipo_arredondamento === 'meio_ponto' ? form.intervalo_inicial : null,
              intervalo_final: form.tipo_arredondamento === 'meio_ponto' ? form.intervalo_final : null,
              margem_decimal: form.tipo_arredondamento === 'decimal' ? form.margem_decimal : null,
              aplica_media_periodo: form.aplica_media_periodo,
              aplica_media_anual: form.aplica_media_anual,
              aplica_media_final: form.aplica_media_final,
            }
          : null,
        parecer: form.tipos_avaliacao.parecer
          ? { registro_geral: form.registro_geral }
          : null,
        conceitos: form.tipos_avaliacao.conceito ? form.conceitos : [],
        niveis: form.tipos_avaliacao.nivel ? form.niveis : [],
      }

      await saveMetodo(schoolId, payload, pessoaId)
      toast.success(form.id ? 'Método atualizado com sucesso' : 'Método criado com sucesso')
      onSaved()
    } catch (err: unknown) {
      let message = 'Erro ao salvar método'
      if (err instanceof Error) {
        message = err.message
      } else if (err && typeof err === 'object') {
        const obj = err as Record<string, unknown>
        message = (obj?.message as string) || (obj?.error as string) || JSON.stringify(obj)
      }
      toast.error(message)
      console.error('save error:', JSON.stringify(err, Object.getOwnPropertyNames(err) as string[]))
    } finally {
      setSaving(false)
    }
  }

  if (loadingEdit) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  const handlePesoChange = (index: number, value: string) => {
    const novos = [...form.pesos_periodos]
    novos[index] = Number(value) || 1
    set('pesos_periodos', novos)
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 [&_[data-slot='input']]:border-border [&_[data-slot='input']]:focus-visible:border-primary [&_[data-slot='input']]:focus-visible:ring-2 [&_[data-slot='input']]:focus-visible:ring-primary/20 [&_[data-slot='checkbox']]:border-border [&_[data-slot='checkbox']]:data-[state=checked]:border-primary">
      <Card className="border-border shadow-sm">
        <CardHeader className="border-b border-border pb-4"><CardTitle className="text-base font-semibold text-foreground">Identificação</CardTitle></CardHeader>
        <CardContent className="space-y-5 px-6 pb-6 pt-0">
          <div className="space-y-2">
            <Label htmlFor="nome">Descrição</Label>
            <Input id="nome" value={form.nome} onChange={(e) => set('nome', e.target.value)} placeholder="Ex: Avaliação Regular" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Critério de Frequência</Label>
              <Select value={form.criterio_frequencia} onValueChange={(v) => set('criterio_frequencia', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent position="popper" side="bottom" sideOffset={5}>
                  <SelectItem value="por_dia">Por Dia Letivo</SelectItem>
                  <SelectItem value="por_aula">Por Aula Dada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frecuencia">Frequência Mínima (%)</Label>
              <Input id="frecuencia" type="number" min={0} max={100} value={form.frecuencia_minima} onChange={(e) => set('frecuencia_minima', Number(e.target.value) || 0)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="faixa_atencao">Faixa de Atenção (pp)</Label>
              <Input id="faixa_atencao" type="number" min={0} max={50} value={form.faixa_atencao_pp} onChange={(e) => set('faixa_atencao_pp', Number(e.target.value) || 0)} />
              <p className="text-[13px] text-muted-foreground">Pontos percentuais acima do mínimo p/ o Painel de Rendimento.</p>
            </div>

            <div className="space-y-2 pt-6">
              <Label>Status</Label>
              <div>
                <ClickablePill
                  label={form.ativo ? 'Ativo' : 'Inativo'}
                  active={form.ativo}
                  onClick={() => set('ativo', !form.ativo)}
                />
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          <div>
            <Label className="mb-3 block">Método de Avaliação</Label>
            <div className="space-y-3">
              {(['numerico', 'parecer', 'conceito', 'nivel'] as const).map((tipo) => {
                const labelMap: Record<string, string> = {
                  numerico: 'Numérico',
                  parecer: 'Parecer Descritivo',
                  conceito: 'Conceito',
                  nivel: 'Nível de Desenvolvimento',
                }
                const periodKey = `quantidade_periodos_${tipo}` as keyof FormData
                const periodValue = form[periodKey] as number
                return (
                  <div key={tipo} className="flex items-center justify-between gap-4 py-2 flex-wrap">
                    <ClickablePill
                      label={labelMap[tipo]}
                      active={form.tipos_avaliacao[tipo]}
                      onClick={() => set('tipos_avaliacao', { ...form.tipos_avaliacao, [tipo]: !form.tipos_avaliacao[tipo] })}
                    />
                    {form.tipos_avaliacao[tipo] && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Períodos:</span>
                        {[1, 2, 3, 4].map((n) => (
                          <Label key={n} className={`cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg border-2 text-sm font-semibold transition-all duration-150 ${periodValue === n ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20 ring-1 ring-primary/30' : 'border-border text-foreground hover:border-primary hover:text-primary hover:bg-primary/5 hover:shadow-sm'}`}>
                            <input
                              type="radio"
                              name={`periodo_${tipo}`}
                              checked={periodValue === n}
                              onChange={() => set(periodKey, n as never)}
                              className="sr-only"
                            />
                            {n}
                          </Label>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {form.tipos_avaliacao.numerico && (
        <>
          <Card className="border-border shadow-sm">
            <CardHeader className="border-b border-border pb-4"><CardTitle className="text-base font-semibold text-foreground">Configuração de Avaliações Numéricas</CardTitle></CardHeader>
            <CardContent className="space-y-5 px-6 pb-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 max-w-xs">
                  <LabelWithTooltip label="Forma de Registro da Avaliação" tooltip="Define se as notas são registradas como números inteiros (ex: 7) ou decimais (ex: 7.5)." />
                  <div className="flex flex-wrap gap-2 pt-1">
                    {([
                      { value: 'inteiro', label: 'Inteiro' },
                      { value: 'decimal', label: 'Decimal' },
                    ] as const).map((opt) => (
                      <ClickablePill
                        key={opt.value}
                        label={opt.label}
                        active={form.forma_registro === opt.value}
                        onClick={() => set('forma_registro', opt.value)}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <LabelWithTooltip label="Permite Recuperação" tooltip="Define em quais momentos o aluno pode fazer recuperação: por avaliação individual, por período (bimestre/semestre), e/ou final (após o ano letivo)." />
                  <div className="flex flex-wrap gap-2 pt-1">
                    {([
                      { value: 'avaliacao', label: 'Por Avaliação' },
                      { value: 'periodo', label: 'Por Período' },
                      { value: 'final', label: 'Final' },
                    ] as const).map((opt) => {
                      const checked = form.permite_recuperacao.includes(opt.value)
                      return (
                        <ClickablePill
                          key={opt.value}
                          label={opt.label}
                          active={checked}
                          onClick={() => {
                            if (checked) {
                              set('permite_recuperacao', form.permite_recuperacao.filter((x) => x !== opt.value))
                            } else {
                              set('permite_recuperacao', [...form.permite_recuperacao, opt.value])
                            }
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <LabelWithTooltip label="Tipo de Média do Período" tooltip="Ponderada: cada avaliação tem um peso. Somatória: soma simples das notas sem divisão." />
                  <div className="flex flex-wrap gap-2 pt-1">
                    {([
                      { value: 'ponderada', label: 'Ponderada' },
                      { value: 'somatoria', label: 'Somatória' },
                    ] as const).map((opt) => (
                      <ClickablePill
                        key={opt.value}
                        label={opt.label}
                        active={form.tipo_media_periodo === opt.value}
                        onClick={() => set('tipo_media_periodo', opt.value)}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <LabelWithTooltip label="Tipo de Resultado Final" tooltip="Média dos Períodos: soma os resultados dos períodos e divide pela quantidade. Somatória dos Períodos: soma direta sem divisão." />
                  <div className="flex flex-wrap gap-2 pt-1">
                    {([
                      { value: 'media_periodos', label: 'Média dos Períodos' },
                      { value: 'somatoria', label: 'Somatória dos Períodos' },
                    ] as const).map((opt) => (
                      <ClickablePill
                        key={opt.value}
                        label={opt.label}
                        active={form.tipo_resultado_final === opt.value}
                        onClick={() => set('tipo_resultado_final', opt.value)}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <LabelWithTooltip label="Média Máxima no Período" tooltip="Nota máxima que um aluno pode atingir em cada período. Ex: 10, 100, etc." />
                  <Input id="media_maxima" type="number" step="0.1" min={0} value={form.media_maxima_periodo} onChange={(e) => set('media_maxima_periodo', Number(e.target.value) || 0)} />
                </div>
              </div>

              <Separator className="bg-border" />

              <div className="space-y-3">
                <Label className="text-sm font-medium">Opções</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <CheckboxWithTooltip id="permite_conselho" checked={form.permite_conselho_componente} onCheckedChange={(v) => set('permite_conselho_componente', v)} label="Permite Conselho de Classe por Componente Curricular" tooltipKey="permite_conselho_componente" />
                <CheckboxWithTooltip id="atribui_media_minima" checked={form.atribui_media_minima_conselho} onCheckedChange={(v) => set('atribui_media_minima_conselho', v)} label="Atribui média mínima para aprovados em Conselho de Classe" tooltipKey="atribui_media_minima_conselho" />
                <CheckboxWithTooltip id="usa_media_5" checked={form.usa_media_5_conceito} onCheckedChange={(v) => set('usa_media_5_conceito', v)} label="Utiliza média 5º conceito" tooltipKey="usa_media_5_conceito" />
                {form.permite_recuperacao.includes('final') && (
                  <CheckboxWithTooltip id="rec_final_reprovados" checked={form.permite_recuperacao_final_reprovados} onCheckedChange={(v) => set('permite_recuperacao_final_reprovados', v)} label="Permite recuperação Final apenas para reprovados" tooltipKey="permite_recuperacao_final_reprovados" />
                )}
                {form.permite_recuperacao.includes('avaliacao') && (
                  <CheckboxWithTooltip id="rec_substitutiva" checked={form.recuperacao_substitutiva} onCheckedChange={(v) => set('recuperacao_substitutiva', v)} label="A recuperação por avaliação é substitutiva" tooltipKey="recuperacao_substitutiva" />
                )}
                {form.permite_recuperacao.includes('periodo') && (
                  <CheckboxWithTooltip id="rec_periodo_substitutiva" checked={form.recuperacao_periodo_substitutiva} onCheckedChange={(v) => set('recuperacao_periodo_substitutiva', v)} label="A recuperação por período é substitutiva" tooltipKey="recuperacao_periodo_substitutiva" />
                )}
                {form.permite_recuperacao.includes('final') && (
                  <CheckboxWithTooltip id="rec_final_substitutiva" checked={form.recuperacao_final_substitutiva} onCheckedChange={(v) => set('recuperacao_final_substitutiva', v)} label="A recuperação final é substitutiva" tooltipKey="recuperacao_final_substitutiva" />
                )}
                <CheckboxWithTooltip id="reclassificacao" checked={form.realizava_avaliacao_reclassificacao} onCheckedChange={(v) => set('realizava_avaliacao_reclassificacao', v)} label="Realiza avaliação de reclassificação" tooltipKey="realizava_avaliacao_reclassificacao" />

                <div className="flex items-center gap-2">
                  <Checkbox id="limitar_avaliacoes" checked={form.limitar_avaliacoes} onCheckedChange={(v) => set('limitar_avaliacoes', !!v)} />
                  <Label htmlFor="limitar_avaliacoes" className="cursor-pointer">Limitar quantidade de avaliações</Label>
                </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {form.limitar_avaliacoes && (
            <Card className="border-border shadow-sm">
              <CardHeader className="border-b border-border pb-4"><CardTitle className="text-base font-semibold text-foreground">Avaliações</CardTitle></CardHeader>
              <CardContent className="space-y-4 px-6 pb-6 pt-0">
                {form.avaliacoes_list.map((av, i) => (
                  <div key={i} className="flex items-end gap-3 p-3 border border-border rounded-lg">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Nome da Avaliação</Label>
                      <Input
                        value={av.nome}
                        onChange={(e) => {
                          const next = [...form.avaliacoes_list]
                          next[i] = { ...next[i], nome: e.target.value }
                          set('avaliacoes_list', next)
                        }}
                        placeholder="Ex: Prova 1"
                      />
                    </div>
                    <div className="w-24 space-y-1">
                      <Label className="text-xs">Peso</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min={0}
                        value={av.peso}
                        onChange={(e) => {
                          const next = [...form.avaliacoes_list]
                          next[i] = { ...next[i], peso: Number(e.target.value) || 0 }
                          set('avaliacoes_list', next)
                        }}
                      />
                    </div>
                    <div className="w-24 space-y-1">
                      <Label className="text-xs">Nota Máx</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min={1}
                        value={av.nota_maxima}
                        onChange={(e) => {
                          const next = [...form.avaliacoes_list]
                          next[i] = { ...next[i], nota_maxima: Number(e.target.value) || 10 }
                          set('avaliacoes_list', next)
                        }}
                      />
                    </div>
                    <Button variant="ghost" size="icon-sm" onClick={() => {
                      set('avaliacoes_list', form.avaliacoes_list.filter((_, idx) => idx !== i))
                    }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => {
                  set('avaliacoes_list', [...form.avaliacoes_list, { nome: '', peso: 1, nota_maxima: 10 }])
                }} className="border-border hover:bg-primary/5 hover:text-primary hover:border-primary">
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Adicionar Avaliação
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="border-border shadow-sm">
            <CardHeader className="border-b border-border pb-4"><CardTitle className="text-base font-semibold text-foreground">Aprovações</CardTitle></CardHeader>
            <CardContent className="space-y-5 px-6 pb-6 pt-0">
              <div>
                <h4 className="text-sm font-semibold mb-3">Aprovação Direta</h4>
                <div className="mb-3">
                  <ClickablePill
                    label="Aprovação Automática"
                    active={form.aprovacao_automatica}
                    onClick={() => set('aprovacao_automatica', !form.aprovacao_automatica)}
                  />
                </div>
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${form.aprovacao_automatica ? 'pointer-events-none select-none [&_input]:opacity-40 [&_label]:opacity-40' : ''}`}>
                  <div className="space-y-2 w-40">
                    <LabelWithTooltip label="Média Mínima" tooltip="Nota mínima que o aluno precisa atingir na média do período para ser aprovado diretamente. Ex: 6.0 ou 7.0." />
                    <Input id="media_minima" type="number" step="0.1" min={0} value={form.media_minima} onChange={(e) => set('media_minima', Number(e.target.value) || 0)} disabled={form.aprovacao_automatica} />
                  </div>
                  <div className="space-y-2">
                    <LabelWithTooltip label="Peso Equivalente a Cada Período" tooltip="Define o peso de cada período (bimestre/semestre) no cálculo da média final. Ex: 1º bimestre peso 1, 2º peso 2." />
                    <div className="flex gap-2 flex-wrap">
                      {form.pesos_periodos.slice(0, form.quantidade_periodos_numerico).map((peso, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <Label className="text-xs text-muted-foreground">{i + 1}º</Label>
                          <Input type="number" min={0} step="0.1" className="w-16" value={peso} onChange={(e) => handlePesoChange(i, e.target.value)} disabled={form.aprovacao_automatica} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {form.permite_recuperacao.includes('final') && (
                <>
                  <Separator className="bg-border" />
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Aprovação por Recuperação</h4>
                    <div className="space-y-3">
                      <div className="space-y-2 w-40">
                        <LabelWithTooltip label="Média Mínima após Recuperação" tooltip="Nota mínima que o aluno precisa atingir na média final (após recuperação) para ser aprovado. Geralmente menor que a média direta." />
                        <Input id="media_min_rec" type="number" step="0.1" min={0} value={form.media_minima_recuperacao} onChange={(e) => set('media_minima_recuperacao', Number(e.target.value) || 0)} />
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <ClickablePill
                          label="Média Aritmética"
                          active={!form.usa_media_ponderada_recuperacao}
                          onClick={() => set('usa_media_ponderada_recuperacao', false)}
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild onClick={(e) => e.preventDefault()}>
                              <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-muted-foreground cursor-help transition-colors" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>A nota final é a média simples entre a Média das Avaliações (MA) e a nota da Recuperação (RF). Exemplo: se a MA foi 5,0 e a Recuperação foi 8,0, a nota final é (5,0 + 8,0) ÷ 2 = 6,5.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <ClickablePill
                          label="Média Ponderada"
                          active={form.usa_media_ponderada_recuperacao}
                          onClick={() => set('usa_media_ponderada_recuperacao', true)}
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild onClick={(e) => e.preventDefault()}>
                              <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-muted-foreground cursor-help transition-colors" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>A nota final dá pesos diferentes para a Média das Avaliações (MA) e a Recuperação (RF), em vez de uma média simples. Exemplo com os pesos recomendados (peso 2 para a MA e peso 1 para a Recuperação): se a MA foi 5,0 e a Recuperação foi 8,0, a nota final é (5,0 × 2 + 8,0 × 1) ÷ 3 = 6,0.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      {form.usa_media_ponderada_recuperacao && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <LabelWithTooltip label="Peso Média Anual" tooltip="Peso da média do ano no cálculo da recuperação. Quanto maior, mais a nota do ano vale. Recomendado: 2." />
                            <Input id="peso_anual" type="number" step="0.1" min={0} value={form.peso_media_anual} onChange={(e) => set('peso_media_anual', Number(e.target.value) || 0)} />
                          </div>
                          <div className="space-y-2">
                            <LabelWithTooltip label="Peso Recuperação Final" tooltip="Peso da nota da recuperação final no cálculo. Recomendado: 1." />
                            <Input id="peso_rec_final" type="number" step="0.1" min={0} value={form.peso_recuperacao_final} onChange={(e) => set('peso_recuperacao_final', Number(e.target.value) || 0)} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="border-b border-border pb-4"><CardTitle className="text-base font-semibold text-foreground">Configuração de Arredondamento</CardTitle></CardHeader>
            <CardContent className="space-y-5 px-6 pb-6 pt-0">
              <div className="space-y-2">
                <Label>Tipo de Arredondamento</Label>
                <div className="flex flex-wrap items-center gap-2">
                  <ClickablePill
                    label="Nenhum"
                    active={form.tipo_arredondamento === 'nenhum'}
                    onClick={() => set('tipo_arredondamento', 'nenhum')}
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild onClick={(e) => e.preventDefault()}>
                        <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-muted-foreground cursor-help transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>A nota final permanece exatamente como foi calculada, sem nenhum ajuste. Exemplo: 7,3 continua 7,3.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <ClickablePill
                    label="Meio Ponto"
                    active={form.tipo_arredondamento === 'meio_ponto'}
                    onClick={() => set('tipo_arredondamento', 'meio_ponto')}
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild onClick={(e) => e.preventDefault()}>
                        <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-muted-foreground cursor-help transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>A nota final é ajustada para o meio ponto mais próximo. Exemplo: 7,3 vira 7,5; 7,1 vira 7,0.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <ClickablePill
                    label="Decimal"
                    active={form.tipo_arredondamento === 'decimal'}
                    onClick={() => set('tipo_arredondamento', 'decimal')}
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild onClick={(e) => e.preventDefault()}>
                        <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-muted-foreground cursor-help transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>A nota final é ajustada para um número inteiro. Exemplo: 7,3 vira 7,0; 7,6 vira 8,0.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {form.tipo_arredondamento === 'meio_ponto' && (
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="space-y-2 w-32">
                    <Label htmlFor="intervalo_ini">Intervalo Inicial</Label>
                    <Input id="intervalo_ini" type="number" min={0} step="0.1" value={form.intervalo_inicial} onChange={(e) => set('intervalo_inicial', Number(e.target.value) || 0)} />
                  </div>
                  <div className="space-y-2 w-32">
                    <Label htmlFor="intervalo_fim">Intervalo Final</Label>
                    <Input id="intervalo_fim" type="number" min={0} step="0.1" value={form.intervalo_final} onChange={(e) => set('intervalo_final', Number(e.target.value) || 0)} />
                  </div>
                </div>
              )}

              {form.tipo_arredondamento === 'decimal' && (
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="space-y-2 w-40">
                    <Label htmlFor="margem_dec">Margem</Label>
                    <Input id="margem_dec" type="number" min={0} max={9} value={form.margem_decimal} onChange={(e) => set('margem_decimal', Number(e.target.value) || 0)} />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium">Aplicar Arredondamento na</Label>
                <div className="flex flex-wrap gap-2">
                  <ClickablePill
                    label="Média do Período"
                    active={form.aplica_media_periodo}
                    onClick={() => set('aplica_media_periodo', !form.aplica_media_periodo)}
                  />
                  <ClickablePill
                    label="Média Anual"
                    active={form.aplica_media_anual}
                    onClick={() => set('aplica_media_anual', !form.aplica_media_anual)}
                  />
                  <ClickablePill
                    label="Média Final"
                    active={form.aplica_media_final}
                    onClick={() => set('aplica_media_final', !form.aplica_media_final)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {form.tipos_avaliacao.parecer && (
        <Card className="border-border shadow-sm">
          <CardHeader className="border-b border-border pb-4"><CardTitle className="text-base font-semibold text-foreground">Configuração de Pareceres Descritivos</CardTitle></CardHeader>
          <CardContent>
            <ClickablePill
              label="Registro de Parecer Geral"
              active={form.registro_geral}
              onClick={() => set('registro_geral', !form.registro_geral)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Se marcado, os pareceres descritivos devem ser informados de forma geral e não por disciplina.
            </p>
          </CardContent>
        </Card>
      )}

      {form.tipos_avaliacao.conceito && (
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
            <CardTitle className="text-base font-semibold text-foreground">Configurações de Conceitos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 px-6 pb-6 pt-0">
            <CardConceitosList
              conceitos={form.conceitos.filter((c) => !c.eh_conceito_final)}
              onChange={(items) => {
                const finais = form.conceitos.filter((c) => c.eh_conceito_final)
                set('conceitos', [...items, ...finais])
              }}
              max={6}
              title="Conceitos"
              addLabel="Novo Conceito"
              final={false}
            />

            <Separator className="bg-border" />

            <div className="pt-2">
              <ClickablePill
                label="Utiliza Conceito Final"
                active={form.conceitos.some((c) => c.eh_conceito_final)}
                onClick={() => {
                  if (form.conceitos.some((c) => c.eh_conceito_final)) {
                    set('conceitos', form.conceitos.filter((c) => !c.eh_conceito_final))
                  } else {
                    set('conceitos', [...form.conceitos, { descricao: '', sigla: '', cor_fundo: '#E2E8F0', cor_letra: '#1E293B', eh_conceito_final: true, ordem: form.conceitos.length }])
                  }
                }}
              />
            </div>

            {form.conceitos.some((c) => c.eh_conceito_final) && (
              <CardConceitosList
                conceitos={form.conceitos.filter((c) => c.eh_conceito_final)}
                onChange={(items) => {
                  const normais = form.conceitos.filter((c) => !c.eh_conceito_final)
                  set('conceitos', [...normais, ...items])
                }}
                max={6}
                title="Conceitos Finais"
                addLabel="Novo Conceito Final"
                final={true}
              />
            )}
          </CardContent>
        </Card>
      )}

      {form.tipos_avaliacao.nivel && (
        <Card className="border-border shadow-sm">
          <CardHeader className="border-b border-border pb-4"><CardTitle className="text-base font-semibold text-foreground">Configuração de Níveis de Desenvolvimento</CardTitle></CardHeader>
          <CardContent>
            <CardNiveisList
              niveis={form.niveis}
              onChange={(items) => set('niveis', items)}
              max={6}
            />
          </CardContent>
        </Card>
      )}
      </div>

      <div className="shrink-0 border-t border-border px-6 py-3 flex justify-end gap-2 bg-muted/30">
        <Button variant="outline" onClick={onCancel} className="min-h-[40px] sm:min-h-[44px]">Cancelar</Button>
        <Button onClick={handleSave} disabled={saving} className="min-h-[40px] sm:min-h-[44px]">
          {saving ? 'Salvando...' : form.id ? 'Atualizar' : 'Salvar'}
        </Button>
      </div>
    </>
  )
}

function LabelWithTooltip({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <Label className="flex items-center gap-1">
      {label}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-muted-foreground cursor-help transition-colors shrink-0" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Label>
  )
}

function CardConceitosList({
  conceitos,
  onChange,
  max,
  title,
  addLabel,
  final,
}: {
  conceitos: MetodoConceito[]
  onChange: (items: MetodoConceito[]) => void
  max: number
  title: string
  addLabel: string
  final: boolean
}) {
  const add = () => {
    if (conceitos.length >= max) return
    onChange([...conceitos, { descricao: '', sigla: '', cor_fundo: '#E2E8F0', cor_letra: '#1E293B', eh_conceito_final: final, ordem: conceitos.length }])
  }

  const remove = (index: number) => {
    onChange(conceitos.filter((_, i) => i !== index))
  }

  const [confirmIndex, setConfirmIndex] = useState<number | null>(null)

  const update = (index: number, field: keyof MetodoConceito, value: string | boolean) => {
    const updated = conceitos.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">{title} ({conceitos.length}/{max})</h4>
        <Button variant="outline" size="sm" onClick={add} disabled={conceitos.length >= max} className="border-border hover:bg-primary/5 hover:text-primary hover:border-primary">
          <Plus className="mr-1 h-3.5 w-3.5" />
          {addLabel}
        </Button>
      </div>
      {conceitos.map((item, i) => (
        <div key={i} className="flex items-center gap-3 p-4 border border-border rounded-lg">
          <div className="flex-1 flex gap-2">
            <div className="flex-1 space-y-1">
              <Label className="text-xs">Descrição</Label>
              <Input value={item.descricao} onChange={(e) => update(i, 'descricao', e.target.value)} placeholder="Ex: Bom" />
            </div>
            <div className="w-24 space-y-1">
              <Label className="text-xs">Sigla</Label>
              <Input value={item.sigla} onChange={(e) => update(i, 'sigla', e.target.value.toUpperCase().slice(0, 4))} maxLength={4} placeholder="Ex: B" />
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-11 w-11 shrink-0" onClick={() => setConfirmIndex(i)} aria-label="Excluir conceito">
            <Trash2 className="h-5 w-5 text-destructive" />
          </Button>
        </div>
      ))}
      <ConfirmDialog
        open={confirmIndex !== null}
        onOpenChange={(open) => { if (!open) setConfirmIndex(null) }}
        title="Excluir conceito"
        description="Tem certeza que deseja excluir este conceito? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="destructive"
        onConfirm={() => { if (confirmIndex !== null) remove(confirmIndex); setConfirmIndex(null) }}
      />
    </div>
  )
}

function CardNiveisList({
  niveis,
  onChange,
  max,
}: {
  niveis: MetodoNivel[]
  onChange: (items: MetodoNivel[]) => void
  max: number
}) {
  const add = () => {
    if (niveis.length >= max) return
    onChange([...niveis, { descricao: '', sigla: '', cor_fundo: '#E2E8F0', cor_letra: '#1E293B', ordem: niveis.length }])
  }

  const remove = (index: number) => {
    onChange(niveis.filter((_, i) => i !== index))
  }

  const [confirmIndex, setConfirmIndex] = useState<number | null>(null)

  const update = (index: number, field: keyof MetodoNivel, value: string | boolean | number) => {
    const updated = niveis.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Níveis ({niveis.length}/{max})</h4>
        <Button variant="outline" size="sm" onClick={add} disabled={niveis.length >= max} className="border-border hover:bg-primary/5 hover:text-primary hover:border-primary">
          <Plus className="mr-1 h-3.5 w-3.5" />
          Novo Nível de Desenvolvimento
        </Button>
      </div>
      {niveis.map((item, i) => (
        <div key={i} className="flex items-center gap-3 p-4 border border-border rounded-lg">
          <div className="flex-1 flex gap-2">
            <div className="flex-1 space-y-1">
              <Label className="text-xs">Descrição</Label>
              <Input value={item.descricao} onChange={(e) => update(i, 'descricao', e.target.value)} placeholder="Ex: Intermediário" />
            </div>
            <div className="w-24 space-y-1">
              <Label className="text-xs">Sigla</Label>
              <Input value={item.sigla} onChange={(e) => update(i, 'sigla', e.target.value.toUpperCase().slice(0, 4))} maxLength={4} placeholder="Ex: I" />
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-11 w-11 shrink-0" onClick={() => setConfirmIndex(i)} aria-label="Excluir nível">
            <Trash2 className="h-5 w-5 text-destructive" />
          </Button>
        </div>
      ))}
      <ConfirmDialog
        open={confirmIndex !== null}
        onOpenChange={(open) => { if (!open) setConfirmIndex(null) }}
        title="Excluir nível de desenvolvimento"
        description="Tem certeza que deseja excluir este nível? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="destructive"
        onConfirm={() => { if (confirmIndex !== null) remove(confirmIndex); setConfirmIndex(null) }}
      />
    </div>
  )
}
