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
          className="w-full justify-between h-9 font-normal text-[14px]"
        >
          {selecionado ? (
            <span className="truncate">{selecionado.nome_completo}</span>
          ) : (
            <span className="text-muted-foreground">Buscar por nome ou CPF...</span>
          )}
          <Search className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
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
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-medium text-[14px] truncate">{p.nome_completo}</span>
                      {p.cpf && (
                        <span className="text-[13px] text-muted-foreground">
                          CPF: {p.cpf}
                        </span>
                      )}
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
