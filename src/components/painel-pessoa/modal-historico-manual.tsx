'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { adicionarHistoricoManual } from '@/lib/actions/historico-manual'
import { listarAnosLetivos, listarEtapasEnsino } from '@/lib/actions/painel-pessoa'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

const schema = z.object({
  ano_letivo_id: z.string().min(1, 'Selecione o ano letivo'),
  carga_horaria: z.coerce.number().int().optional(),
  dias_letivos: z.coerce.number().int().optional(),
  media_aprovacao: z.coerce.number().optional(),
  municipio: z.string().optional(),
  unidade_escolar: z.string().optional(),
  etapa_ensino_id: z.string().optional(),
  situacao: z.string().optional(),
  observacoes: z.string().optional(),
})

type FormData = {
  ano_letivo_id: string
  carga_horaria?: number | undefined
  dias_letivos?: number | undefined
  media_aprovacao?: number | undefined
  municipio?: string | undefined
  unidade_escolar?: string | undefined
  etapa_ensino_id?: string | undefined
  situacao?: string | undefined
  observacoes?: string | undefined
}

type AnoLetivo = { id: string; ano: number }
type EtapaEnsino = { id: string; nome: string }

type Props = {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  personId: string
  schoolId: string
  pessoaLogadaId: string | null
}

const SITUACOES = [
  'Aprovado', 'Reprovado', 'Aprovado por conselho de classe',
  'Reprovado por frequência', 'Transferido', 'Desistente',
]

export default function ModalHistoricoManual({ open, onClose, onSuccess, personId, schoolId, pessoaLogadaId }: Props) {
  const [salvando, setSalvando] = useState(false)
  const [anosLetivos, setAnosLetivos] = useState<AnoLetivo[]>([])
  const [etapas, setEtapas] = useState<EtapaEnsino[]>([])

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
  })

  useEffect(() => {
    if (!open) return
    reset()
    Promise.all([
      listarAnosLetivos(schoolId),
      listarEtapasEnsino(),
    ]).then(([anos, etap]) => {
      setAnosLetivos(anos)
      setEtapas(etap)
    })
  }, [open, schoolId, reset])

  const onSubmit = async (data: FormData) => {
    setSalvando(true)
    try {
      await adicionarHistoricoManual({
        person_id: personId,
        school_id: schoolId,
        ano_letivo_id: data.ano_letivo_id,
        carga_horaria: data.carga_horaria || null,
        dias_letivos: data.dias_letivos || null,
        media_aprovacao: data.media_aprovacao || null,
        municipio: data.municipio || null,
        unidade_escolar: data.unidade_escolar || null,
        etapa_ensino_id: data.etapa_ensino_id || null,
        situacao: data.situacao || null,
        observacoes: data.observacoes || null,
      }, pessoaLogadaId)
      toast.success('Histórico registrado com sucesso')
      reset()
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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Histórico Manual</DialogTitle>
          <DialogDescription>
            Registre manualmente um histórico escolar de anos anteriores.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="text-xs">Ano Letivo *</Label>
            <Select onValueChange={v => setValue('ano_letivo_id', v)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {anosLetivos.map(a => (
                  <SelectItem key={a.id} value={a.id}>{a.ano}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ano_letivo_id && <p className="text-xs text-red-500 mt-1">{errors.ano_letivo_id.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Carga Horária (h)</Label>
              <Input type="number" {...register('carga_horaria')} className="mt-0.5" />
            </div>
            <div>
              <Label className="text-xs">Dias Letivos</Label>
              <Input type="number" {...register('dias_letivos')} className="mt-0.5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Média Aprovação</Label>
              <Input type="number" step="0.01" {...register('media_aprovacao')} className="mt-0.5" />
            </div>
            <div>
              <Label className="text-xs">Situação</Label>
              <Select onValueChange={v => setValue('situacao', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {SITUACOES.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-xs">Município</Label>
            <Input {...register('municipio')} className="mt-0.5" placeholder="Município da escola" />
          </div>

          <div>
            <Label className="text-xs">Unidade Escolar</Label>
            <Input {...register('unidade_escolar')} className="mt-0.5" placeholder="Nome da escola" />
          </div>

          <div>
            <Label className="text-xs">Etapa de Ensino</Label>
            <Select onValueChange={v => setValue('etapa_ensino_id', v)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {etapas.map(e => (
                  <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Observações</Label>
            <textarea {...register('observacoes')} rows={2}
              className="w-full mt-0.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm resize-y" />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" size="sm" onClick={onClose}>Cancelar</Button>
            <Button size="sm" type="submit" disabled={salvando}>
              {salvando ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-1" />}
              {salvando ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
