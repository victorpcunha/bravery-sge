'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { Sidebar } from '@/components/layout/sidebar'
import { criarPlanoEnsino, getTurmaEtapaEnsino } from '@/lib/actions/plano-ensino'
import { listarTurmasDiario } from '@/lib/actions/diario-classe'
import { getDisciplinasDiario } from '@/lib/actions/diario-classe'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Check, GraduationCap, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function CriarPlanoEnsinoPage() {
  const router = useRouter()
  const { user, schoolId } = useAuth()
  const [pessoaId, setPessoaId] = useState<string | null>(null)
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [turmas, setTurmas] = useState<any[]>([])
  const [disciplinas, setDisciplinas] = useState<any[]>([])
  const [saving, setSaving] = useState(false)

  const [anoLetivoId, setAnoLetivoId] = useState('')
  const [turmaId, setTurmaId] = useState('')
  const [selectedDiscs, setSelectedDiscs] = useState<string[]>([])
  const [isInterdisciplinar, setIsInterdisciplinar] = useState(false)

  const { loaded: permLoaded, pessoaId: pid } = usePermissoes(schoolId || '')

  useEffect(() => {
    if (pid !== undefined) setPessoaId(pid)
  }, [pid])

  useEffect(() => {
    if (!schoolId) return
    getAnosLetivosAtivos(schoolId).then(setAnosLetivos).catch(() => {})
  }, [schoolId])

  useEffect(() => {
    if (!schoolId || !permLoaded || !anoLetivoId) return
    listarTurmasDiario(schoolId, pessoaId, anoLetivoId)
      .then(setTurmas)
      .catch(() => {})
  }, [schoolId, pessoaId, anoLetivoId, permLoaded])

  useEffect(() => {
    if (!turmaId) { setDisciplinas([]); return }
    getDisciplinasDiario(turmaId, pessoaId)
      .then(setDisciplinas)
      .catch(() => {})
  }, [turmaId, pessoaId])

  const toggleDisc = (matrizId: string) => {
    setSelectedDiscs(prev =>
      prev.includes(matrizId)
        ? prev.filter(id => id !== matrizId)
        : isInterdisciplinar
          ? [...prev, matrizId]
          : [matrizId]
    )
  }

  const handleSave = async () => {
    if (!schoolId || !anoLetivoId || !turmaId) {
      toast.error('Selecione o ano letivo e a turma')
      return
    }
    setSaving(true)
    try {
      const { etapa_id } = await getTurmaEtapaEnsino(turmaId)
      if (!etapa_id) {
        toast.error('Etapa de ensino não encontrada para esta turma')
        return
      }

      const plano = await criarPlanoEnsino({
        school_id: schoolId,
        turma_id: turmaId,
        ano_letivo_id: anoLetivoId,
        etapa_id,
        disciplinas: selectedDiscs,
        is_interdisciplinar: isInterdisciplinar,
      }, pessoaId)

      toast.success('Plano de Ensino criado')
      router.push(`/gestao-pedagogica/plano-ensino/${plano.id}`)
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao criar plano')
    } finally {
      setSaving(false)
    }
  }

  const turmaSelecionada = turmas.find(t => t.id === turmaId) as any

  return (
    <>
      <Sidebar />
      <div className="md:pl-64 container mx-auto py-8 px-4 max-w-5xl">
        <Button variant="ghost" className="mb-4" onClick={() => router.push('/gestao-pedagogica/plano-ensino')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>

        <h1 className="text-2xl font-bold text-foreground mb-6">Novo Plano de Ensino</h1>

        <div className="space-y-6 max-w-2xl">
          <Card>
            <CardHeader><CardTitle className="text-base">Identificação</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs font-medium">Ano Letivo</Label>
                <select
                  value={anoLetivoId}
                  onChange={e => { setAnoLetivoId(e.target.value); setTurmaId(''); setSelectedDiscs([]) }}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm mt-1"
                >
                  <option value="">Selecione...</option>
                  {anosLetivos.map((a: any) => (
                    <option key={a.id} value={a.id}>{a.descricao || a.ano}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-xs font-medium">Turma</Label>
                <select
                  value={turmaId}
                  onChange={e => { setTurmaId(e.target.value); setSelectedDiscs([]) }}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm mt-1"
                  disabled={!anoLetivoId}
                >
                  <option value="">Selecione...</option>
                  {turmas.map((t: any) => (
                    <option key={t.id} value={t.id}>
                      {t.nome} — {t.etapa_nome} {t.subetapa_nome ? `(${t.subetapa_nome})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {turmaId && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Disciplinas</span>
                  {disciplinas.length > 0 && (
                    <label className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                      <Checkbox
                        checked={isInterdisciplinar}
                        onCheckedChange={(v) => {
                          setIsInterdisciplinar(!!v)
                          if (!v && selectedDiscs.length > 1) setSelectedDiscs([selectedDiscs[0]])
                        }}
                      />
                      Plano interdisciplinar
                    </label>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {disciplinas.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma disciplina vinculada a esta turma.</p>
                ) : (
                  <div className="space-y-2">
                    {disciplinas.map(d => {
                      const checked = selectedDiscs.includes(d.matriz_disciplina_id)
                      return (
                        <label key={d.matriz_disciplina_id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => toggleDisc(d.matriz_disciplina_id)}
                          />
                          <div>
                            <p className="text-sm font-medium">{d.nome}</p>
                            <p className="text-xs text-muted-foreground">{d.nome_abreviado}</p>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => router.push('/gestao-pedagogica/plano-ensino')}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving || !turmaId || selectedDiscs.length === 0}>
              {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
              {saving ? 'Salvando...' : 'Confirmar Plano'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
