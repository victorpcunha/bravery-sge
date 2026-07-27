'use client'

import { useState, useEffect, useMemo } from 'react'
import { adicionarHistoricoManual, type HistoricoManualInput } from '@/lib/actions/historico-manual'
import { listarEtapasEnsino } from '@/lib/actions/painel-pessoa'
import { getDisciplinas, type Disciplina } from '@/lib/actions/matrizes'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Save, Plus, X } from 'lucide-react'
import { toast } from 'sonner'

const UF_LIST = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

const SITUACOES = [
  'Aprovado', 'Reprovado', 'Aprovado por conselho de classe',
  'Reprovado por frequência', 'Transferido', 'Desistente',
]

type EtapaEnsino = { id: string; nome: string }
type DiscEntry = {
  disciplina_id: string | null
  disciplina_nome: string
  media_final: number
  carga_horaria_anual: number | null
  parte_diversificada: boolean
}

type Props = {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  personId: string
  schoolId: string | null
  pessoaLogadaId: string | null
}

export default function ModalHistoricoManual({ open, onClose, onSuccess, personId, schoolId, pessoaLogadaId }: Props) {
  const [salvando, setSalvando] = useState(false)
  const [etapas, setEtapas] = useState<EtapaEnsino[]>([])
  const [disciplinasOpts, setDisciplinasOpts] = useState<Disciplina[]>([])

  const [anoLetivo, setAnoLetivo] = useState('')
  const [cargaHoraria, setCargaHoraria] = useState('')
  const [diasLetivos, setDiasLetivos] = useState('')
  const [estado, setEstado] = useState('')
  const [municipio, setMunicipio] = useState('')
  const [unidadeEscolar, setUnidadeEscolar] = useState('')
  const [etapaEnsinoId, setEtapaEnsinoId] = useState('')
  const [situacao, setSituacao] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const [discId, setDiscId] = useState('')
  const [discNome, setDiscNome] = useState('')
  const [discMedia, setDiscMedia] = useState('')
  const [discCarga, setDiscCarga] = useState('')
  const [discDiversif, setDiscDiversif] = useState(false)
  const [disciplinas, setDisciplinas] = useState<DiscEntry[]>([])

  useEffect(() => {
    if (!open) return
    resetForm()
    listarEtapasEnsino()
      .then(setEtapas)
      .catch(() => toast.error('Erro ao carregar etapas de ensino'))
    getDisciplinas(schoolId)
      .then(setDisciplinasOpts)
      .catch(() => {})
  }, [open, schoolId])

  const resetForm = () => {
    setAnoLetivo('')
    setCargaHoraria('')
    setDiasLetivos('')
    setEstado('')
    setMunicipio('')
    setUnidadeEscolar('')
    setEtapaEnsinoId('')
    setSituacao('')
    setObservacoes('')
    setDiscId('')
    setDiscNome('')
    setDiscMedia('')
    setDiscCarga('')
    setDiscDiversif(false)
    setDisciplinas([])
  }

  const cargas = useMemo(() => {
    const bncc = disciplinas
      .filter(d => !d.parte_diversificada)
      .reduce((sum, d) => sum + (d.carga_horaria_anual || 0), 0)
    const diversif = disciplinas
      .filter(d => d.parte_diversificada)
      .reduce((sum, d) => sum + (d.carga_horaria_anual || 0), 0)
    return { bncc, diversif, total: bncc + diversif }
  }, [disciplinas])

  const addDisciplina = () => {
    if (discDiversif) {
      if (!discNome || !discMedia) {
        toast.error('Informe o nome da disciplina e a média final')
        return
      }
      setDisciplinas(prev => [...prev, {
        disciplina_id: null,
        disciplina_nome: discNome,
        media_final: parseFloat(discMedia),
        carga_horaria_anual: discCarga ? parseInt(discCarga) : null,
        parte_diversificada: true,
      }])
      setDiscNome('')
    } else {
      if (!discId || !discMedia) {
        toast.error('Selecione a disciplina e informe a média final')
        return
      }
      if (disciplinas.some(d => d.disciplina_id === discId && !d.parte_diversificada)) {
        toast.error('Disciplina já adicionada')
        return
      }
      const nome = disciplinasOpts.find(d => d.id === discId)?.nome || discId
      setDisciplinas(prev => [...prev, {
        disciplina_id: discId,
        disciplina_nome: nome,
        media_final: parseFloat(discMedia),
        carga_horaria_anual: discCarga ? parseInt(discCarga) : null,
        parte_diversificada: false,
      }])
      setDiscId('')
    }
    setDiscMedia('')
    setDiscCarga('')
  }

  const removeDisciplina = (index: number) => {
    setDisciplinas(prev => prev.filter((_, i) => i !== index))
  }

  const isFormValid = anoLetivo && estado && municipio && unidadeEscolar && etapaEnsinoId && situacao

  const handleSubmit = async () => {
    if (!isFormValid) { toast.error('Preencha todos os campos obrigatórios'); return }
    if (!schoolId) { toast.error('Escola não selecionada'); return }

    setSalvando(true)
    try {
      const anoNum = parseInt(anoLetivo)
      if (isNaN(anoNum) || anoNum < 1900 || anoNum > 2100) {
        toast.error('Ano Letivo inválido')
        setSalvando(false)
        return
      }

      const data: HistoricoManualInput = {
        person_id: personId,
        school_id: schoolId,
        ano: anoNum,
        carga_horaria: cargaHoraria ? parseInt(cargaHoraria) : null,
        dias_letivos: diasLetivos ? parseInt(diasLetivos) : null,
        estado: estado || null,
        municipio: municipio || null,
        unidade_escolar: unidadeEscolar || null,
        etapa_ensino_id: etapaEnsinoId || null,
        situacao: situacao || null,
        observacoes: observacoes || null,
        disciplinas: disciplinas.map(d => ({
          disciplina_id: d.disciplina_id,
          disciplina_nome: d.parte_diversificada ? d.disciplina_nome : null,
          media_final: d.media_final,
          carga_horaria_anual: d.carga_horaria_anual,
          parte_diversificada: d.parte_diversificada,
        })),
      }

      await adicionarHistoricoManual(data, pessoaLogadaId)
      toast.success('Histórico registrado com sucesso')
      resetForm()
      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao salvar histórico')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0 flex flex-col">
        <DialogHeader className="shrink-0 px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle>Adicionar Histórico</DialogTitle>
          <DialogDescription>
            Registre manualmente um histórico escolar de anos anteriores ou de outra escola.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[14px]">Dados Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="hm-ano">Ano Letivo *</Label>
                  <Input
                    id="hm-ano"
                    type="number"
                    value={anoLetivo}
                    onChange={e => setAnoLetivo(e.target.value)}
                    placeholder="Ex: 2025"
                    className="h-9 border-border"
                    aria-required="true"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hm-situacao">Situação *</Label>
                  <Select value={situacao} onValueChange={setSituacao}>
                    <SelectTrigger id="hm-situacao" aria-required="true">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {SITUACOES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="hm-carga">Carga Horária (h)</Label>
                  <Input
                    id="hm-carga"
                    type="number"
                    value={cargaHoraria}
                    onChange={e => setCargaHoraria(e.target.value)}
                    className="h-9 border-border"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hm-dias">Dias Letivos</Label>
                  <Input
                    id="hm-dias"
                    type="number"
                    value={diasLetivos}
                    onChange={e => setDiasLetivos(e.target.value)}
                    className="h-9 border-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="hm-estado">Estado (UF) *</Label>
                  <Select value={estado} onValueChange={setEstado}>
                    <SelectTrigger id="hm-estado" aria-required="true">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {UF_LIST.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hm-municipio">Município *</Label>
                  <Input
                    id="hm-municipio"
                    value={municipio}
                    onChange={e => setMunicipio(e.target.value)}
                    className="h-9 border-border"
                    placeholder="Município da escola"
                    aria-required="true"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="hm-unidade">Unidade Escolar *</Label>
                <Input
                  id="hm-unidade"
                  value={unidadeEscolar}
                  onChange={e => setUnidadeEscolar(e.target.value)}
                  className="h-9 border-border"
                  placeholder="Nome da escola"
                  aria-required="true"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="hm-etapa">Etapa de Ensino *</Label>
                <Select value={etapaEnsinoId} onValueChange={setEtapaEnsinoId}>
                  <SelectTrigger id="hm-etapa" aria-required="true">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {etapas.map(e => <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="hm-obs">Observações</Label>
                <Textarea
                  id="hm-obs"
                  value={observacoes}
                  onChange={e => setObservacoes(e.target.value)}
                  rows={2}
                  className="border-border resize-y"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[14px]">Registros Escolares</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="parte-diversificada"
                  checked={discDiversif}
                  onCheckedChange={checked => {
                    setDiscDiversif(!!checked)
                    if (checked) { setDiscId('') } else { setDiscNome('') }
                  }}
                />
                <Label htmlFor="parte-diversificada" className="cursor-pointer">Parte Diversificada</Label>
              </div>

              {discDiversif ? (
                <div className="space-y-1.5">
                  <Label htmlFor="hm-disc-nome">Nome da Disciplina *</Label>
                  <Input
                    id="hm-disc-nome"
                    value={discNome}
                    onChange={e => setDiscNome(e.target.value)}
                    className="h-9 border-border"
                    placeholder="Ex: Robótica Educacional"
                    aria-required="true"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label htmlFor="hm-disc-select">Disciplina *</Label>
                  <Select value={discId} onValueChange={setDiscId}>
                    <SelectTrigger id="hm-disc-select" aria-required="true">
                      <SelectValue placeholder="Selecione a disciplina" />
                    </SelectTrigger>
                    <SelectContent>
                      {disciplinasOpts.map(d => <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="hm-media">Média Final *</Label>
                  <Input
                    id="hm-media"
                    type="number"
                    step="0.01"
                    value={discMedia}
                    onChange={e => setDiscMedia(e.target.value)}
                    className="h-9 border-border"
                    placeholder="Ex: 8.5"
                    aria-required="true"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hm-disc-carga">Carga Horária (h)</Label>
                  <Input
                    id="hm-disc-carga"
                    type="number"
                    value={discCarga}
                    onChange={e => setDiscCarga(e.target.value)}
                    className="h-9 border-border"
                    placeholder="Ex: 800"
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addDisciplina}
                className="w-full min-h-[40px] gap-1"
              >
                <Plus className="h-4 w-4" />
                Adicionar Disciplina
              </Button>

              {disciplinas.length > 0 && (
                <div className="space-y-2">
                  <div className="border-t border-border pt-2" />
                  <ul className="space-y-2">
                    {disciplinas.map((d, i) => (
                      <li key={i} className="flex items-center gap-2 bg-muted/50 rounded p-2 min-w-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-medium break-words">{d.disciplina_nome}</p>
                          <p className="text-[13px] text-muted-foreground tabular-nums">
                            Média: {d.media_final}
                            {d.carga_horaria_anual != null && ` | CH: ${d.carga_horaria_anual}h`}
                            {d.parte_diversificada && ' | Parte Diversif.'}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeDisciplina(i)}
                          className="shrink-0"
                          aria-label={`Remover disciplina ${d.disciplina_nome}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-border pt-2 space-y-1 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Carga Horária BNCC</span>
                      <span className="font-medium tabular-nums">{cargas.bncc}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Carga Horária Parte Diversificada</span>
                      <span className="font-medium tabular-nums">{cargas.diversif}h</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t border-border pt-1">
                      <span>Total</span>
                      <span className="tabular-nums">{cargas.total}h</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="shrink-0 border-t border-border bg-muted/30 px-6 py-3 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="min-h-[40px] sm:min-h-[44px]"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={salvando || !isFormValid}
            className="min-h-[40px] sm:min-h-[44px]"
          >
            {salvando ? (
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-1.5" />
            )}
            {salvando ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
