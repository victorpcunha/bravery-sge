'use client'

import { useState, useEffect, useRef } from 'react'
import { buscarPessoasMatriculadas, type PessoaResumida } from '@/lib/actions/painel-pessoa'
import { Input } from '@/components/ui/input'
import { Loader2, Search, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  schoolId: string
  pessoaLogadaId: string | null
  onSelect: (pessoa: PessoaResumida) => void
  selectedId?: string
}

export default function FiltroPessoa({ schoolId, pessoaLogadaId, onSelect, selectedId }: Props) {
  const [termo, setTermo] = useState('')
  const [resultados, setResultados] = useState<PessoaResumida[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

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
        setOpen(true)
      } catch (err) {
        setResultados([])
        setErro(err instanceof Error ? err.message : 'Erro ao buscar alunos')
        setOpen(true)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [termo, schoolId, pessoaLogadaId])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={termo}
          onChange={e => setTermo(e.target.value)}
          onFocus={() => resultados.length > 0 && setOpen(true)}
          placeholder="Buscar por nome ou CPF..."
          className="pl-9 pr-9"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
        {!loading && resultados.length > 0 && (
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
      </div>

      {open && resultados.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {resultados.map(p => (
            <button
              key={p.id}
              type="button"
              className={cn(
                "w-full text-left px-3 py-2.5 text-sm hover:bg-accent transition-colors border-b last:border-b-0 border-border/50",
                selectedId === p.id && "bg-accent font-medium"
              )}
              onClick={() => {
                onSelect(p)
                setTermo(p.nome_completo)
                setOpen(false)
              }}
            >
              <span className="block font-medium">{p.nome_completo}</span>
              {p.cpf && <span className="block text-xs text-muted-foreground mt-0.5">CPF: {p.cpf}</span>}
            </button>
          ))}
        </div>
      )}

      {open && !loading && termo.length >= 3 && resultados.length === 0 && !erro && (
        <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-lg shadow-lg p-4 text-center text-sm text-muted-foreground">
          Nenhum aluno encontrado com matrícula ativa.
        </div>
      )}

      {open && !loading && erro && (
        <div className="absolute z-50 mt-1 w-full bg-popover border border-red-200 rounded-lg shadow-lg p-4 text-center text-sm text-red-600">
          {erro}
        </div>
      )}
    </div>
  )
}
