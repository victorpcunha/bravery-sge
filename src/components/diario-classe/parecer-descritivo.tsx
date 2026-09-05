'use client'

import { useState, useEffect, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import {
  salvarParecer,
  listarPareceresDaTurma,
  type ParecerDescritivo,
} from '@/lib/actions/pareceres'
import { type AlunoMatriculado } from '@/lib/actions/diario-classe'
import { isParecerVazio } from '@/lib/parecer-utils'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  Check,
  Circle,
  Save,
  FileText,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type DisciplinaItem = {
  id: string
  matriz_disciplina_id: string
  disciplina_id: string
  nome: string
  nome_abreviado: string
}

type Props = {
  turmaId: string
  alunos: AlunoMatriculado[]
  disciplinas: DisciplinaItem[]
  quantidadePeriodosParecer: number
  registroGeral: boolean
  readOnly?: boolean
}

type StatusParecer = 'preenchido' | 'vazio'

const statusUi: Record<
  StatusParecer,
  {
    label: string
    textClass: string
    pillClass: string
    icon: typeof Check
  }
> = {
  preenchido: {
    label: 'Preenchido',
    textClass: 'text-success',
    pillClass: 'border-success/40 bg-success/10 text-success',
    icon: Check,
  },
  vazio: {
    label: 'Vazio',
    textClass: 'text-muted-foreground',
    pillClass: 'border-border bg-muted text-muted-foreground',
    icon: Circle,
  },
}

function formatarDataHora(iso?: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function ToolbarBtn({
  icon: Icon,
  label,
  active,
  disabled,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40',
        active && 'bg-primary/10 text-primary'
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}

function ParecerEditor({
  salvo,
  podeEditar,
  salvando,
  onSalvar,
}: {
  salvo: ParecerDescritivo | undefined
  podeEditar: boolean
  salvando: boolean
  onSalvar: (texto: string) => void
}) {
  const [texto, setTexto] = useState(salvo?.texto_parecer || '')

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: 'Digite o parecer descritivo para este período...',
      }),
    ],
    content: salvo?.texto_parecer || '',
    editable: podeEditar,
    editorProps: {
      attributes: {
        class: 'min-h-[150px] px-3 py-2.5 text-[15px] leading-relaxed outline-none',
      },
    },
    onUpdate: ({ editor }) => setTexto(editor.getHTML()),
  })

  useEffect(() => {
    editor?.setEditable(podeEditar)
  }, [editor, podeEditar])

  const charCount = editor ? editor.getText().length : texto.replace(/<[^>]*>/g, '').length

  if (!editor) {
    return (
      <div className="space-y-3">
        <div className="overflow-hidden rounded-md border border-border bg-muted">
          <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/60 px-1 py-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="h-8 w-8 animate-pulse rounded-sm bg-muted" />
            ))}
          </div>
          <div className="min-h-[150px] animate-pulse px-3 py-2.5" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
          <span className="h-4 w-44 animate-pulse rounded bg-muted" />
          <span className="h-9 w-32 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-md border border-border bg-muted transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/40">
        <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/60 px-1 py-1">
          <ToolbarBtn
            icon={Bold}
            label="Negrito"
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <ToolbarBtn
            icon={Italic}
            label="Itálico"
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <ToolbarBtn
            icon={UnderlineIcon}
            label="Sublinhado"
            active={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          />
          <span className="mx-1 h-4 w-px bg-border" />
          <ToolbarBtn
            icon={List}
            label="Lista com marcadores"
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
          <ToolbarBtn
            icon={ListOrdered}
            label="Lista numerada"
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />
          <span className="mx-1 h-4 w-px bg-border" />
          <ToolbarBtn
            icon={Undo2}
            label="Desfazer"
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          />
          <ToolbarBtn
            icon={Redo2}
            label="Refazer"
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          />
          <span className="ml-auto px-2 text-[11px] tabular-nums text-muted-foreground">
            {charCount} caracteres
          </span>
        </div>
        <EditorContent editor={editor} className={cn(!podeEditar && 'cursor-not-allowed')} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
        <span className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {salvo?.updated_at
            ? `Salvo em ${formatarDataHora(salvo.updated_at)}`
            : 'Nunca salvo'}
        </span>
        <Button size="sm" onClick={() => onSalvar(texto)} disabled={salvando} className="h-9">
          <Save className="mr-1.5 h-3.5 w-3.5" />
          {salvando ? 'Salvando...' : 'Salvar Parecer'}
        </Button>
      </div>
    </div>
  )
}

