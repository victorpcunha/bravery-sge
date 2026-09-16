'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ClickablePill } from '@/components/ui/clickable-pill'
import { MatrizPermissoes } from './matriz-permissoes'
import type { Perfil, RecursoComPermissao } from '@/lib/actions/perfis'
import { FormCard } from '@/components/layout/form-card'

type PerfilFormProps = {
  perfil?: Perfil | null
  recursos: RecursoComPermissao[]
  onSave: (data: { nome: string; descricao: string; ativo: boolean; usa_vinculo_turma: boolean; permissoes: { recurso_id: string; visualizar: boolean; criar: boolean; editar: boolean; excluir: boolean }[] }) => void
  onCancel: () => void
  saving: boolean
}

export function PerfilForm({ perfil, recursos, onSave, onCancel, saving }: PerfilFormProps) {
  const [nome, setNome] = useState(perfil?.nome || '')
  const [descricao, setDescricao] = useState(perfil?.descricao || '')
  const [ativo, setAtivo] = useState(perfil?.ativo ?? true)
  const [usaVinculoTurma, setUsaVinculoTurma] = useState(perfil?.usa_vinculo_turma ?? false)

  const initialPerms = (rid: string) => {
    const r = recursos.find(r => r.id === rid)
    return r?.permissao || { visualizar: false, criar: false, editar: false, excluir: false }
  }

  const [permissoes, setPermissoes] = useState<Record<string, { visualizar: boolean; criar: boolean; editar: boolean; excluir: boolean }>>(
    Object.fromEntries(recursos.map(r => [r.id, initialPerms(r.id)]))
  )

  const handlePermChange = (recursoId: string, acao: 'visualizar' | 'criar' | 'editar' | 'excluir', value: boolean) => {
    setPermissoes(prev => {
      const current = prev[recursoId] || { visualizar: false, criar: false, editar: false, excluir: false }

      if (acao === 'visualizar' && !value) {
        return {
          ...prev,
          [recursoId]: { visualizar: false, criar: false, editar: false, excluir: false },
        }
      }

      if (acao !== 'visualizar' && value && !current.visualizar) {
        return {
          ...prev,
          [recursoId]: { ...current, [acao]: value, visualizar: true },
        }
      }

      return {
        ...prev,
        [recursoId]: { ...current, [acao]: value },
      }
    })
  }

  const handleSubmit = () => {
    if (!nome.trim()) return
    onSave({
      nome: nome.trim(),
      descricao,
      ativo,
      usa_vinculo_turma: usaVinculoTurma,
      permissoes: Object.entries(permissoes).map(([recursoId, perms]) => ({
        recurso_id: recursoId,
        ...perms,
      })),
    })
  }

  return (
    <>
      <div className="space-y-6 py-4">
        <FormCard title="Identificação">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="w-full space-y-2 sm:w-1/2">
              <Label htmlFor="perfil-nome">Nome do Perfil *</Label>
              <Input
                id="perfil-nome"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Ex: Professor, Coordenação, Secretaria"
                className="border-border"
                aria-required="true"
              />
            </div>
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <ClickablePill
                label="Perfil Ativo"
                active={ativo}
                onClick={() => setAtivo(!ativo)}
              />
              <ClickablePill
                label="Perfil com Vínculo em Turma (Professor)"
                active={usaVinculoTurma}
                onClick={() => setUsaVinculoTurma(!usaVinculoTurma)}
                title="Este perfil terá acesso apenas às turmas em que o profissional estiver vinculado"
              />
            </div>
          </div>
          {!ativo && (
            <p role="alert" className="text-[13px] text-warning">
              Perfis inativos não podem ser vinculados a usuários.
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="perfil-descricao">Descrição</Label>
            <Textarea
              id="perfil-descricao"
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              placeholder="Descreva a finalidade e escopo deste perfil..."
              className="border-border min-h-[80px]"
            />
          </div>
          {usaVinculoTurma ? (
            <p className="text-[13px] text-muted-foreground">
              Este perfil terá acesso apenas às turmas em que o profissional estiver vinculado.
            </p>
          ) : (
            <p className="text-[13px] text-muted-foreground">
              Acesso administrativo global a todas as turmas da escola.
            </p>
          )}
        </FormCard>

        <Separator />

        <FormCard title="Permissões de Acesso" description="Configure as permissões por recurso. &quot;Visualizar&quot; é obrigatório para habilitar as demais ações.">
          <MatrizPermissoes
            recursos={recursos.map(r => ({
              ...r,
              permissao: permissoes[r.id] || null,
            }))}
            onChange={handlePermChange}
          />
        </FormCard>
      </div>

      <div className="sticky bottom-0 z-20 -mx-4 sm:-mx-6 mt-6 flex flex-col-reverse gap-2 border-t border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="min-h-[40px] sm:min-h-[44px]"
        >
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!nome.trim() || saving}
          className="min-h-[40px] sm:min-h-[44px]"
        >
          {saving ? 'Salvando...' : perfil ? 'Atualizar Perfil' : 'Criar Perfil'}
        </Button>
      </div>
    </>
  )
}