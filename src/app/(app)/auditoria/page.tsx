'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ScrollText, ShieldAlert, ChevronDown, ChevronRight, Search, FilterX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { SearchInput } from '@/components/layout/search-input'
import { EmptyState } from '@/components/ui/empty-state'
import { Pagination } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { useAuth } from '@/components/providers/auth-provider'
import { toast } from 'sonner'
import {
  listarAuditoria,
  listarModulosAuditoria,
  listarProfissionaisAuditoria,
  type LinhaAuditoria,
} from '@/lib/actions/auditoria'
import { DetalhesAuditoria, badgeTipoAcao } from '@/components/auditoria/detalhes-auditoria'

const ITEMS_PER_PAGE = 10

const TIPOS_ACAO = [
  { value: '', label: 'Todas as ações' },
  { value: 'criar', label: 'Criação' },
  { value: 'editar', label: 'Edição' },
  { value: 'excluir', label: 'Exclusão' },
] as const

function formatarDataHora(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  const dia = String(d.getDate()).padStart(2, '0')
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const ano = d.getFullYear()
  const hora = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${dia}/${mes}/${ano} ${hora}:${min}`
}

export default function AuditoriaPage() {
  const { user, loading: authLoading, isSuperAdmin, allSchools, pessoaId } = useAuth()
  const router = useRouter()

  const [rows, setRows] = useState<LinhaAuditoria[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [pagina, setPagina] = useState(1)
  const [modulos, setModulos] = useState<string[]>([])
  const [profissionais, setProfissionais] = useState<{ id: string; nome_completo: string }[]>([])

  const [busca, setBusca] = useState('')
  const [escolaId, setEscolaId] = useState('')
  const [profissionalId, setProfissionalId] = useState('')
  const [modulo, setModulo] = useState('')
  const [tipoAcao, setTipoAcao] = useState('')
  const [dataInicial, setDataInicial] = useState('')
  const [dataFinal, setDataFinal] = useState('')

  const [expandida, setExpandida] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!isSuperAdmin) return
    listarModulosAuditoria().then(setModulos).catch(() => setModulos([]))
  }, [isSuperAdmin])

  useEffect(() => {
    if (!isSuperAdmin) return
    listarProfissionaisAuditoria(escolaId || null).then(setProfissionais).catch(() => setProfissionais([]))
  }, [isSuperAdmin, escolaId])

  const carregar = useCallback(async (pag: number) => {
    if (!isSuperAdmin) return
    setLoading(true)
    try {
      const resultado = await listarAuditoria(
        {
          buscar: busca || undefined,
          escolaId: escolaId || null,
          pessoaId: profissionalId || null,
          modulo: modulo || null,
          tipoAcao: (tipoAcao as 'criar' | 'editar' | 'excluir' | null) || null,
          dataInicial: dataInicial || null,
          dataFinal: dataFinal || null,
        },
        pag,
        ITEMS_PER_PAGE,
        pessoaId,
      )
      setRows(resultado.rows)
      setTotal(resultado.total)
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao carregar auditoria')
    } finally {
      setLoading(false)
    }
  }, [isSuperAdmin, busca, escolaId, profissionalId, modulo, tipoAcao, dataInicial, dataFinal, pessoaId])

  useEffect(() => {
    if (!isSuperAdmin) return
    setPagina(1)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => carregar(1), 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [busca, escolaId, profissionalId, modulo, tipoAcao, dataInicial, dataFinal, isSuperAdmin, carregar])

  const mudarPagina = (p: number) => {
    setPagina(p)
    carregar(p)
  }

  const limparFiltros = () => {
    setBusca('')
    setEscolaId('')
    setProfissionalId('')
    setModulo('')
    setTipoAcao('')
    setDataInicial('')
    setDataFinal('')
  }

  const filtrosAtivos = busca.trim() !== '' || escolaId !== '' || profissionalId !== '' || modulo !== '' || tipoAcao !== '' || dataInicial !== '' || dataFinal !== ''

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

  if (!isSuperAdmin) {
    return (
      <PageContainer>
        <PageHeader icon={ScrollText} title="Auditoria" description="Consulte o histórico de alterações do sistema" />
        <Card className="shadow-sm">
          <EmptyState
            icon={ShieldAlert}
            title="Sem permissão"
            description="A tela de Auditoria é exclusiva do perfil Superadmin."
          />
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        icon={ScrollText}
        title="Auditoria"
        description="Registro de todas as criações, edições e exclusões realizadas no sistema"
      />

      <PageSection variant="compact" title="Filtros" className="mb-6">
        <div className="space-y-4">
          <div className="flex-1 min-w-[220px]">
            <SearchInput
              value={busca}
              onChange={setBusca}
              placeholder="Buscar por nome ou identificação do registro (ex.: nome do aluno, usuário, turma)..."
            />
            <p className="text-[12px] text-muted-foreground mt-1 flex items-center gap-1">
              <Search className="h-3.5 w-3.5" />
              Busca ampla pelo registro afetado, independentemente do campo ou profissional. Combinável com os demais filtros.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-[12px] font-medium text-muted-foreground mb-1.5">Escola</p>
              <Select value={escolaId || '__all__'} onValueChange={(v) => setEscolaId(v === '__all__' ? '' : v)}>
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Todas as Escolas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Todas as Escolas</SelectItem>
                  {allSchools.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.nome_escola}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-[12px] font-medium text-muted-foreground mb-1.5">Usuário (profissional)</p>
              <Select value={profissionalId || '__all__'} onValueChange={(v) => setProfissionalId(v === '__all__' ? '' : v)}>
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Todos os usuários" />
                </SelectTrigger>
                <SelectContent className="max-h-80 overflow-y-auto">
                  <SelectItem value="__all__">Todos os usuários</SelectItem>
                  {profissionais.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.nome_completo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-[12px] font-medium text-muted-foreground mb-1.5">Módulo / Tela</p>
              <Select value={modulo || '__all__'} onValueChange={(v) => setModulo(v === '__all__' ? '' : v)}>
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Todos os módulos" />
                </SelectTrigger>
                <SelectContent className="max-h-80 overflow-y-auto">
                  <SelectItem value="__all__">Todos os módulos</SelectItem>
                  {modulos.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-[12px] font-medium text-muted-foreground mb-1.5">Tipo de Ação</p>
              <Select value={tipoAcao || '__all__'} onValueChange={(v) => setTipoAcao(v === '__all__' ? '' : v)}>
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Todas as ações" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_ACAO.map((o) => (
                    <SelectItem key={o.value} value={o.value || '__all__'}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-[12px] font-medium text-muted-foreground mb-1.5">Data inicial</p>
              <Input type="date" className="h-9 border-border" value={dataInicial} max={dataFinal || undefined} onChange={(e) => setDataInicial(e.target.value)} />
            </div>

            <div>
              <p className="text-[12px] font-medium text-muted-foreground mb-1.5">Data final</p>
              <Input type="date" className="h-9 border-border" value={dataFinal} min={dataInicial || undefined} onChange={(e) => setDataFinal(e.target.value)} />
            </div>

            <div className="sm:col-span-2 lg:col-span-2 flex items-end">
              {filtrosAtivos && (
                <Button variant="outline" size="sm" onClick={limparFiltros} className="h-9">
                  <FilterX className="mr-2 h-4 w-4" />
                  Limpar filtros
                </Button>
              )}
            </div>
          </div>
        </div>
      </PageSection>

      {loading ? (
        <Card className="shadow-sm">
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </Card>
      ) : rows.length === 0 ? (
        <Card className="shadow-sm">
          {filtrosAtivos ? (
            <EmptyState
              icon={ScrollText}
              title="Nenhum registro para os filtros aplicados"
              description="Tente ajustar a busca ou os filtros para encontrar registros de auditoria."
              action={
                <Button variant="outline" onClick={limparFiltros}>
                  Limpar filtros
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={ScrollText}
              title="Nenhum registro de auditoria"
              description="As alterações realizadas nas telas do sistema aparecerão aqui automaticamente."
            />
          )}
        </Card>
      ) : (
        <PageSection variant="flush" title={`${total} registro(s) de auditoria`}>
          <div className="overflow-x-auto px-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Escola</TableHead>
                  <TableHead>Módulo/Tela</TableHead>
                  <TableHead>Registro afetado</TableHead>
                  <TableHead>Tipo de Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <ExpandedRow key={r.id} registro={r} expandida={expandida} onToggle={() => setExpandida(expandida === r.id ? null : r.id)} />
                ))}
              </TableBody>
            </Table>
          </div>
          {total > ITEMS_PER_PAGE && (
            <div className="px-6 py-4 border-t border-border">
              <Pagination
                currentPage={pagina}
                totalPages={Math.max(1, Math.ceil(total / ITEMS_PER_PAGE))}
                totalItems={total}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={mudarPagina}
              />
            </div>
          )}
        </PageSection>
      )}
    </PageContainer>
  )
}

function ExpandedRow({
  registro,
  expandida,
  onToggle,
}: {
  registro: LinhaAuditoria
  expandida: string | null
  onToggle: () => void
}) {
  const isOpen = expandida === registro.id
  return (
    <>
      <TableRow className="cursor-pointer align-middle" onClick={onToggle}>
        <TableCell>
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </TableCell>
        <TableCell className="whitespace-nowrap tabular-nums text-[13px] text-foreground">
          {formatarDataHora(registro.created_at)}
        </TableCell>
        <TableCell className="text-[13px] text-foreground">
          {registro.people?.nome_completo || '—'}
        </TableCell>
        <TableCell className="text-[13px] text-muted-foreground">
          {registro.schools?.nome_escola || '—'}
        </TableCell>
        <TableCell className="text-[13px] text-foreground">{registro.modulo}</TableCell>
        <TableCell className="text-[13px] text-foreground font-medium max-w-[240px] truncate">
          {registro.registro_nome || '—'}
        </TableCell>
        <TableCell>{badgeTipoAcao(registro.acao)}</TableCell>
      </TableRow>
      {isOpen && (
        <TableRow>
          <TableCell colSpan={7} className="bg-muted/20">
            <DetalhesAuditoria registro={registro} />
          </TableCell>
        </TableRow>
      )}
    </>
  )
}