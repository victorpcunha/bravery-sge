'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Check, Loader2, Pencil, Plus, Search, Trash2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/feedback/status-badge'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import {
  adicionarManager,
  atualizarManager,
  buscarPessoasEscola,
  listarManagers,
  removerManager,
  type ManagerComPessoa,
  type PessoaOpcao,
} from '@/lib/actions/managers'

const CARGO_OPTIONS = [
  { value: '1', label: 'Diretor(a)' },
  { value: '2', label: 'Outro Cargo' },
]

const CRITERIO_OPTIONS = [
  { value: '1', label: 'Ser proprietário(a) ou sócio(a)-proprietário(a)' },
  { value: '2', label: 'Exclusivamente por indicação/escolha da gestão' },
  { value: '3', label: 'Processo seletivo qualificado e escolha/nomeação' },
  { value: '4', label: 'Concurso público específico para gestor escolar' },
  { value: '5', label: 'Exclusivamente por eleição com a comunidade escolar' },
  { value: '6', label: 'Processo seletivo qualificado e eleição' },
  { value: '7', label: 'Outros' },
]

const SITUACAO_OPTIONS = [
  { value: '1', label: 'Concursado/efetivo/estável' },
  { value: '2', label: 'Contrato temporário' },
  { value: '3', label: 'Contrato terceirizado' },
  { value: '4', label: 'Contrato CLT' },
]

