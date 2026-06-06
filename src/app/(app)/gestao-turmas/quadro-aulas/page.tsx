'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, GraduationCap, Clock, Calendar, Eye, Pencil, Trash2 } from 'lucide-react'
import { getFirstSchool } from '@/lib/actions/schools'
import { getQuadrosAulas, getAnosLetivosAtivos, deleteQuadroAula, toggleQuadroAulaAtivo } from '@/lib/actions/quadro-aulas'
import { toast } from 'sonner'

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  futuro: { label: 'Futuro', variant: 'outline' },
  ativo: { label: 'Ativo', variant: 'default' },
  inativo: { label: 'Inativo', variant: 'secondary' },
  encerrado: { label: 'Encerrado', variant: 'destructive' },
}

const DIAS_NOME = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function formatDate(d: string) {
  if (!d) return ''
  const [y, m, day] = d.split('T')[0].split('-')
  if (!y || !m || !day) return d
  return `${day}/${m}/${y}`
}

export default function QuadrosAulasPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [schoolId, setSchoolId] = useState('')
  const { pessoaId } = usePermissoes(schoolId)
  const [quadros, setQuadros] = useState<any[]>([])
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [anoFiltro, setAnoFiltro] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    getFirstSchool().then(async s => {
      setSchoolId(s.id)
      const anos = await getAnosLetivosAtivos(s.id)
      setAnosLetivos(anos)
      const ativo = anos.find((a: any) => a.status === 'ativo')
      if (ativo) setAnoFiltro(ativo.id)
    }).catch((e) => {
      console.error('Erro init listagem:', e)
    })
  }, [user])

  useEffect(() => {
    if (!schoolId) return
    loadQuadros()
  }, [schoolId])

  const loadQuadros = async () => {
    setLoading(true)
    try {
      const data = await getQuadrosAulas(schoolId, anoFiltro || undefined)
      setQuadros(data)
    } catch (e) {
      console.error('Erro loadQuadros:', e)
      toast.error('Erro ao carregar quadros de aulas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!schoolId) return
    loadQuadros()
  }, [anoFiltro])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este quadro de aulas?')) return
    try {
      await deleteQuadroAula(id, pessoaId)
      toast.success('Quadro excluído')
      loadQuadros()
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao excluir quadro')
    }
  }

  const handleToggleAtivo = async (id: string, ativo: boolean) => {
    try {
      await toggleQuadroAulaAtivo(id, ativo, pessoaId)
      toast.success(ativo ? 'Quadro reativado' : 'Quadro inativado')
      loadQuadros()
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao alterar status')
    }
  }

  return (
    <div className="md:pl-64 container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Quadro de Aulas</h1>
          <p className="text-sm text-slate-500 mt-0.5">Grade horária das turmas</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-white"
          onClick={() => router.push('/gestao-turmas/quadro-aulas/cadastro')}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Novo Quadro de Aula
        </Button>
      </div>

      <Card className="border-border shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <CardHeader className="bg-slate-50/40 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Select value={anoFiltro} onValueChange={setAnoFiltro}>
              <SelectTrigger className="w-64 border-slate-300">
                <SelectValue placeholder="Filtrar por ano letivo" />
              </SelectTrigger>
              <SelectContent>
                {anosLetivos.map((ano: any) => (
                  <SelectItem key={ano.id} value={ano.id}>{ano.descricao}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Carregando...</div>
          ) : quadros.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">Nenhum quadro de aulas encontrado</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/60">
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Turma</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Ano Letivo</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Vigência</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Última Alteração</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {quadros.map((q: any) => {
                    const st = STATUS_MAP[q.status] || STATUS_MAP.futuro
                    return (
                      <tr key={q.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-slate-400" />
                            <span className="font-medium text-slate-800">
                              {q.turma?.codigo_inep ? `${q.turma.codigo_inep} - ` : ''}{q.turma?.nome}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{q.academico_anos_letivos?.descricao}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(q.data_inicial)} - {formatDate(q.data_final)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={st.variant}>{st.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs">
                          {q.updated_at ? new Date(q.updated_at).toLocaleString('pt-BR') : '-'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8"
                              onClick={() => router.push(`/gestao-turmas/quadro-aulas/cadastro?id=${q.id}`)}
                              title="Visualizar/Editar">
                              <Eye className="h-4 w-4 text-slate-500" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8"
                              onClick={() => handleToggleAtivo(q.id, !q.ativo)}
                              title={q.ativo ? 'Inativar' : 'Reativar'}>
                              <Pencil className="h-4 w-4 text-slate-500" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8"
                              onClick={() => handleDelete(q.id)}
                              title="Excluir">
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
