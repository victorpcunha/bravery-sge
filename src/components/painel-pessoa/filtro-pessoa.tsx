'use client'

import { useEffect, useRef, useState } from 'react'
import { buscarPessoasMatriculadas, type PessoaResumida } from '@/lib/actions/painel-pessoa'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { EmptyState } from '@/components/ui/empty-state'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Search, Loader2, Check, User } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  schoolId: string | null
  pessoaLogadaId: string | null
  onSelect: (pessoa: PessoaResumida) => void
  selectedId?: string
}

function formatarCpf(cpf: string | null | undefined): string {
  if (!cpf) return ''
  const d = cpf.replace(/\D/g, '')
  if (d.length !== 11) return cpf
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return '?'
  const primeira = partes[0][0] || ''
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : ''
  return (primeira + ultima).toUpperCase()
}

export default function FiltroPessoa({ schoolId, pessoaLogadaId, onSelect, selectedId }: Props) {
  const [open, setOpen] = useState(false)
  const [termo, setTermo] = useState('')
  const [resultados, setResultados] = useState<PessoaResumida[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [selecionado, setSelecionado] = useState<PessoaResumida | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (termo.length < 3) {
      setResultados([])
      setErro(null)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      setErro(null)
      try {
        const data = await buscarPessoasMatriculadas(termo, schoolId, pessoaLogadaId)
        setResultados(data)
      } catch (err) {
        setResultados([])
        setErro(err instanceof Error ? err.message : 'Erro ao buscar alunos')
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [termo, schoolId, pessoaLogadaId])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Buscar aluno por nome ou CPF"
          className="relative w-full h-9 justify-start rounded-md border-border bg-card pl-10 pr-3 text-[14px] font-normal shadow-xs hover:bg-card"
        >
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          {selecionado ? (
            <span className="truncate text-foreground">{selecionado.nome_completo}</span>
          ) : (
            <span className="truncate text-muted-foreground">Buscar por nome ou CPF...</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command shouldFilter={false} loop>
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <CommandInput
              ref={inputRef}
              value={termo}
              onValueChange={setTermo}
              placeholder="Digite pelo menos 3 caracteres..."
              className="h-9 border-0 focus:ring-0 text-[14px]"
              autoFocus
            />
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />}
          </div>
          <CommandList className="max-h-72">
            {termo.length < 3 ? (
              <div className="py-6 text-center text-[14px] text-muted-foreground">
                Digite pelo menos 3 caracteres para buscar.
              </div>
            ) : erro ? (
              <div role="alert" className="py-4 px-3 text-center text-[14px] text-destructive">
                {erro}
              </div>
            ) : loading ? (
              <div className="py-6 text-center text-[14px] text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin inline mr-2" aria-hidden="true" />
                Buscando...
              </div>
            ) : resultados.length === 0 ? (
              <CommandEmpty>
                <EmptyState
                  icon={User}
                  title="Nenhum aluno encontrado"
                  description="Não há alunos com matrícula ativa para o termo informado."
                />
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {resultados.map(p => (
                  <CommandItem
                    key={p.id}
                    value={p.nome_completo}
                    onSelect={() => {
                      onSelect(p)
                      setSelecionado(p)
                      setOpen(false)
                      setTermo('')
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[13px] font-bold text-primary">
                        {iniciais(p.nome_completo)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-semibold text-foreground">
                          {p.nome_completo}
                        </p>
                        {p.cpf && (
                          <p className="text-[13px] text-muted-foreground">
                            CPF:{' '}
                            <span className="font-medium text-foreground/80 tabular-nums">
                              {formatarCpf(p.cpf)}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                    {selectedId === p.id && (
                      <Check className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
