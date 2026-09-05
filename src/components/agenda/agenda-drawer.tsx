'use client'

import { useState, useEffect, useCallback } from 'react'
import { Calendar, Plus, Loader2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/providers/auth-provider'
import { getPessoaPorEmail } from '@/lib/actions/people'
import { AgendaFiltros } from '@/components/agenda/agenda-filtros'
import { AgendaLista } from '@/components/agenda/agenda-lista'
import { AgendaModalNovo } from '@/components/agenda/agenda-modal-novo'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import {
  listarCompromissos,
  criarCompromisso,
  excluirCompromisso,
  type Compromisso,
  type CompromissoInput,
} from '@/lib/actions/agenda'
import { toast } from 'sonner'

type FiltroPeriodo = 'hoje' | 'semana' | 'mes'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AgendaDrawer({ open, onOpenChange }: Props) {
  const { user, schoolId } = useAuth()
  const [pessoaId, setPessoaId] = useState<string | null>(null)
  const [loadingPessoa, setLoadingPessoa] = useState(true)

  const mesInicial = String(new Date().getMonth() + 1)
  const [mes, setMes] = useState(mesInicial)
  const [filtro, setFiltro] = useState<FiltroPeriodo>('mes')
  const [compromissos, setCompromissos] = useState<Record<string, Compromisso[]>>({})
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !user) return

    setLoadingPessoa(true)
    const email = user.email
    if (!email || !schoolId) {
      setLoadingPessoa(false)
      return
    }

    getPessoaPorEmail(email, schoolId)
      .then((p) => {
        setPessoaId(p?.id || null)
        setLoadingPessoa(false)
      })
      .catch(() => {
        setPessoaId(null)
        setLoadingPessoa(false)
      })
  }, [open, user, schoolId])

  const carregar = useCallback(async () => {
    if (!pessoaId || !schoolId || !mes) return
    setLoading(true)
    const ano = new Date().getFullYear()
    const data = await listarCompromissos(schoolId, pessoaId, Number(mes), ano, filtro)
    setCompromissos(data)
    setLoading(false)
  }, [pessoaId, schoolId, mes, filtro])

  useEffect(() => {
    if (open && pessoaId) carregar()
  }, [open, pessoaId, carregar])

  const handleCriar = async (input: CompromissoInput) => {
    if (!schoolId || !pessoaId) return { error: 'Usuário não autenticado' }
    return await criarCompromisso(schoolId, pessoaId, input)
  }

  const handleSalvo = () => {
    carregar()
  }

  const handleExcluir = async () => {
    if (!deleteId || !pessoaId) return
    const result = await excluirCompromisso(deleteId, pessoaId)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success('Compromisso excluído com sucesso')
    setDeleteId(null)
    carregar()
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="flex flex-col p-0 gap-0">
          <SheetHeader className="shrink-0 border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <SheetTitle className="text-[16px] font-semibold">Minha Agenda</SheetTitle>
            </div>
            <SheetDescription className="text-[13px] text-muted-foreground">
              Gerencie seus compromissos pessoais
            </SheetDescription>
          </SheetHeader>

          <div className="shrink-0 px-4 py-3 border-b border-border">
            <AgendaFiltros
              mes={mes}
              onMesChange={setMes}
              filtro={filtro}
              onFiltroChange={setFiltro}
            />
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {loadingPessoa || loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <AgendaLista
                compromissos={compromissos}
                onDelete={(id) => setDeleteId(id)}
              />
            )}
          </div>

          <div className="shrink-0 border-t border-border px-4 py-3">
            <Button
              className="w-full min-h-[44px] gap-2"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Adicionar Novo Compromisso
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <AgendaModalNovo
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={async (input) => {
          const result = await handleCriar(input)
          if ('data' in result && result.data) handleSalvo()
          return result
        }}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => { if (!v) setDeleteId(null) }}
        title="Excluir compromisso"
        description="Tem certeza que deseja excluir este compromisso?"
        confirmLabel="Excluir"
        variant="destructive"
        onConfirm={handleExcluir}
      />
    </>
  )
}
