'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { Sidebar } from '@/components/layout/sidebar'
import { listarTurmasDiario, type TurmaDiario } from '@/lib/actions/diario-classe'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
import { getFirstSchool } from '@/lib/actions/schools'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Users, GraduationCap, ChevronRight, Search } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function DiarioClassePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [anoLetivoId, setAnoLetivoId] = useState<string>('')
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [turmas, setTurmas] = useState<TurmaDiario[]>([])
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
    if (!schoolId || !permLoaded || !anoLetivoId) return
    setLoading(true)
    listarTurmasDiario(schoolId, pessoaId, anoLetivoId)
      .then(setTurmas)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [schoolId, pessoaId, anoLetivoId, permLoaded])

  return (
    <>
      <Sidebar />
      <div className="md:pl-64 container mx-auto py-8 px-4 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Diário de Classe</h1>
          <p className="text-muted-foreground mt-1">Selecione uma turma para registrar frequência e avaliações</p>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-foreground block mb-2">Ano Letivo</label>
          <select
            value={anoLetivoId}
            onChange={e => setAnoLetivoId(e.target.value)}
            className="w-full max-w-xs h-10 px-3 rounded-lg border border-slate-300 bg-white text-sm"
          >
            <option value="">Selecione o ano letivo</option>
            {anosLetivos.map((a: any) => (
              <option key={a.id} value={a.id}>{a.descricao || a.ano}</option>
            ))}
          </select>
        </div>

        {!anoLetivoId && !loading && (
          <div className="py-16 text-center text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Selecione um ano letivo para visualizar as turmas</p>
          </div>
        )}

        {loading && anoLetivoId && (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        )}

        {!loading && anoLetivoId && turmas.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Nenhuma turma encontrada para este ano letivo</p>
          </div>
        )}

        {!loading && turmas.length > 0 && (
          <div className="space-y-3">
            {turmas.map(turma => (
              <Card
                key={turma.id}
                className="cursor-pointer hover:shadow-md transition-all border-slate-200 hover:border-primary/30"
                onClick={() => router.push(`/gestao-pedagogica/diario-classe/${turma.id}`)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-primary/10">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{turma.nome}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span>{turma.etapa_nome}</span>
                        {turma.subetapa_nome && <><span>·</span><span>{turma.subetapa_nome}</span></>}
                        <span>·</span>
                        <span>{turma.turno}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {turma.total_alunos}
                      </p>
                      <p className="text-xs text-muted-foreground">alunos</p>
                    </div>
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
