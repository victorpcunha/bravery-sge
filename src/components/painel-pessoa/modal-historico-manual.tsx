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
  'Reprovado por frequencia', 'Transferido', 'Desistente',
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
        toast.error('Informe o nome da disciplina e a media final')
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
        toast.error('Selecione a disciplina e informe a media final')
        return
      }
      if (disciplinas.some(d => d.disciplina_id === discId && !d.parte_diversificada)) {
        toast.error('Disciplina ja adicionada')
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
    if (!isFormValid) { toast.error('Preencha todos os campos obrigatorios'); return }
    if (!schoolId) { toast.error('Escola nao selecionada'); return }

    setSalvando(true)
    try {
      const anoNum = parseInt(anoLetivo)
      if (isNaN(anoNum) || anoNum < 1900 || anoNum > 2100) {
        toast.error('Ano Letivo invalido')
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
      toast.success('Historico registrado com sucesso')
      resetForm()
      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao salvar historico')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Historico</DialogTitle>
          <DialogDescription>
            Registre manualmente um historico escolar de anos anteriores ou de outra escola.
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Dados Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Ano Letivo *</Label>
                <Input type="number" value={anoLetivo} onChange={e => setAnoLetivo(e.target.value)} placeholder="Ex: 2025" className="h-9 text-xs border-border" />
              </div>
              <div>
                <Label className="text-xs">Situacao *</Label>
                <Select value={situacao} onValueChange={setSituacao}>
                  <SelectTrigger size="sm" className="text-xs"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {SITUACOES.map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Carga Horaria (h)</Label>
                <Input type="number" value={cargaHoraria} onChange={e => setCargaHoraria(e.target.value)} className="h-9 text-xs border-border" />
              </div>
              <div>
                <Label className="text-xs">Dias Letivos</Label>
                <Input type="number" value={diasLetivos} onChange={e => setDiasLetivos(e.target.value)} className="h-9 text-xs border-border" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Estado (UF) *</Label>
                <Select value={estado} onValueChange={setEstado}>
                  <SelectTrigger size="sm" className="text-xs"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {UF_LIST.map(uf => <SelectItem key={uf} value={uf} className="text-xs">{uf}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Municipio *</Label>
                <Input value={municipio} onChange={e => setMunicipio(e.target.value)} className="h-9 text-xs border-border" placeholder="Municipio da escola" />
              </div>
            </div>

            <div>
              <Label className="text-xs">Unidade Escolar *</Label>
              <Input value={unidadeEscolar} onChange={e => setUnidadeEscolar(e.target.value)} className="h-9 text-xs border-border" placeholder="Nome da escola" />
            </div>

            <div>
              <Label className="text-xs">Etapa de Ensino *</Label>
              <Select value={etapaEnsinoId} onValueChange={setEtapaEnsinoId}>
                <SelectTrigger size="sm" className="text-xs"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {etapas.map(e => <SelectItem key={e.id} value={e.id} className="text-xs">{e.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Observacoes</Label>
              <Textarea value={observacoes} onChange={e => setObservacoes(e.target.value)} rows={2} className="mt-0.5 text-xs resize-y border-border" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Registros Escolares</CardTitle>
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
              <Label htmlFor="parte-diversificada" className="text-xs cursor-pointer">Parte Diversificada</Label>
            </div>

            {discDiversif ? (
              <div>
                <Label className="text-xs">Nome da Disciplina *</Label>
                <Input value={discNome} onChange={e => setDiscNome(e.target.value)} className="h-9 text-xs border-border" placeholder="Ex: Robotica Educacional" />
              </div>
            ) : (
              <div>
                <Label className="text-xs">Disciplina *</Label>
                <Select value={discId} onValueChange={setDiscId}>
                  <SelectTrigger size="sm" className="text-xs"><SelectValue placeholder="Selecione a disciplina" /></SelectTrigger>
                  <SelectContent>
                    {disciplinasOpts.map(d => <SelectItem key={d.id} value={d.id} className="text-xs">{d.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Media Final *</Label>
                <Input type="number" step="0.01" value={discMedia} onChange={e => setDiscMedia(e.target.value)} className="h-9 text-xs border-border" placeholder="Ex: 8.5" />
              </div>
              <div>
                <Label className="text-xs">Carga Horaria (h)</Label>
                <Input type="number" value={discCarga} onChange={e => setDiscCarga(e.target.value)} className="h-9 text-xs border-border" placeholder="Ex: 800" />
              </div>
            </div>

            <Button type="button" size="sm" variant="outline" className="h-7 text-xs gap-1 w-full" onClick={addDisciplina}>
              <Plus className="h-3 w-3" />
              Adicionar Disciplina
            </Button>

            {disciplinas.length > 0 && (
              <div className="space-y-2">
                <div className="border-t border-border pt-2" />
                {disciplinas.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 bg-muted/50 rounded p-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{d.disciplina_nome}</p>
                      <p className="text-xs text-muted-foreground">
                        Media: {d.media_final}
                        {d.carga_horaria_anual != null && ` | CH: ${d.carga_horaria_anual}h`}
                        {d.parte_diversificada && ' | Parte Diversif.'}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0" onClick={() => removeDisciplina(i)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                <div className="border-t border-border pt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Carga Horaria BNCC</span>
                    <span className="font-medium">{cargas.bncc}h</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Carga Horaria Parte Diversificada</span>
                    <span className="font-medium">{cargas.diversif}h</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold border-t border-border pt-1">
                    <span>Total</span>
                    <span>{cargas.total}h</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" type="button" size="sm" onClick={onClose}>Cancelar</Button>
          <Button size="sm" onClick={handleSubmit} disabled={salvando || !isFormValid}>
            {salvando ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-1" />}
            {salvando ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
