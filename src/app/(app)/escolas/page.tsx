'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, School as SchoolIcon, Hash, Phone, Mail, ShieldAlert, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/feedback/status-badge'
import { PageSection } from '@/components/layout/page-section'
import { FilterBar } from '@/components/layout/filter-bar'
import { Pagination } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getSchoolsEscopadas, type School } from '@/lib/actions/schools'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { toast } from 'sonner'

const ITEMS_PER_PAGE = 10

const situacaoFuncionamento = {
  '1': 'Em Atividade',
  '2': 'Paralisada',
  '3': 'Extinta',
  '4': 'Em Construção',
} as const

const SITUACOES = [
  { value: '', label: 'Todas as situações' },
  { value: '1', label: 'Em Atividade' },
  { value: '2', label: 'Paralisada' },
  { value: '3', label: 'Extinta' },
  { value: '4', label: 'Em Construção' },
]

const DEPENDENCIAS = [
  { value: '', label: 'Todas as dependências' },
  { value: '1', label: 'Federal' },
  { value: '2', label: 'Estadual' },
  { value: '3', label: 'Municipal' },
  { value: '4', label: 'Privada' },
]

const LOCALIZACOES = [
  { value: '', label: 'Todas as localizações' },
  { value: '1', label: 'Urbana' },
  { value: '2', label: 'Rural' },
]

function formatTelefone(ddd: string | null | undefined, numero: string | null | undefined): string {
  const d = ddd ? `(${ddd}) ` : ''
  if (!numero) return d.trim()
  if (numero.length === 9) return `${d}${numero.slice(0, 5)}-${numero.slice(5)}`
  if (numero.length === 8) return `${d}${numero.slice(0, 4)}-${numero.slice(4)}`
  return `${d}${numero}`
}

