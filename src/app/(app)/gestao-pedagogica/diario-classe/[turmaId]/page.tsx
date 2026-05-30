'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { Sidebar } from '@/components/layout/sidebar'
import { getAlunosDaTurma, getDisciplinasDiario, gerarNumeroChamada, getMetodoAvaliacaoDaTurma, type AlunoMatriculado } from '@/lib/actions/diario-classe'
import { getFirstSchool } from '@/lib/actions/schools'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, Users, BookOpen, GraduationCap, Hash, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

export default function TurmaDiarioPage() {
  const params = useParams()
  const router = useRouter()
  const turmaId = params.turmaId as string
  const { user } = useAuth()
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [alunos, setAlunos] = useState<AlunoMatriculado[]>([])
  const [disciplinas, setDisciplinas] = useState<any[]>([])
  const [metodo, setMetodo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [gerando, setGerando] = useState(false)

  useEffect(() => {
    getFirstSchool().then(s => {
      if (s) setSchoolId(s.id)
    })
  }, [])

  const { loaded: permLoaded, pessoaId } = usePermissoes(schoolId || '')

  useEffect(() => {
    if (!turmaId) return
    setLoading(true)
    Promise.all([
      getAlunosDaTurma(turmaId),
      getDisciplinasDiario(turmaId, pessoaId || undefined),
      getMetodoAvaliacaoDaTurma(turmaId),
    ])
      .then(([a, d, m]) => {
        setAlunos(a)
        setDisciplinas(d)
        setMetodo(m)
      })
      .catch(() => toast.error('Erro ao carregar dados da turma'))
      .finally(() => setLoading(false))
  }, [turmaId, pessoaId])

  const handleGerarChamada = async () => {
    setGerando(true)
    try {
      const total = await gerarNumeroChamada(turmaId)
      toast.success(`Chamada gerada para ${total} alunos`)
      const alunosAtualizados = await getAlunosDaTurma(turmaId)
      setAlunos(alunosAtualizados)
    } catch {
      toast.error('Erro ao gerar chamada')
    } finally {
      setGerando(false)
    }
  }

  const tiposAtivos = metodo?.tipos_avaliacao || {}
  const criterioFrequencia = metodo?.criterio_frequencia

  return (
    <>
      <Sidebar />
      <div className="md:pl-64 container mx-auto py-8 px-4 max-w-5xl">
        <Button variant="ghost" className="mb-4" onClick={() => router.push('/gestao-pedagogica/diario-classe')}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Alunos Matriculados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{alunos.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Disciplinas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{disciplinas.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Chamada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" onClick={handleGerarChamada} disabled={gerando}>
                <Hash className="h-4 w-4 mr-1" />
                {gerando ? 'Gerando...' : 'Gerar Chamada'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {metodo && (
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Método de Avaliação: {metodo.nome}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {criterioFrequencia === 'por_dia' && <Badge variant="secondary">Frequência por Dia</Badge>}
                {criterioFrequencia === 'por_aula' && <Badge variant="secondary">Frequência por Aula</Badge>}
                {tiposAtivos.parecer === 'true' && <Badge variant="secondary">Parecer Descritivo</Badge>}
                {tiposAtivos.nivel === 'true' && <Badge variant="secondary">Avaliação por Indicadores</Badge>}
                {tiposAtivos.numerico === 'true' && <Badge variant="secondary">Avaliações Numéricas</Badge>}
                {tiposAtivos.conceito === 'true' && <Badge variant="secondary">Avaliação por Conceitos</Badge>}
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Carregando...</div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alunos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-xs text-muted-foreground uppercase tracking-wider">
                        <th className="text-left py-2 px-2 w-12">#</th>
                        <th className="text-left py-2 px-2">Nome</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alunos.map((aluno, idx) => (
                        <tr key={aluno.id} className="border-b border-slate-50 hover:bg-slate-50/40">
                          <td className="py-2 px-2 text-sm text-muted-foreground">
                            {aluno.numero_chamada || idx + 1}
                          </td>
                          <td className="py-2 px-2 text-sm font-medium">{aluno.nome_completo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  )
}
