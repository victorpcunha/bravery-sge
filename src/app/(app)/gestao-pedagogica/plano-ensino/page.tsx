'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { Sidebar } from '@/components/layout/sidebar'
import { listarPlanosEnsino, excluirPlanoEnsino, type PlanoEnsino } from '@/lib/actions/plano-ensino'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
import { getFirstSchool } from '@/lib/actions/schools'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Users, Plus, ChevronRight, Trash2, GraduationCap, Search, FileText } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export default function PlanoEnsinoPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [anoLetivoId, setAnoLetivoId] = useState<string>('')
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [planos, setPlanos] = useState<PlanoEnsino[]>([])
  const [loading, setLoading] = useState(true)
  const [pessoaId, setPessoaId] = useState<string | null>(null)

  useEffect(() => {
    getFirstSchool().then(s => {
      if (s) setSchoolId(s.id)
    })
  }, [])

  const { loaded: permLoaded, pessoaId: pid } = usePermissoes(schoolId || '')

  useEffect(() => {
    if (pid !== undefined) setPessoaId(pid)
  }, [pid])

  useEffect(() => {
    if (!schoolId) return
    getAnosLetivosAtivos(schoolId).then(setAnosLetivos).catch(() => {})
  }, [schoolId])

  useEffect(() => {
    if (!schoolId || !permLoaded) return
    setLoading(true)
    listarPlanosEnsino(schoolId, pessoaId, anoLetivoId || undefined)
      .then(setPlanos)
      .catch(() => toast.error('Erro ao carregar planos'))
      .finally(() => setLoading(false))
  }, [schoolId, pessoaId, anoLetivoId, permLoaded])

  const handleExcluir = async (id: string) => {
    if (!confirm('Excluir este plano de ensino?')) return
    try {
      await excluirPlanoEnsino(id, pessoaId)
      setPlanos(prev => prev.filter(p => p.id !== id))
      toast.success('Plano excluído')
    } catch {
      toast.error('Erro ao excluir plano')
    }
  }

  return (
    <>
      <Sidebar />
      <div className="md:pl-64 container mx-auto py-8 px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Plano de Ensino</h1>
            <p className="text-muted-foreground mt-1">Planejamento pedagógico das aulas por turma e disciplina</p>
          </div>
          <Button onClick={() => router.push('/gestao-pedagogica/plano-ensino/criar')}>
            <Plus className="h-4 w-4 mr-1.5" />
            Novo Plano
          </Button>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-foreground block mb-2">Ano Letivo</label>
          <select
            value={anoLetivoId}
            onChange={e => setAnoLetivoId(e.target.value)}
            className="w-full max-w-xs h-10 px-3 rounded-lg border border-slate-300 bg-white text-sm"
          >
            <option value="">Todos os anos</option>
            {anosLetivos.map((a: any) => (
              <option key={a.id} value={a.id}>{a.descricao || a.ano}</option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        )}

        {!loading && planos.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-1">Nenhum Plano de Ensino encontrado</p>
            <p className="text-sm mb-6">Crie um novo plano para começar o planejamento pedagógico</p>
            <Button onClick={() => router.push('/gestao-pedagogica/plano-ensino/criar')}>
              <Plus className="h-4 w-4 mr-1.5" />
              Criar Plano de Ensino
            </Button>
          </div>
        )}

        {!loading && planos.length > 0 && (
          <div className="space-y-3">
            {planos.map(plano => (
              <Card
                key={plano.id}
                className="cursor-pointer hover:shadow-md transition-all border-slate-200 hover:border-primary/30"
                onClick={() => router.push(`/gestao-pedagogica/plano-ensino/${plano.id}`)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-primary/10">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{plano.turma_nome}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span>{plano.etapa_nome}</span>
                        {plano.is_interdisciplinar && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Interdisciplinar</span>
                        )}
                      </p>
                      {(plano.disciplinas?.length ?? 0) > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {plano.disciplinas?.map(d => (
                            <span key={d.id} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              {d.nome}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{plano.total_aulas} aulas</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={e => { e.stopPropagation(); handleExcluir(plano.id) }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