export default function ParecerDescritivo({
  turmaId,
  alunos,
  disciplinas,
  quantidadePeriodosParecer,
  registroGeral,
  readOnly = false,
}: Props) {
  const { schoolId } = useAuth()
  const { pessoaId, pode } = usePermissoes(schoolId || '')
  const podeEditar = readOnly ? false : pode.editar('gestao-pedagogica.diario-classe.parecer')

  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<string>('')
  const [periodoAtivo, setPeriodoAtivo] = useState(1)
  const [alunoExpandido, setAlunoExpandido] = useState<string>('')
  const [pareceres, setPareceres] = useState<ParecerDescritivo[]>([])
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState<string | null>(null)

  const disciplinaId = registroGeral ? null : (disciplinaSelecionada || null)

  const alunosVisiveis = alunos.filter(a => !a.data_saida)
  const periodos = Array.from({ length: quantidadePeriodosParecer || 4 }, (_, i) => i + 1)

  const getParecer = (alunoId: string, periodo: number) => {
    return pareceres.find(
      p =>
        p.aluno_id === alunoId &&
        p.periodo === periodo &&
        (p.disciplina_id ?? null) === disciplinaId
    )
  }

  const getStatus = (alunoId: string, periodo: number): StatusParecer => {
    const texto = getParecer(alunoId, periodo)?.texto_parecer || ''
    return isParecerVazio(texto) ? 'vazio' : 'preenchido'
  }

  const statusGlobalPeriodo = (periodo: number): 'verde' | 'amarelo' | 'cinza' => {
    const total = alunosVisiveis.length
    if (total === 0) return 'cinza'
    let preenchidos = 0
    for (const a of alunosVisiveis) {
      if (getStatus(a.id, periodo) === 'preenchido') preenchidos++
    }
    if (preenchidos === total) return 'verde'
    if (preenchidos > 0) return 'amarelo'
    return 'cinza'
  }

  const carregar = useCallback(async () => {
    if (!registroGeral && !disciplinaId) {
      setPareceres([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const lista = await listarPareceresDaTurma(turmaId, pessoaId, disciplinaId)
      setPareceres(lista)
    } catch {
      toast.error('Erro ao carregar pareceres')
    } finally {
      setLoading(false)
    }
  }, [turmaId, pessoaId, disciplinaId, registroGeral])

  useEffect(() => {
    carregar()
  }, [carregar])

  const handlePillClick = (
    e: React.MouseEvent<HTMLSpanElement>,
    alunoId: string,
    periodo: number
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setPeriodoAtivo(periodo)
    setAlunoExpandido(alunoId)
  }

  const handlePillKeyDown = (
    e: React.KeyboardEvent<HTMLSpanElement>,
    alunoId: string,
    periodo: number
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.stopPropagation()
      setPeriodoAtivo(periodo)
      setAlunoExpandido(alunoId)
    }
  }

  const handleSalvar = async (alunoId: string, texto: string) => {
    const periodo = periodoAtivo
    setSalvando(alunoId)
    try {
      const res = await salvarParecer(schoolId, alunoId, periodo, texto, pessoaId, disciplinaId, turmaId)
      setPareceres(prev => {
        const idx = prev.findIndex(
          p =>
            p.aluno_id === alunoId &&
            p.periodo === periodo &&
            (p.disciplina_id ?? null) === disciplinaId
        )
        const novo: ParecerDescritivo = {
          id: idx >= 0 ? prev[idx].id : '',
          aluno_id: alunoId,
          disciplina_id: disciplinaId,
          periodo,
          texto_parecer: texto,
          updated_at: res.updated_at,
        }
        const next = [...prev]
        if (idx >= 0) next[idx] = novo
        else next.push(novo)
        return next
      })
      toast.success('Parecer salvo')
    } catch {
      toast.error('Erro ao salvar parecer')
    } finally {
      setSalvando(null)
    }
  }

  let statsPreenchidos = 0
  let statsVazios = 0
  alunosVisiveis.forEach(a => {
    if (getStatus(a.id, periodoAtivo) === 'preenchido') statsPreenchidos++
    else statsVazios++
  })
  const statsTotal = alunosVisiveis.length
  const statsPct = statsTotal > 0 ? Math.round((statsPreenchidos / statsTotal) * 100) : 0

  if (loading) {
    return (
      <div className="py-8 text-center text-muted-foreground">Carregando pareceres...</div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 px-1 pt-2">
        {!registroGeral && (
          <div>
            <Select
              value={disciplinaSelecionada}
              onValueChange={v => {
                setDisciplinaSelecionada(v)
                setAlunoExpandido('')
              }}
            >
              <SelectTrigger className="min-w-[220px]">
                <SelectValue placeholder="Selecione uma disciplina" />
              </SelectTrigger>
              <SelectContent>
                {disciplinas.map(d => (
                  <SelectItem key={d.matriz_disciplina_id} value={d.matriz_disciplina_id}>
                    {d.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {(registroGeral || disciplinaSelecionada) && (
          <div className="inline-flex flex-wrap items-center gap-1 rounded-md border border-border bg-muted p-1">
            {periodos.map(p => {
              const dot = statusGlobalPeriodo(p)
              const ativo = periodoAtivo === p
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriodoAtivo(p)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-[13px] font-semibold transition-all',
                    ativo
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full transition-colors',
                      dot === 'verde' && 'bg-success',
                      dot === 'amarelo' && 'bg-warning',
                      dot === 'cinza' && 'bg-muted-foreground/40',
                      ativo && 'ring-1 ring-white/60'
                    )}
                  />
                  {p}º Bimestre
                </button>
              )
            })}
          </div>
        )}
      </div>

      {!registroGeral && !disciplinaSelecionada ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-[15px] text-muted-foreground">
          Selecione uma disciplina para começar.
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-border bg-card p-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-[14px] font-semibold text-foreground">
                  {periodoAtivo}º Bimestre
                </span>
              </div>
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[12px] font-semibold text-success">
                  <Check className="h-3 w-3" />
                  {statsPreenchidos} Preenchidos
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[12px] font-semibold text-muted-foreground">
                  <Circle className="h-3 w-3" />
                  {statsVazios} Vazios
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Progress
                value={statsPct}
                className={cn(
                  'h-2',
                  statsPct === 100 && '[&_[data-slot=progress-indicator]]:bg-success'
                )}
              />
              <span className="min-w-[2.5rem] text-right text-[13px] font-bold tabular-nums text-foreground">
                {statsPct}%
              </span>
            </div>
          </div>

          <Accordion
            type="single"
            collapsible
            value={alunoExpandido}
            onValueChange={setAlunoExpandido}
            className="w-full"
          >
            {alunosVisiveis.map(aluno => {
              const status = getStatus(aluno.id, periodoAtivo)
              const meta = statusUi[status]
              const StatusIcon = meta.icon
              const salvo = getParecer(aluno.id, periodoAtivo)
              const aberto = alunoExpandido === aluno.id

              return (
                <AccordionItem
                  key={aluno.id}
                  value={aluno.id}
                  className={cn(
                    'mb-2 overflow-hidden rounded-lg border bg-card shadow-xs transition-all duration-200',
                    aberto ? 'border-primary/40 shadow-md' : 'border-border'
                  )}
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3 pr-2">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="truncate text-[14px] font-semibold text-foreground">
                          {aluno.nome_completo}
                        </span>
                        <div className="flex items-center gap-1">
                          {periodos.map(p => {
                            const s = getStatus(aluno.id, p)
                            const ui = statusUi[s]
                            const ativoP = periodoAtivo === p
                            return (
                              <span
                                key={p}
                                role="button"
                                tabIndex={0}
                                onClick={e => handlePillClick(e, aluno.id, p)}
                                onKeyDown={e => handlePillKeyDown(e, aluno.id, p)}
                                title={`${p}º Bimestre: ${ui.label}`}
                                className={cn(
                                  'inline-flex select-none items-center rounded-full border px-1.5 py-0.5 text-[10px] font-bold leading-none transition-all cursor-pointer',
                                  ui.pillClass,
                                  ativoP
                                    ? 'scale-105 border-2 shadow-sm'
                                    : 'border opacity-90 hover:opacity-100'
                                )}
                              >
                                {p}º
                              </span>
                            )
                          })}
                        </div>
                      </div>
                      <span
                        className={cn(
                          'inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold',
                          meta.textClass
                        )}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {meta.label}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <ParecerEditor
                      key={`${aluno.id}|${periodoAtivo}|${disciplinaId || 'geral'}`}
                      salvo={salvo}
                      podeEditar={podeEditar}
                      salvando={salvando === aluno.id}
                      onSalvar={texto => handleSalvar(aluno.id, texto)}
                    />
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>

          {alunosVisiveis.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              Nenhum aluno matriculado nesta turma.
            </div>
          )}
        </>
      )}
    </div>
  )
}
