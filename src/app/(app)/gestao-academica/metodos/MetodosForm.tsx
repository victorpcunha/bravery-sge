'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Plus, Trash2, Info } from 'lucide-react'
import { getMetodoCompleto, saveMetodo, type MetodoConceito, type MetodoNivel } from '@/lib/actions/metodos'
import { toast } from 'sonner'

const COLORS_BG = ['#1D3557', '#457B9D', '#E63946', '#2BAE66', '#E8A838', '#8B5CF6', '#EC4899', '#6366F1']
const COLORS_TEXT = ['#FFFFFF', '#F8FAFC', '#1E293B']

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.substring(0, 2), 16) / 255,
    g: parseInt(h.substring(2, 4), 16) / 255,
    b: parseInt(h.substring(4, 6), 16) / 255,
  }
}

function luminance(r: number, g: number, b: number) {
  const [rl, gl, bl] = [r, g, b].map((c) => {
    const v = c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    return v
  })
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
}

function contrastRatio(hex1: string, hex2: string) {
  const c1 = hexToRgb(hex1)
  const c2 = hexToRgb(hex2)
  const l1 = luminance(c1.r, c1.g, c1.b)
  const l2 = luminance(c2.r, c2.g, c2.b)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function contrastLevel(ratio: number) {
  if (ratio >= 7) return { label: 'AAA', class: 'text-success' }
  if (ratio >= 4.5) return { label: 'AA', class: 'text-warning' }
  if (ratio >= 3) return { label: 'AA (large)', class: 'text-warning' }
  return { label: 'FAIL', class: 'text-destructive' }
}

type FormData = {
  id?: string
  nome: string
  criterio_frequencia: string
  frecuencia_minima: number
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
  recuperacao_substitutiva: 'Se desmarcado, o sistema mantém a maior nota entre a média e a recuperação.',
  recuperacao_periodo_substitutiva: 'Ao marcar, o sistema mantém a maior nota entre a média do período e a recuperação.',
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

export function MetodosForm({ schoolId, editId, onSaved, onCancel }: Props) {
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

      await saveMetodo(schoolId, payload)
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

          <div className="grid grid-cols-3 gap-4">
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

            <div className="flex items-center gap-3 pt-6">
              <Checkbox id="met_ativo" checked={form.ativo} onCheckedChange={(v) => set('ativo', !!v)} />
              <Label htmlFor="met_ativo" className="cursor-pointer font-medium">{form.ativo ? 'Ativo' : 'Inativo'}</Label>
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
                  <div key={tipo} className="flex items-center justify-between gap-4 py-2">
                    <div className="flex items-center gap-2 shrink-0">
                      <Checkbox
                        id={`tipo_${tipo}`}
                        checked={form.tipos_avaliacao[tipo]}
                        onCheckedChange={(v) => set('tipos_avaliacao', { ...form.tipos_avaliacao, [tipo]: !!v })}
                      />
                      <Label htmlFor={`tipo_${tipo}`} className="cursor-pointer">{labelMap[tipo]}</Label>
                    </div>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <LabelWithTooltip label="Forma de Registro da Avaliação" tooltip="Define se as notas são registradas como números inteiros (ex: 7) ou decimais (ex: 7.5)." />
                  <Select value={form.forma_registro} onValueChange={(v) => set('forma_registro', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" sideOffset={5}>
                      <SelectItem value="inteiro">Inteiro</SelectItem>
                      <SelectItem value="decimal">Decimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <LabelWithTooltip label="Permite Recuperação" tooltip="Define em quais momentos o aluno pode fazer recuperação: por avaliação individual, por período (bimestre/semestre), e/ou final (após o ano letivo)." />
                  <div className="flex flex-wrap gap-3 pt-1">
                    {(['avaliacao', 'periodo', 'final'] as const).map((opt) => (
                      <div key={opt} className="flex items-center gap-1.5">
                        <Checkbox
                          id={`rec_${opt}`}
                          checked={form.permite_recuperacao.includes(opt)}
                          onCheckedChange={(v) => {
                            if (v) {
                              set('permite_recuperacao', [...form.permite_recuperacao, opt])
                            } else {
                              set('permite_recuperacao', form.permite_recuperacao.filter((x) => x !== opt))
                            }
                          }}
                        />
                        <Label htmlFor={`rec_${opt}`} className="cursor-pointer text-sm">
                          {opt === 'avaliacao' ? 'Por Avaliação' : opt === 'periodo' ? 'Por Período' : 'Final'}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <LabelWithTooltip label="Tipo de Média do Período" tooltip="Ponderada: cada avaliação tem um peso. Somatória: soma simples das notas sem divisão." />
                  <Select value={form.tipo_media_periodo} onValueChange={(v) => set('tipo_media_periodo', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" sideOffset={5}>
                      <SelectItem value="ponderada">Ponderada</SelectItem>
                      <SelectItem value="somatoria">Somatória</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <LabelWithTooltip label="Tipo de Resultado Final" tooltip="Média dos Períodos: soma os resultados dos períodos e divide pela quantidade. Somatória dos Períodos: soma direta sem divisão." />
                  <Select value={form.tipo_resultado_final} onValueChange={(v) => set('tipo_resultado_final', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" sideOffset={5}>
                      <SelectItem value="media_periodos">Média dos Períodos</SelectItem>
                      <SelectItem value="somatoria">Somatória dos Períodos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <LabelWithTooltip label="Média Máxima no Período" tooltip="Nota máxima que um aluno pode atingir em cada período. Ex: 10, 100, etc." />
                  <Input id="media_maxima" type="number" step="0.1" min={0} value={form.media_maxima_periodo} onChange={(e) => set('media_maxima_periodo', Number(e.target.value) || 0)} />
                </div>
              </div>

              <Separator className="bg-border" />

              <div className="space-y-3">
                <Label className="text-sm font-medium">Opções</Label>
                <CheckboxWithTooltip id="permite_conselho" checked={form.permite_conselho_componente} onCheckedChange={(v) => set('permite_conselho_componente', v)} label="Permite Conselho de Classe por Componente Curricular" tooltipKey="permite_conselho_componente" />
                <CheckboxWithTooltip id="atribui_media_minima" checked={form.atribui_media_minima_conselho} onCheckedChange={(v) => set('atribui_media_minima_conselho', v)} label="Atribui média mínima para aprovados em Conselho de Classe" tooltipKey="atribui_media_minima_conselho" />
                <CheckboxWithTooltip id="usa_media_5" checked={form.usa_media_5_conceito} onCheckedChange={(v) => set('usa_media_5_conceito', v)} label="Utiliza média 5º conceito" tooltipKey="usa_media_5_conceito" />
                {form.permite_recuperacao.includes('final') && (
                  <CheckboxWithTooltip id="rec_final_reprovados" checked={form.permite_recuperacao_final_reprovados} onCheckedChange={(v) => set('permite_recuperacao_final_reprovados', v)} label="Permite recuperação Final apenas para reprovados" tooltipKey="permite_recuperacao_final_reprovados" />
                )}
                {form.permite_recuperacao.includes('avaliacao') && (
                  <CheckboxWithTooltip id="rec_substitutiva" checked={form.recuperacao_substitutiva} onCheckedChange={(v) => set('recuperacao_substitutiva', v)} label="A recuperação é substitutiva" tooltipKey="recuperacao_substitutiva" />
                )}
                {form.permite_recuperacao.includes('periodo') && (
                  <CheckboxWithTooltip id="rec_periodo_substitutiva" checked={form.recuperacao_periodo_substitutiva} onCheckedChange={(v) => set('recuperacao_periodo_substitutiva', v)} label="A recuperação por período é substitutiva" tooltipKey="recuperacao_periodo_substitutiva" />
                )}
                <CheckboxWithTooltip id="reclassificacao" checked={form.realizava_avaliacao_reclassificacao} onCheckedChange={(v) => set('realizava_avaliacao_reclassificacao', v)} label="Realiza avaliação de reclassificação" tooltipKey="realizava_avaliacao_reclassificacao" />

                <div className="flex items-center gap-2 pt-2">
                  <Checkbox id="limitar_avaliacoes" checked={form.limitar_avaliacoes} onCheckedChange={(v) => set('limitar_avaliacoes', !!v)} />
                  <Label htmlFor="limitar_avaliacoes" className="cursor-pointer">Limitar quantidade de avaliações</Label>
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
                <div className="flex items-center gap-2 mb-3">
                  <Checkbox id="aprov_auto" checked={form.aprovacao_automatica} onCheckedChange={(v) => set('aprovacao_automatica', !!v)} />
                  <Label htmlFor="aprov_auto" className="cursor-pointer">Aprovação Automática</Label>
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
                      <div className="flex items-center gap-2">
                        <Checkbox id="media_pond_rec" checked={form.usa_media_ponderada_recuperacao} onCheckedChange={(v) => set('usa_media_ponderada_recuperacao', !!v)} />
                        <Label htmlFor="media_pond_rec" className="cursor-pointer flex items-center">
                          Média Ponderada
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild onClick={(e) => e.preventDefault()}>
                                <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-muted-foreground cursor-help transition-colors ml-1" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>Aritmética: (MA + RF) / 2. Ponderada: (MA × Peso + RF × Peso) / soma dos pesos. Recomendado: marcar com pesos 2 e 1.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <span className="ml-1 text-xs text-muted-foreground">(Se desmarcado: média aritmética)</span>
                        </Label>
                      </div>
                      {form.usa_media_ponderada_recuperacao && (
                        <div className="grid grid-cols-2 gap-4">
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
                      <p className="text-xs text-muted-foreground">
                        Ex: (MA × Peso_MA + RF × Peso_RF) / (Peso_MA + Peso_RF)
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="border-b border-border pb-4"><CardTitle className="text-base font-semibold text-foreground">Configuração de Arredondamento</CardTitle></CardHeader>
            <CardContent className="space-y-5 px-6 pb-6 pt-0">
              {form.tipo_arredondamento === 'meio_ponto' ? (
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="space-y-2 w-48">
                    <Label>Tipo de Arredondamento</Label>
                    <Select value={form.tipo_arredondamento} onValueChange={(v) => set('tipo_arredondamento', v)}>
                      <SelectTrigger><SelectValue placeholder="Nenhum" /></SelectTrigger>
                      <SelectContent position="popper" side="bottom" sideOffset={5}>
                        <SelectItem value="nenhum">Nenhum</SelectItem>
                        <SelectItem value="meio_ponto">Meio Ponto</SelectItem>
                        <SelectItem value="decimal">Decimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 w-32">
                    <Label htmlFor="intervalo_ini">Intervalo Inicial</Label>
                    <Input id="intervalo_ini" type="number" min={0} step="0.1" value={form.intervalo_inicial} onChange={(e) => set('intervalo_inicial', Number(e.target.value) || 0)} />
                  </div>
                  <div className="space-y-2 w-32">
                    <Label htmlFor="intervalo_fim">Intervalo Final</Label>
                    <Input id="intervalo_fim" type="number" min={0} step="0.1" value={form.intervalo_final} onChange={(e) => set('intervalo_final', Number(e.target.value) || 0)} />
                  </div>
                </div>
              ) : form.tipo_arredondamento === 'decimal' ? (
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="space-y-2 w-48">
                    <Label>Tipo de Arredondamento</Label>
                    <Select value={form.tipo_arredondamento} onValueChange={(v) => set('tipo_arredondamento', v)}>
                      <SelectTrigger><SelectValue placeholder="Nenhum" /></SelectTrigger>
                      <SelectContent position="popper" side="bottom" sideOffset={5}>
                        <SelectItem value="nenhum">Nenhum</SelectItem>
                        <SelectItem value="meio_ponto">Meio Ponto</SelectItem>
                        <SelectItem value="decimal">Decimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 w-40">
                    <Label htmlFor="margem_dec">Margem</Label>
                    <Input id="margem_dec" type="number" min={0} max={9} value={form.margem_decimal} onChange={(e) => set('margem_decimal', Number(e.target.value) || 0)} />
                  </div>
                </div>
              ) : (
                <div className="w-1/3 space-y-2">
                  <Label>Tipo de Arredondamento</Label>
                  <Select value={form.tipo_arredondamento} onValueChange={(v) => set('tipo_arredondamento', v)}>
                    <SelectTrigger><SelectValue placeholder="Nenhum" /></SelectTrigger>
                    <SelectContent position="popper" side="bottom" sideOffset={5}>
                      <SelectItem value="nenhum">Nenhum</SelectItem>
                      <SelectItem value="meio_ponto">Meio Ponto</SelectItem>
                      <SelectItem value="decimal">Decimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium">Aplicar Arredondamento na</Label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox id="arr_periodo" checked={form.aplica_media_periodo} onCheckedChange={(v) => set('aplica_media_periodo', !!v)} />
                    <Label htmlFor="arr_periodo" className="cursor-pointer">Média do Período</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="arr_anual" checked={form.aplica_media_anual} onCheckedChange={(v) => set('aplica_media_anual', !!v)} />
                    <Label htmlFor="arr_anual" className="cursor-pointer">Média Anual</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="arr_final" checked={form.aplica_media_final} onCheckedChange={(v) => set('aplica_media_final', !!v)} />
                    <Label htmlFor="arr_final" className="cursor-pointer">Média Final</Label>
                  </div>
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
            <div className="flex items-center gap-2">
              <Checkbox id="reg_geral" checked={form.registro_geral} onCheckedChange={(v) => set('registro_geral', !!v)} />
              <Label htmlFor="reg_geral" className="cursor-pointer">Registro de Parecer Geral</Label>
            </div>
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

            <div className="flex items-center gap-2 pt-2">
              <Checkbox
                id="usa_conceito_final"
                checked={form.conceitos.some((c) => c.eh_conceito_final)}
                onCheckedChange={(v) => {
                  if (!v) {
                    set('conceitos', form.conceitos.filter((c) => !c.eh_conceito_final))
                  } else if (!form.conceitos.some((c) => c.eh_conceito_final)) {
                    set('conceitos', [...form.conceitos, { descricao: '', sigla: '', cor_fundo: '#1D3557', cor_letra: '#FFFFFF', eh_conceito_final: true, ordem: form.conceitos.length }])
                  }
                }}
              />
              <Label htmlFor="usa_conceito_final" className="cursor-pointer font-medium">Utiliza Conceito Final</Label>
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

function ColorPreview({ bg, text, sigla }: { bg: string; text: string; sigla?: string }) {
  return (
    <div className="w-10 h-10 rounded-md flex items-center justify-center text-xs font-bold border-2 border-border shadow-sm shrink-0" style={{ backgroundColor: bg, color: text }}>
      {sigla || 'Aa'}
    </div>
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
    onChange([...conceitos, { descricao: '', sigla: '', cor_fundo: '#1D3557', cor_letra: '#FFFFFF', eh_conceito_final: final, ordem: conceitos.length }])
  }

  const remove = (index: number) => {
    onChange(conceitos.filter((_, i) => i !== index))
  }

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
        <div key={i} className="flex items-start gap-3 p-4 border border-border rounded-lg bg-muted">
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <Label className="text-xs">Descrição</Label>
                <Input value={item.descricao} onChange={(e) => update(i, 'descricao', e.target.value)} placeholder="Ex: Bom" />
              </div>
              <div className="w-24 space-y-1">
                <Label className="text-xs">Sigla</Label>
                <Input value={item.sigla} onChange={(e) => update(i, 'sigla', e.target.value.toUpperCase().slice(0, 4))} maxLength={4} placeholder="Ex: B" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs">Cor de Fundo</Label>
                <div className="flex gap-1 items-center flex-wrap">
                  <label className="relative w-6 h-6 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer bg-card hover:bg-muted shrink-0 overflow-hidden">
                    <span className="text-muted-foreground text-sm font-bold leading-none">+</span>
                    <input type="color" value={item.cor_fundo} onChange={(e) => update(i, 'cor_fundo', e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" title="Personalizar cor" />
                  </label>
                  {COLORS_BG.map((cor) => (
                    <Button
                      key={cor}
                      variant="ghost"
                      size="icon-xs"
                      className={`rounded-full border-2 ${item.cor_fundo === cor ? 'border-foreground scale-110' : 'border-border'}`}
                      style={{ backgroundColor: cor }}
                      onClick={() => update(i, 'cor_fundo', cor)}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Cor da Letra</Label>
                <div className="flex gap-1 items-center flex-wrap">
                  <label className="relative w-6 h-6 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer bg-card hover:bg-muted shrink-0 overflow-hidden">
                    <span className="text-muted-foreground text-sm font-bold leading-none">+</span>
                    <input type="color" value={item.cor_letra} onChange={(e) => update(i, 'cor_letra', e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" title="Personalizar cor" />
                  </label>
                  {COLORS_TEXT.map((cor) => (
                    <Button
                      key={cor}
                      variant="ghost"
                      size="icon-xs"
                      className={`rounded-full border-2 ${item.cor_letra === cor ? 'border-foreground scale-110' : 'border-border'}`}
                      style={{ backgroundColor: cor }}
                      onClick={() => update(i, 'cor_letra', cor)}
                    />
                  ))}
                </div>
              </div>
              <ColorPreview bg={item.cor_fundo} text={item.cor_letra} sigla={item.sigla} />
            </div>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={() => remove(i)} className="mt-1 shrink-0">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
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
    onChange([...niveis, { descricao: '', sigla: '', cor_fundo: '#457B9D', cor_letra: '#FFFFFF', ordem: niveis.length }])
  }

  const remove = (index: number) => {
    onChange(niveis.filter((_, i) => i !== index))
  }

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
        <div key={i} className="flex items-start gap-3 p-4 border border-border rounded-lg bg-muted">
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <Label className="text-xs">Descrição</Label>
                <Input value={item.descricao} onChange={(e) => update(i, 'descricao', e.target.value)} placeholder="Ex: Intermediário" />
              </div>
              <div className="w-24 space-y-1">
                <Label className="text-xs">Sigla</Label>
                <Input value={item.sigla} onChange={(e) => update(i, 'sigla', e.target.value.toUpperCase().slice(0, 4))} maxLength={4} placeholder="Ex: I" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs">Cor de Fundo</Label>
                <div className="flex gap-1 items-center flex-wrap">
                  <label className="relative w-6 h-6 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer bg-card hover:bg-muted shrink-0 overflow-hidden">
                    <span className="text-muted-foreground text-sm font-bold leading-none">+</span>
                    <input type="color" value={item.cor_fundo} onChange={(e) => update(i, 'cor_fundo', e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" title="Personalizar cor" />
                  </label>
                  {COLORS_BG.map((cor) => (
                    <Button
                      key={cor}
                      variant="ghost"
                      size="icon-xs"
                      className={`rounded-full border-2 ${item.cor_fundo === cor ? 'border-foreground scale-110' : 'border-border'}`}
                      style={{ backgroundColor: cor }}
                      onClick={() => update(i, 'cor_fundo', cor)}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Cor da Letra</Label>
                <div className="flex gap-1 items-center flex-wrap">
                  <label className="relative w-6 h-6 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer bg-card hover:bg-muted shrink-0 overflow-hidden">
                    <span className="text-muted-foreground text-sm font-bold leading-none">+</span>
                    <input type="color" value={item.cor_letra} onChange={(e) => update(i, 'cor_letra', e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" title="Personalizar cor" />
                  </label>
                  {COLORS_TEXT.map((cor) => (
                    <Button
                      key={cor}
                      variant="ghost"
                      size="icon-xs"
                      className={`rounded-full border-2 ${item.cor_letra === cor ? 'border-foreground scale-110' : 'border-border'}`}
                      style={{ backgroundColor: cor }}
                      onClick={() => update(i, 'cor_letra', cor)}
                    />
                  ))}
                </div>
              </div>
              <ColorPreview bg={item.cor_fundo} text={item.cor_letra} sigla={item.sigla} />
            </div>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={() => remove(i)} className="mt-1 shrink-0">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  )
}