function formatarCpf(cpf: string | null | undefined): string {
  if (!cpf) return ''
  const d = cpf.replace(/\D/g, '')
  if (d.length !== 11) return cpf
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

function iniciais(nome: string): string {
  const partes = (nome || '').trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return '?'
  return ((partes[0][0] || '') + (partes.length > 1 ? partes[partes.length - 1][0] : '')).toUpperCase()
}

function cargoLabel(cargo: string | null): string {
  return CARGO_OPTIONS.find((o) => o.value === cargo)?.label || '—'
}

type Props = {
  schoolId: string
  pessoaId?: string | null
  readOnly?: boolean
}

export function GestoresForm({ schoolId, pessoaId = null, readOnly = false }: Props) {
  const [lista, setLista] = useState<ManagerComPessoa[]>([])
  const [carregando, setCarregando] = useState(true)
  const [dialogAberto, setDialogAberto] = useState(false)
  const [editando, setEditando] = useState<ManagerComPessoa | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [excluindo, setExcluindo] = useState<ManagerComPessoa | null>(null)
  const [removendo, setRemovendo] = useState(false)

  // Form do diálogo
  const [pessoa, setPessoa] = useState<PessoaOpcao | null>(null)
  const [cargo, setCargo] = useState('')
  const [criterio, setCriterio] = useState('')
  const [situacao, setSituacao] = useState('')

  // Busca de pessoa
  const [buscaAberta, setBuscaAberta] = useState(false)
  const [termo, setTermo] = useState('')
  const [resultados, setResultados] = useState<PessoaOpcao[]>([])
  const [buscando, setBuscando] = useState(false)

  const recarregar = useCallback(async () => {
    setCarregando(true)
    try {
      setLista(await listarManagers(schoolId))
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao carregar gestores')
    } finally {
      setCarregando(false)
    }
  }, [schoolId])

  useEffect(() => {
    recarregar()
  }, [recarregar])

  useEffect(() => {
    if (termo.trim().length < 3) {
      setResultados([])
      setBuscando(false)
      return
    }
    setBuscando(true)
    const t = setTimeout(() => {
      buscarPessoasEscola(termo.trim(), schoolId)
        .then(setResultados)
        .catch(() => setResultados([]))
        .finally(() => setBuscando(false))
    }, 300)
    return () => clearTimeout(t)
  }, [termo, schoolId])

  const abrirNovo = () => {
    setEditando(null)
    setPessoa(null)
    setCargo('')
    setCriterio('')
    setSituacao('')
    setTermo('')
    setDialogAberto(true)
  }

  const abrirEdicao = (m: ManagerComPessoa) => {
    setEditando(m)
    setPessoa({ id: m.person_id || '', nome_completo: m.nome_completo || '', cpf: m.cpf, inep_id: m.inep_id })
    setCargo(m.cargo || '')
    setCriterio(m.criterio_acesso || '')
    setSituacao(m.situacao_funcional || '')
    setTermo('')
    setDialogAberto(true)
  }

  const salvar = async () => {
    if (!pessoa?.id) {
      toast.error('Selecione a pessoa.')
      return
    }
    if (!cargo) {
      toast.error('Selecione o cargo.')
      return
    }
    setSalvando(true)
    try {
      if (editando) {
        await atualizarManager(schoolId, editando.id, {
          cargo,
          criterio_acesso: criterio || null,
          situacao_funcional: situacao || null,
        }, pessoaId)
        toast.success('Gestor atualizado com sucesso!')
      } else {
        await adicionarManager(schoolId, {
          person_id: pessoa.id,
          cargo,
          criterio_acesso: criterio || null,
          situacao_funcional: situacao || null,
        }, pessoaId)
        toast.success('Gestor adicionado com sucesso!')
      }
      setDialogAberto(false)
      await recarregar()
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao salvar gestor')
    } finally {
      setSalvando(false)
    }
  }

  const confirmarExclusao = async () => {
    if (!excluindo) return
    setRemovendo(true)
    try {
      await removerManager(schoolId, excluindo.id, pessoaId)
      toast.success('Gestor removido com sucesso!')
      setExcluindo(null)
      await recarregar()
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao remover gestor')
    } finally {
      setRemovendo(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle>Gestores da Escola (Registro 40)</CardTitle>
          <p className="text-[13px] text-muted-foreground mt-1">
            Até 3 gestores por escola. Usado na exportação do Censo Escolar.
          </p>
        </div>
        {!readOnly && (
          <Button type="button" size="sm" onClick={abrirNovo} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Gestor
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {carregando ? (
          <div className="space-y-3">
            <div className="h-10 bg-muted rounded-lg animate-pulse" />
            <div className="h-10 bg-muted rounded-lg animate-pulse" />
          </div>
        ) : lista.length === 0 ? (
          <EmptyState
            icon={User}
            title="Nenhum gestor cadastrado"
            description="Cadastre ao menos um gestor — escola em atividade exige o Registro 40 no Censo."
            action={!readOnly ? <Button type="button" onClick={abrirNovo}><Plus className="mr-2 h-4 w-4" />Adicionar Gestor</Button> : undefined}
          />
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {lista.map((m) => (
              <li key={m.id} className="flex items-center gap-3 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[13px] font-bold text-primary">
                  {iniciais(m.nome_completo || '')}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold text-foreground">
                    {m.nome_completo || 'Sem nome'}
                  </p>
                  <p className="text-[13px] text-muted-foreground tabular-nums">
                    {m.cpf ? `CPF ${formatarCpf(m.cpf)}` : 'Sem CPF'}
                    {m.inep_id ? ` · INEP ${m.inep_id}` : ''}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <StatusBadge status="primary">{cargoLabel(m.cargo)}</StatusBadge>
                    {m.criterio_acesso && (
                      <StatusBadge status="muted">Critério {m.criterio_acesso}</StatusBadge>
                    )}
                    {m.situacao_funcional && (
                      <StatusBadge status="muted">Situação {m.situacao_funcional}</StatusBadge>
                    )}
                  </div>
                </div>
                {!readOnly && (
                  <div className="flex shrink-0 gap-1">
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => abrirEdicao(m)} aria-label="Editar gestor" className="min-h-[44px] min-w-[44px]">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => setExcluindo(m)} aria-label="Remover gestor" className="min-h-[44px] min-w-[44px]">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <Dialog open={dialogAberto} onOpenChange={(o) => { if (!o) setDialogAberto(false) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editando ? 'Editar Gestor' : 'Adicionar Gestor'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Pessoa *</Label>
              {editando ? (
                <p className="text-[15px] font-semibold text-foreground">{pessoa?.nome_completo}</p>
              ) : (
                <Popover open={buscaAberta} onOpenChange={setBuscaAberta}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      className="relative w-full h-10 justify-start rounded-md border-border bg-card pl-10 pr-3 text-[14px] font-normal shadow-xs"
                    >
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 shrink-0 text-muted-foreground" />
                      {pessoa ? (
                        <span className="truncate text-foreground">{pessoa.nome_completo}</span>
                      ) : (
                        <span className="truncate text-muted-foreground">Buscar por nome ou CPF...</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput
                        value={termo}
                        onValueChange={setTermo}
                        placeholder="Digite pelo menos 3 caracteres..."
                        className="h-10 text-[14px]"
                      />
                      <CommandList className="max-h-72">
                        {termo.trim().length < 3 ? (
                          <div className="py-6 text-center text-[14px] text-muted-foreground">
                            Digite pelo menos 3 caracteres para buscar.
                          </div>
                        ) : buscando ? (
                          <div className="py-6 text-center text-[14px] text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                            Buscando...
                          </div>
                        ) : resultados.length === 0 ? (
                          <CommandEmpty>Nenhuma pessoa encontrada.</CommandEmpty>
                        ) : (
                          <CommandGroup>
                            {resultados.map((p) => (
                              <CommandItem
                                key={p.id}
                                value={p.nome_completo}
                                onSelect={() => {
                                  setPessoa(p)
                                  setBuscaAberta(false)
                                  setTermo('')
                                }}
                                className="cursor-pointer"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[13px] font-bold text-primary">
                                    {iniciais(p.nome_completo)}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-[15px] font-semibold">{p.nome_completo}</p>
                                    {p.cpf && (
                                      <p className="text-[13px] text-muted-foreground tabular-nums">
                                        CPF {formatarCpf(p.cpf)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {pessoa?.id === p.id && <Check className="h-4 w-4 text-primary shrink-0" />}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            </div>

            <div className="space-y-2">
              <Label>Cargo *</Label>
              <Select value={cargo} onValueChange={setCargo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent>
                  {CARGO_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {cargo === '1' && (
              <>
                <div className="space-y-2">
                  <Label>Critério de acesso ao cargo *</Label>
                  <Select value={criterio} onValueChange={setCriterio}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o critério" />
                    </SelectTrigger>
                    <SelectContent>
                      {CRITERIO_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Situação funcional</Label>
                  <Select value={situacao} onValueChange={setSituacao}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a situação" />
                    </SelectTrigger>
                    <SelectContent>
                      {SITUACAO_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[13px] text-muted-foreground">
                    Obrigatória para diretor em escola pública em atividade (validação do Censo).
                  </p>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogAberto(false)} disabled={salvando}>
              Cancelar
            </Button>
            <Button type="button" onClick={salvar} disabled={salvando}>
              {salvando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editando ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!excluindo}
        onOpenChange={(o) => { if (!o) setExcluindo(null) }}
        title="Remover gestor"
        description={`Remover "${excluindo?.nome_completo}" dos gestores da escola?`}
        confirmLabel="Remover"
        variant="destructive"
        onConfirm={confirmarExclusao}
        loading={removendo}
      />
    </Card>
  )
}
