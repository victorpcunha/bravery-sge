'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { listarComunicados, excluirComunicado, type ComunicadoLista } from '@/lib/actions/comunicados'
import { getAnosLetivos } from '@/lib/actions/calendarios'
import { getEtapasEnsino } from '@/lib/actions/etapas-ensino'
import { getTurmas } from '@/lib/actions/turmas'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { EmptyState } from '@/components/ui/empty-state'
import { Pagination } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { ComunicadoFiltros, type OpcaoFiltro } from '@/components/comunicados/comunicado-filtros'
import { ComunicadoMinicard } from '@/components/comunicados/comunicado-minicard'
import { Megaphone, Plus, SearchX, FileText, ShieldAlert, School } from 'lucide-react'
import { toast } from 'sonner'

const RECURSO = 'portal.comunicados'
const ITEMS_PER_PAGE = 10

export default function ComunicadosPage() {
  const router = useRouter()
  const { schoolId, isSuperAdmin, allSchools } = useAuth()
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const [pessoaId, setPessoaId] = useState<string | null>(null)

  const [anos, setAnos] = useState<Array<{ id: string; descricao: string }>>([])
  const [anoLetivoId, setAnoLetivoId] = useState('')
  const [etapas, setEtapas] = useState<OpcaoFiltro[]>([])
  const [etapaId, setEtapaId] = useState('__all__')
  const [turmas, setTurmas] = useState<OpcaoFiltro[]>([])
  const [turmaId, setTurmaId] = useState('__all__')
  const [dataEnvio, setDataEnvio] = useState('')
  const [dataFinal, setDataFinal] = useState('')

  const [comunicados, setComunicados] = useState<ComunicadoLista[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const { loaded: permLoaded, pessoaId: pid, pode } = usePermissoes(schoolId || '')

  useEffect(() => {
    if (pid !== undefined) setPessoaId(pid)
  }, [pid])

  const effectiveSchoolId = isSuperAdmin ? selectedSchoolId : schoolId
  const podeVisualizar = pode.visualizar(RECURSO)
  const podeCriar = pode.criar(RECURSO)
  const podeEditar = pode.editar(RECURSO)
  const podeExcluir = pode.excluir(RECURSO)

  useEffect(() => {
    setAnoLetivoId('')
    setEtapaId('__all__')
    setTurmaId('__all__')
    setDataEnvio('')
    setDataFinal('')
    setAnos([])
    setEtapas([])
    setTurmas([])
    setComunicados([])
  }, [effectiveSchoolId])

  useEffect(() => {
    setCurrentPage(1)
  }, [anoLetivoId, etapaId, turmaId, dataEnvio, dataFinal])

  useEffect(() => {
    if (!effectiveSchoolId) return
    getAnosLetivos(effectiveSchoolId)
      .then(list => {
        setAnos(list.map(a => ({ id: a.id, descricao: a.descricao })))
        const ativo = list.find(a => a.status === 'ativo')
        setAnoLetivoId(ativo?.id || '')
      })
      .catch(() => {})
  }, [effectiveSchoolId])

  useEffect(() => {
    if (!effectiveSchoolId || !anoLetivoId) {
      setEtapas([])
      return
    }
    getEtapasEnsino(effectiveSchoolId, anoLetivoId)
      .then(list => setEtapas(list.map(e => ({ id: e.id, nome: e.etapa_nome }))))
      .catch(() => {})
  }, [effectiveSchoolId, anoLetivoId])

  useEffect(() => {
    if (!effectiveSchoolId || !anoLetivoId) {
      setTurmas([])
      return
    }
    getTurmas(
      effectiveSchoolId,
      undefined,
      etapaId === '__all__' ? undefined : etapaId,
      anoLetivoId
    )
      .then(list => setTurmas(list.map((t: { id: string; nome: string }) => ({ id: t.id, nome: t.nome }))))
      .catch(() => {})
  }, [effectiveSchoolId, anoLetivoId, etapaId])

  useEffect(() => {
    if (!permLoaded || !podeVisualizar) {
      if (permLoaded) setLoading(false)
      return
    }
    if (!effectiveSchoolId || !anoLetivoId) {
      setComunicados([])
      setLoading(false)
      return
    }
    setLoading(true)
    listarComunicados(effectiveSchoolId, {
      anoLetivoId,
      dataEnvio: dataEnvio || undefined,
      dataFinal: dataFinal || undefined,
      etapaId: etapaId === '__all__' ? undefined : etapaId,
      turmaId: turmaId === '__all__' ? undefined : turmaId,
    }, pessoaId)
      .then(setComunicados)
      .catch(() => toast.error('Erro ao carregar comunicados'))
      .finally(() => setLoading(false))
  }, [effectiveSchoolId, pessoaId, anoLetivoId, etapaId, turmaId, dataEnvio, dataFinal, permLoaded, podeVisualizar])

  const goNovo = () => {
    const params = new URLSearchParams()
    if (isSuperAdmin && selectedSchoolId) params.set('escola', selectedSchoolId)
    const qs = params.toString()
    router.push(`/comunicados/novo${qs ? `?${qs}` : ''}`)
  }

  const handleEditar = (id: string) => {
    if (!podeEditar) {
      toast.error('Sem permissão para editar comunicados')
      return
    }
    router.push(`/comunicados/${id}`)
  }

  const handleExcluir = async () => {
    if (!deleteId || !effectiveSchoolId) return
    setDeleting(true)
    try {
      await excluirComunicado(deleteId, effectiveSchoolId, pessoaId)
      setComunicados(prev => prev.filter(c => c.id !== deleteId))
      toast.success('Comunicado excluído')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao excluir comunicado')
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const limparFiltros = () => {
    setEtapaId('__all__')
    setTurmaId('__all__')
    setDataEnvio('')
    setDataFinal('')
  }

  const temFiltros = etapaId !== '__all__' || turmaId !== '__all__' || dataEnvio !== '' || dataFinal !== ''
  const totalPages = Math.ceil(comunicados.length / ITEMS_PER_PAGE)
  const paginados = comunicados.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  if (permLoaded && !podeVisualizar) {
    return (
      <PageContainer>
        <PageHeader
          title="Comunicados do Portal"
          description="Avisos da escola exibidos no Portal dos Responsáveis"
          icon={Megaphone}
        />
        <EmptyState
          icon={ShieldAlert}
          title="Sem permissão"
          description="Você não tem permissão para visualizar os comunicados. Fale com o gestor da escola."
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Comunicados do Portal"
        description="Avisos da escola exibidos no Portal dos Responsáveis"
        icon={Megaphone}
      />

      <PageSection variant="compact" title="Filtros" className="mb-6">
        <ComunicadoFiltros
          mostrarEscola={isSuperAdmin && allSchools.length > 0}
          escolas={allSchools.map(s => ({ id: s.id, nome: s.nome_escola }))}
          escolaId={selectedSchoolId}
          onEscolaChange={setSelectedSchoolId}
          anos={anos}          anoLetivoId={anoLetivoId}
          onAnoChange={setAnoLetivoId}
          dataEnvio={dataEnvio}
          dataFinal={dataFinal}
          onDataEnvio={setDataEnvio}
          onDataFinal={setDataFinal}
          etapas={etapas}
          etapaId={etapaId}
          onEtapaChange={v => { setEtapaId(v); setTurmaId('__all__') }}
          turmas={turmas}
          turmaId={turmaId}
          onTurmaChange={setTurmaId}
          temFiltros={temFiltros}
          onLimpar={limparFiltros}
          desabilitado={!effectiveSchoolId}
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
        <PageSection variant="flush" title="Comunicados Registrados">
          <div className="p-6">
            <EmptyState
              icon={School}
              title="Selecione uma escola"
              description="Escolha uma escola para visualizar os comunicados."
            />
          </div>
        </PageSection>
      )}

      {!loading && !(isSuperAdmin && !selectedSchoolId) && effectiveSchoolId && !anoLetivoId && (
        <PageSection variant="flush" title="Comunicados Registrados">
          <div className="p-6">
            <EmptyState
              icon={School}
              title="Nenhum ano letivo ativo"
              description="Não há ano letivo ativo para esta escola."
            />
          </div>
        </PageSection>
      )}

      {!loading && effectiveSchoolId && anoLetivoId && comunicados.length === 0 && (
        <PageSection
          variant="flush"
          title="Comunicados Registrados"
          actions={podeCriar ? (
            <Button onClick={goNovo}>
              <Plus className="h-4 w-4 mr-1.5" />
              Novo Comunicado
            </Button>
          ) : undefined}
        >
          <div className="p-6">
            {temFiltros ? (
              <EmptyState
                icon={SearchX}
                title="Nenhum comunicado com esses filtros"
                description="Tente ajustar os filtros para encontrar comunicados."
                action={
                  <Button variant="outline" onClick={limparFiltros}>
                    Limpar filtros
                  </Button>
                }
              />
            ) : (
              <EmptyState
                icon={FileText}
                title="Nenhum comunicado registrado"
                description="Registre o primeiro comunicado para exibi-lo no Portal dos Responsáveis"
                action={podeCriar ? (
                  <Button onClick={goNovo}>
                    <Plus className="h-4 w-4 mr-1.5" />
                    Novo Comunicado
                  </Button>
                ) : undefined}
              />
            )}
          </div>
        </PageSection>
      )}

      {!loading && effectiveSchoolId && anoLetivoId && comunicados.length > 0 && (
        <PageSection
          variant="flush"
          title="Comunicados Registrados"
          description={`${comunicados.length} comunicado(s) encontrado(s)`}
          actions={podeCriar ? (
            <Button onClick={goNovo}>
              <Plus className="h-4 w-4 mr-1.5" />
              Novo Comunicado
            </Button>
          ) : undefined}
        >
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginados.map(c => (
                <ComunicadoMinicard
                  key={c.id}
                  comunicado={c}
                  onEditar={() => handleEditar(c.id)}
                  onExcluir={() => setDeleteId(c.id)}
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
                  totalItems={comunicados.length}
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
        title="Excluir comunicado"
        description="Deseja excluir este comunicado? Ele deixará de ser exibido no Portal dos Responsáveis. Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="destructive"
        loading={deleting}
        onConfirm={handleExcluir}
      />
    </PageContainer>
  )
}
