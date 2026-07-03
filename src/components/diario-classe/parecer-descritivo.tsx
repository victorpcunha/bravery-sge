'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import {
  salvarParecer,
  listarPareceresDaTurma,
  type ParecerDescritivo,
} from '@/lib/actions/pareceres'
import { type AlunoMatriculado } from '@/lib/actions/diario-classe'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { FileText, Save, Check, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type Props = {
  turmaId: string
  alunos: AlunoMatriculado[]
  quantidadePeriodosParecer: number
}

export default function ParecerDescritivo({ turmaId, alunos, quantidadePeriodosParecer }: Props) {
  const { user, schoolId } = useAuth()
  const [pareceres, setPareceres] = useState<ParecerDescritivo[]>([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState<{ alunoId: string; periodo: number } | null>(null)
  const [textoEditando, setTextoEditando] = useState('')
  const [salvando, setSalvando] = useState(false)

  const { pessoaId, pode } = usePermissoes(schoolId || '')

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const lista = await listarPareceresDaTurma(turmaId, pessoaId)
      setPareceres(lista)
    } catch {
      toast.error('Erro ao carregar pareceres')
    } finally {
      setLoading(false)
    }
  }, [turmaId, pessoaId])

  useEffect(() => {
    carregar()
  }, [carregar])

  const getParecer = (alunoId: string, periodo: number) => {
    return pareceres.find(p => p.aluno_id === alunoId && p.periodo === periodo)
  }

  const handleAbrirEditor = (alunoId: string, periodo: number) => {
    const parecer = getParecer(alunoId, periodo)
    setTextoEditando(parecer?.texto_parecer || '')
    setEditando({ alunoId, periodo })
  }

  const handleSalvar = async () => {
    if (!editando) return
    setSalvando(true)
    try {
      await salvarParecer(schoolId, editando.alunoId, editando.periodo, textoEditando, pessoaId)
      toast.success('Parecer salvo')
      setPareceres(prev => {
        const idx = prev.findIndex(
          p => p.aluno_id === editando.alunoId && p.periodo === editando.periodo
        )
        const next = [...prev]
        if (idx >= 0) {
          next[idx] = { ...next[idx], texto_parecer: textoEditando }
        } else {
          next.push({
            id: '',
            aluno_id: editando.alunoId,
            periodo: editando.periodo,
            texto_parecer: textoEditando,
          })
        }
        return next
      })
      setEditando(null)
      setTextoEditando('')
    } catch {
      toast.error('Erro ao salvar parecer')
    } finally {
      setSalvando(false)
    }
  }

  const podeEditar = pode.editar('gestao-pedagogica.diario-classe.parecer')

  const periodos = Array.from({ length: quantidadePeriodosParecer || 4 }, (_, i) => i + 1)

  if (loading) {
    return (
      <div className="py-8 text-center text-muted-foreground">Carregando pareceres...</div>
    )
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {alunos.map((aluno, idx) => (
        <AccordionItem key={aluno.id} value={aluno.id}>
          <AccordionTrigger className="px-3 hover:no-underline hover:bg-muted/20 rounded-md">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{aluno.nome_completo}</span>
              <div className="flex gap-1">
                {periodos.map(periodo => {
                  const parecer = getParecer(aluno.id, periodo)
                  const preenchido = !!parecer?.texto_parecer?.trim()
                  return (
                    <Badge
                      key={periodo}
                      variant={preenchido ? 'default' : 'outline'}
                      className={cn(
                        'text-[10px] px-1.5 py-0 h-4',
                        preenchido
                          ? 'bg-success/10 text-success hover:bg-success/20'
                          : 'text-muted-foreground/50'
                      )}
                    >
                      {preenchido ? <Check className="h-2.5 w-2.5 mr-0.5" /> : <Clock className="h-2.5 w-2.5 mr-0.5" />}
                      P{periodo}
                    </Badge>
                  )
                })}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-3 space-y-3">
              {periodos.map(periodo => {
                const parecer = getParecer(aluno.id, periodo)
                const isEditing = editando?.alunoId === aluno.id && editando?.periodo === periodo

                return (
                  <div
                    key={periodo}
                    className={cn(
                      "rounded-lg border border-border p-3",
                      isEditing && "border-primary/40 ring-1 ring-primary/20"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-foreground">
                        {periodo}º Período
                      </h4>
                      {!isEditing && podeEditar && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAbrirEditor(aluno.id, periodo)}
                        >
                          <FileText className="h-3.5 w-3.5 mr-1" />
                          {parecer?.texto_parecer?.trim() ? 'Editar' : 'Escrever'}
                        </Button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <Textarea
                          value={textoEditando}
                          onChange={e => setTextoEditando(e.target.value)}
                          placeholder="Digite o parecer descritivo para este período..."
                          className="min-h-[120px] resize-y"
                          autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditando(null)
                              setTextoEditando('')
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSalvar}
                            disabled={salvando}
                          >
                            <Save className="h-3.5 w-3.5 mr-1" />
                            {salvando ? 'Salvando...' : 'Salvar'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {parecer?.texto_parecer?.trim() ? (
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {parecer.texto_parecer}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground/40 italic">
                            Nenhum parecer registrado para este período.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}

      {alunos.length === 0 && (
        <div className="py-8 text-center text-muted-foreground">
          Nenhum aluno matriculado nesta turma.
        </div>
      )}
    </Accordion>
  )
}
