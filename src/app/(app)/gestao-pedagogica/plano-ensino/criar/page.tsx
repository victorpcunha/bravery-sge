'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { criarPlanoEnsino, getTurmaEtapaEnsino } from '@/lib/actions/plano-ensino'
import { listarTurmasDiario, getDisciplinasDiario } from '@/lib/actions/diario-classe'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { FormCard } from '@/components/layout/form-card'
import { EmptyState } from '@/components/ui/empty-state'
import { cn } from '@/lib/utils'
import { ArrowLeft, Check, GraduationCap, BookOpen, Loader2, School } from 'lucide-react'
import { toast } from 'sonner'

export default function CriarPlanoEnsinoPage() {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </PageContainer>
      }
    >
      <CriarPlanoForm />
    </Suspense>
  )
}

function CriarPlanoForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const escolaParam = searchParams.get('escola')
  const { schoolId: authSchoolId, isSuperAdmin } = useAuth()
  const schoolId = isSuperAdmin ? escolaParam : authSchoolId
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
    getAnosLetivosAtivos(schoolId)
      .then(list => {
        setAnosLetivos(list)
        const ativo = list.find((a: any) => a.status === 'ativo')
        setAnoLetivoId(ativo?.id || '')
      })
      .catch(() => {})
  }, [schoolId])

  useEffect(() => {
    if (!permLoaded || !schoolId || !anoLetivoId) return
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
    if (!anoLetivoId || !turmaId) {
      toast.error('Selecione o ano letivo e a turma')
      return
    }
    if (!schoolId) {
      toast.error('Escola não selecionada')
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

  if (isSuperAdmin && !escolaParam) {
    return (
      <PageContainer>
        <PageHeader
          title="Novo Plano de Ensino"
          description="Configure o ano letivo, turma e disciplinas do plano"
          icon={BookOpen}
        />
        <Card className="shadow-sm">
          <EmptyState
            icon={School}
            title="Selecione uma escola"
            description="Volte para a lista de planos de ensino, selecione uma escola e clique em 'Novo Plano de Ensino'."
            action={
              <Button onClick={() => router.push('/gestao-pedagogica/plano-ensino')}>
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Voltar
              </Button>
            }
          />
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Novo Plano de Ensino"
        description="Configure o ano letivo, turma e disciplinas do plano"
        icon={BookOpen}
      />

      <div className="space-y-6">
        <FormCard title="Identificação" description="Selecione o ano letivo e a turma do plano">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ano-letivo" className="text-[14px] font-medium">Ano Letivo</Label>
              <Select value={anoLetivoId} onValueChange={v => { setAnoLetivoId(v); setTurmaId(''); setSelectedDiscs([]) }}>
                <SelectTrigger id="ano-letivo" className="mt-1 h-10"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {anosLetivos.map((a: any) => (
                    <SelectItem key={a.id} value={a.id}>{a.descricao || a.ano}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="turma" className="text-[14px] font-medium">Turma</Label>
              <Select value={turmaId} onValueChange={v => { setTurmaId(v); setSelectedDiscs([]) }} disabled={!anoLetivoId}>
                <SelectTrigger id="turma" className="mt-1 h-10"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {turmas.map((t: any) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.nome} — {t.etapa_nome} {t.subetapa_nome ? `(${t.subetapa_nome})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </FormCard>

        {turmaId && (
          <FormCard
            title="Disciplinas"
            description={isInterdisciplinar ? 'Plano interdisciplinar — selecione múltiplas disciplinas' : 'Selecione a disciplina do plano'}
          >
            {disciplinas.length > 0 && (
              <label className="flex items-center gap-2 text-[14px] font-normal cursor-pointer mb-4">
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
            {disciplinas.length === 0 ? (
              <p className="text-[15px] text-muted-foreground">Nenhuma disciplina vinculada a esta turma.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {disciplinas.map(d => {
                  const checked = selectedDiscs.includes(d.matriz_disciplina_id)
                  return (
                    <button
                      key={d.matriz_disciplina_id}
                      type="button"
                      onClick={() => toggleDisc(d.matriz_disciplina_id)}
                      aria-pressed={checked}
                      className={cn(
                        'relative w-full rounded-lg border p-4 text-left transition-all',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        checked
                          ? 'border-primary bg-primary/5 shadow-xs'
                          : 'border-border bg-card hover:border-primary/40 hover:bg-muted/40'
                      )}
                    >
                      {checked && (
                        <span className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                      )}
                      <p className="text-[15px] font-semibold text-foreground pr-7">{d.nome}</p>
                      <p className="text-[13px] text-muted-foreground mt-0.5">{d.nome_abreviado}</p>
                    </button>
                  )
                })}
              </div>
            )}
          </FormCard>
        )}

        <div className="flex justify-end gap-3">
          <Button variant="outline" className="h-11" onClick={() => router.push('/gestao-pedagogica/plano-ensino')}>
            Cancelar
          </Button>
          <Button className="h-11 shadow-md" onClick={handleSave} disabled={saving || !turmaId || selectedDiscs.length === 0}>
            {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <GraduationCap className="h-4 w-4 mr-1.5" />}
            {saving ? 'Salvando...' : 'Confirmar Plano'}
          </Button>
        </div>
      </div>
    </PageContainer>
  )
}