export default function EscolasPage() {
  const { user, loading: authLoading, schoolId, isSuperAdmin, allSchools } = useAuth()
  const { loaded: permLoaded, pode } = usePermissoes(isSuperAdmin ? null : schoolId)
  const router = useRouter()

  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [situacaoFiltro, setSituacaoFiltro] = useState('')
  const [dependenciaFiltro, setDependenciaFiltro] = useState('')
  const [localizacaoFiltro, setLocalizacaoFiltro] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const podeCriar = pode.criar('escolas')
  const podeVisualizar = pode.visualizar('escolas')

  const loadSchools = useCallback(async () => {
    setLoading(true)
    try {
      const sIds = isSuperAdmin ? null : allSchools.map((s) => s.id)
      const data = await getSchoolsEscopadas(sIds && sIds.length > 0 ? sIds : null)
      setSchools(data)
    } catch {
      toast.error('Erro ao carregar unidades escolares')
    } finally {
      setLoading(false)
    }
  }, [isSuperAdmin, allSchools])

  useEffect(() => {
    if (permLoaded) loadSchools()
  }, [permLoaded, loadSchools])

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  const filtrosAtivos = search.trim() !== '' || situacaoFiltro !== '' || dependenciaFiltro !== '' || localizacaoFiltro !== ''

  const limparFiltros = () => {
    setSearch('')
    setSituacaoFiltro('')
    setDependenciaFiltro('')
    setLocalizacaoFiltro('')
    setCurrentPage(1)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [search, situacaoFiltro, dependenciaFiltro, localizacaoFiltro])

  const filtered = useMemo(() => {
    const termo = search.trim().toLowerCase()
    return schools.filter((s) => {
      if (termo && !`${s.nome_escola} ${s.codigo_inep || ''}`.toLowerCase().includes(termo)) return false
      if (situacaoFiltro && s.situacao_funcionamento !== situacaoFiltro) return false
      if (dependenciaFiltro && s.dependencia_administrativa !== dependenciaFiltro) return false
      if (localizacaoFiltro && s.localizacao !== localizacaoFiltro) return false
      return true
    })
  }, [schools, search, situacaoFiltro, dependenciaFiltro, localizacaoFiltro])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filtered.slice(start, start + ITEMS_PER_PAGE)
  }, [filtered, currentPage])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (permLoaded && !podeVisualizar) {
    return (
      <PageContainer>
        <PageHeader icon={SchoolIcon} title="Unidade Escolar" description="Gerencie as unidades escolares" />
        <Card className="shadow-sm">
          <EmptyState
            icon={ShieldAlert}
            title="Sem permissão"
            description="Seu perfil não possui permissão para visualizar unidades escolares."
          />
        </Card>
      </PageContainer>
    )
  }

  if (!authLoading && user && permLoaded && !isSuperAdmin && allSchools.length === 0) {
    return (
      <PageContainer>
        <PageHeader icon={SchoolIcon} title="Unidade Escolar" description="Gerencie as unidades escolares" />
        <Card className="shadow-sm">
          <EmptyState
            icon={SchoolIcon}
            title="Nenhuma escola vinculada"
            description="Seu usuário não possui vínculo com nenhuma unidade escolar."
          />
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        icon={SchoolIcon}
        title="Unidade Escolar"
        description="Gerencie as unidades escolares (Registro 00)"
        actions={
          podeCriar && (
            <Button asChild>
              <Link href="/escolas/novo">
                <Plus className="mr-2 h-4 w-4" />
                Nova Escola
              </Link>
            </Button>
          )
        }
      />

      <PageSection variant="compact" title="Filtros" className="mb-6">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar por nome ou INEP..."
        >
          <Select value={situacaoFiltro || '__all__'} onValueChange={(v) => setSituacaoFiltro(v === '__all__' ? '' : v)}>
            <SelectTrigger className="w-auto min-w-[190px] h-9">
              <SelectValue placeholder="Situação" />
            </SelectTrigger>
            <SelectContent>
              {SITUACOES.map((o) => (
                <SelectItem key={o.value} value={o.value || '__all__'}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dependenciaFiltro || '__all__'} onValueChange={(v) => setDependenciaFiltro(v === '__all__' ? '' : v)}>
            <SelectTrigger className="w-auto min-w-[200px] h-9">
              <SelectValue placeholder="Dependência" />
            </SelectTrigger>
            <SelectContent>
              {DEPENDENCIAS.map((o) => (
                <SelectItem key={o.value} value={o.value || '__all__'}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={localizacaoFiltro || '__all__'} onValueChange={(v) => setLocalizacaoFiltro(v === '__all__' ? '' : v)}>
            <SelectTrigger className="w-auto min-w-[170px] h-9">
              <SelectValue placeholder="Localização" />
            </SelectTrigger>
            <SelectContent>
              {LOCALIZACOES.map((o) => (
                <SelectItem key={o.value} value={o.value || '__all__'}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterBar>
      </PageSection>

      {loading ? (
        <Card className="shadow-sm">
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="shadow-sm">
          {filtrosAtivos ? (
            <EmptyState
              icon={SchoolIcon}
              title="Nenhum resultado para os filtros aplicados"
              description="Tente ajustar a busca ou os filtros para encontrar unidades escolares."
              action={
                <Button variant="outline" onClick={limparFiltros}>
                  Limpar filtros
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={SchoolIcon}
              title="Nenhuma escola cadastrada"
              description="Comece cadastrando sua primeira unidade escolar para utilizar o sistema de gestão."
              action={
                podeCriar ? (
                  <Button asChild>
                    <Link href="/escolas/novo">
                      <Plus className="mr-2 h-4 w-4" />
                      Cadastrar Primeira Escola
                    </Link>
                  </Button>
                ) : undefined
              }
            />
          )}
        </Card>
      ) : (
        <PageSection variant="flush" title={`${filtered.length} unidade(s) escolar(es)`}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
            {paginated.map((school) => (
              <Card
                key={school.id}
                className="flex flex-col cursor-pointer hover:shadow-md transition-all border-border hover:border-primary/30"
                onClick={() => router.push(`/escolas/${school.id}`)}
              >
                <CardContent className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
                        <SchoolIcon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-[16px] font-semibold text-foreground leading-snug line-clamp-2">
                        {school.nome_escola}
                      </h3>
                    </div>
                    <StatusBadge
                      status={school.situacao_funcionamento === '1' ? 'success' : 'muted'}
                      className="shrink-0"
                    >
                      {situacaoFuncionamento[school.situacao_funcionamento as keyof typeof situacaoFuncionamento] || school.situacao_funcionamento}
                    </StatusBadge>
                  </div>

                  <div className="space-y-2.5 text-[13px] text-muted-foreground border-t border-border pt-4">
                    {school.codigo_inep && (
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 shrink-0 text-primary/70" />
                        <span className="font-medium text-foreground">INEP:</span>
                        <span className="tabular-nums">{school.codigo_inep}</span>
                      </div>
                    )}
                    {school.telefone_1 && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0 text-primary/70" />
                        <span className="text-foreground/90 font-medium">Telefone 1:</span>
                        <span className="tabular-nums">{formatTelefone(school.ddd, school.telefone_1)}</span>
                      </div>
                    )}
                    {school.telefone_2 && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0 text-primary/70" />
                        <span className="text-foreground/90 font-medium">Telefone 2:</span>
                        <span className="tabular-nums">{formatTelefone(school.ddd, school.telefone_2)}</span>
                      </div>
                    )}
                    {school.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 shrink-0 text-primary/70" />
                        <span className="truncate">{school.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-4">
                    <Button variant="default" size="sm" className="w-full h-10 text-[13px]">
                      Visualizar Escola
                      <ChevronRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-border">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filtered.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </PageSection>
      )}

      <PageSection
        title="Censo INEP 2026"
        description="Estes dados serão enviados ao Censo INEP 2026 (Registro 00)"
        variant="compact"
        className="mt-8"
        actions={
          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
            <SchoolIcon className="w-5 h-5 text-primary" />
          </div>
        }
      >
        {' '}
      </PageSection>
    </PageContainer>
  )
}