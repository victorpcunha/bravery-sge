'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTabActive } from '@/lib/tab-params'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { listarOcorrencias, excluirOcorrencia, type OcorrenciaLista } from '@/lib/actions/ocorrencias'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { EmptyState } from '@/components/ui/empty-state'
import { Pagination } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { OcorrenciaFiltros, type TipoFiltro } from '@/components/ocorrencias/ocorrencia-filtros'
import { OcorrenciaMinicard } from '@/components/ocorrencias/ocorrencia-minicard'
import { AlertTriangle, Plus, SearchX, FileText, ShieldAlert, School } from 'lucide-react'
import { toast } from 'sonner'

const RECURSO = 'gestao-academica.ocorrencias'
const ITEMS_PER_PAGE = 10

export default function OcorrenciasPage() {
  const router = useRouter()
  const { schoolId, isSuperAdmin, allSchools } = useAuth()
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const [pessoaId, setPessoaId] = useState<string | null>(null)

  const [dataInicial, setDataInicial] = useState('')
  const [dataFinal, setDataFinal] = useState('')
  const [profissionalIds, setProfissionalIds] = useState<string[]>([])
  const [alunoIds, setAlunoIds] = useState<string[]>([])
  const [tipo, setTipo] = useState<TipoFiltro>('todas')

  const [ocorrencias, setOcorrencias] = useState<OcorrenciaLista[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const { loaded: permLoaded, pessoaId: pid, pode } = usePermissoes(schoolId || '')
  const tabActive = useTabActive()
  const primeiroAtivo = useRef(true)

  useEffect(() => {
    if (pid !== undefined) setPessoaId(pid)
  }, [pid])

  const effectiveSchoolId = isSuperAdmin ? selectedSchoolId : schoolId
  const podeVisualizar = pode.visualizar(RECURSO)
  const podeCriar = pode.criar(RECURSO)
  const podeEditar = pode.editar(RECURSO)
  const podeExcluir = pode.excluir(RECURSO)

  useEffect(() => {
    setDataInicial('')
    setDataFinal('')
    setProfissionalIds([])
    setAlunoIds([])
    setTipo('todas')
    setOcorrencias([])
  }, [effectiveSchoolId])

  useEffect(() => {
    setCurrentPage(1)
  }, [dataInicial, dataFinal, profissionalIds, alunoIds, tipo])

  const carregar = useCallback(() => {
    if (!permLoaded || !podeVisualizar) {
      if (permLoaded) setLoading(false)
      return
    }
    if (!effectiveSchoolId) {
      setOcorrencias([])
      setLoading(false)
      return
    }
    setLoading(true)
    listarOcorrencias(effectiveSchoolId, {
      dataInicial: dataInicial || undefined,
      dataFinal: dataFinal || undefined,
      profissionalIds: profissionalIds.length ? profissionalIds : undefined,
      alunoIds: alunoIds.length ? alunoIds : undefined,
      tipo: tipo === 'todas' ? undefined : tipo,
    }, pessoaId)
      .then(setOcorrencias)
      .catch((err) => toast.error(err instanceof Error ? err.message : 'Erro ao carregar ocorrências'))
      .finally(() => setLoading(false))
  }, [effectiveSchoolId, pessoaId, dataInicial, dataFinal, profissionalIds, alunoIds, tipo, permLoaded, podeVisualizar])

  useEffect(() => {
    carregar()
  }, [carregar])

  // Keep-alive das abas: ao voltar do cadastro/edição o painel é reativado
  // sem remontar — refaz a busca para exibir registros criados/alterados.
  useEffect(() => {
    if (!tabActive) {
      primeiroAtivo.current = false
      return
    }
    if (primeiroAtivo.current) return
    carregar()
  }, [tabActive, carregar])

  const goNovo = () => {
    const params = new URLSearchParams()
    if (isSuperAdmin && selectedSchoolId) params.set('escola', selectedSchoolId)
    const qs = params.toString()
    router.push(`/ocorrencias/novo${qs ? `?${qs}` : ''}`)
  }

  const handleEditar = (id: string) => {
    if (!podeEditar) {
      toast.error('Sem permissão para editar ocorrências')
      return
    }
    const params = new URLSearchParams()
    if (isSuperAdmin && selectedSchoolId) params.set('escola', selectedSchoolId)
    const qs = params.toString()
    router.push(`/ocorrencias/${id}${qs ? `?${qs}` : ''}`)
  }

  const handleExcluir = async () => {
    if (!deleteId || !effectiveSchoolId) return
    setDeleting(true)
    try {
      await excluirOcorrencia(deleteId, effectiveSchoolId, pessoaId)
      setOcorrencias(prev => prev.filter(o => o.id !== deleteId))
      toast.success('Ocorrência excluída')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao excluir ocorrência')
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const limparFiltros = () => {
    setDataInicial('')
    setDataFinal('')
    setProfissionalIds([])
    setAlunoIds([])
    setTipo('todas')
  }

  const temFiltros = dataInicial !== '' || dataFinal !== '' || profissionalIds.length > 0 || alunoIds.length > 0 || tipo !== 'todas'
  const totalPages = Math.ceil(ocorrencias.length / ITEMS_PER_PAGE)
  const paginados = ocorrencias.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  if (permLoaded && !podeVisualizar) {
    return (
      <PageContainer>
        <PageHeader
          title="Ocorrências"
          description="Registro de ocorrências positivas e negativas dos alunos"
          icon={AlertTriangle}
        />
        <EmptyState
          icon={ShieldAlert}
          title="Sem permissão"
          description="Você não tem permissão para visualizar as ocorrências. Fale com o gestor da escola."
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Ocorrências"
        description="Registro de ocorrências positivas e negativas dos alunos"
        icon={AlertTriangle}
      />

      <PageSection variant="compact" title="Filtros" className="mb-6">
        <OcorrenciaFiltros
          mostrarEscola={isSuperAdmin && allSchools.length > 0}
          escolas={allSchools.map(s => ({ id: s.id, nome: s.nome_escola }))}
          escolaId={selectedSchoolId}
          onEscolaChange={setSelectedSchoolId}
          dataInicial={dataInicial}
          dataFinal={dataFinal}
          onDataInicial={setDataInicial}
          onDataFinal={setDataFinal}
          profissionalIds={profissionalIds}
          onProfissionaisChange={setProfissionalIds}
          alunoIds={alunoIds}
          onAlunosChange={setAlunoIds}
          tipo={tipo}
          onTipoChange={setTipo}
          temFiltros={temFiltros}
          onLimpar={limparFiltros}
          schoolId={effectiveSchoolId}
          pessoaId={pessoaId}
        />
      </PageSection>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-52 w-full rounded-lg" />
          ))}
        </div>
      )}

      {!loading && isSuperAdmin && !selectedSchoolId && (
        <PageSection variant="flush" title="Ocorrências Registradas">
          <div className="p-6">
            <EmptyState
              icon={School}
              title="Selecione uma escola"
              description="Escolha uma escola para visualizar as ocorrências."
            />
          </div>
        </PageSection>
      )}

      {!loading && !(isSuperAdmin && !selectedSchoolId) && effectiveSchoolId && ocorrencias.length === 0 && (
        <PageSection
          variant="flush"
          title="Ocorrências Registradas"
          actions={podeCriar ? (
            <Button onClick={goNovo}>
              <Plus className="h-4 w-4 mr-1.5" />
              Nova Ocorrência
            </Button>
          ) : undefined}
        >
          <div className="p-6">
            {temFiltros ? (
              <EmptyState
                icon={SearchX}
                title="Nenhuma ocorrência com esses filtros"
                description="Tente ajustar os filtros para encontrar ocorrências."
                action={
                  <Button variant="outline" onClick={limparFiltros}>
                    Limpar filtros
                  </Button>
                }
              />
            ) : (
              <EmptyState
                icon={FileText}
                title="Nenhuma ocorrência registrada"
                description="Registre a primeira ocorrência dos alunos desta escola"
                action={podeCriar ? (
                  <Button onClick={goNovo}>
                    <Plus className="h-4 w-4 mr-1.5" />
                    Nova Ocorrência
                  </Button>
                ) : undefined}
              />
            )}
          </div>
        </PageSection>
      )}

      {!loading && effectiveSchoolId && ocorrencias.length > 0 && (
        <PageSection
          variant="flush"
          title="Ocorrências Registradas"
          description={`${ocorrencias.length} ocorrência(s) encontrada(s)`}
          actions={podeCriar ? (
            <Button onClick={goNovo}>
              <Plus className="h-4 w-4 mr-1.5" />
              Nova Ocorrência
            </Button>
          ) : undefined}
        >
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginados.map(o => (
                <OcorrenciaMinicard
                  key={o.id}
                  ocorrencia={o}
                  onEditar={() => handleEditar(o.id)}
                  onExcluir={() => setDeleteId(o.id)}
                  podeEditar={podeEditar}
                  podeExcluir={podeExcluir}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-border mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={ocorrencias.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </PageSection>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => { if (!open) setDeleteId(null) }}
        title="Excluir ocorrência"
        description="Deseja excluir esta ocorrência? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="destructive"
        loading={deleting}
        onConfirm={handleExcluir}
      />
    </PageContainer>
  )
}
