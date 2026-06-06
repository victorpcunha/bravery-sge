'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { MatrizPermissoes } from './matriz-permissoes'
import type { Perfil, RecursoComPermissao } from '@/lib/actions/perfis'
import { Shield, GraduationCap } from 'lucide-react'

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
    <div className="space-y-6 py-4">
      {/* Card Identificação */}
      <div className="border border-border rounded-lg p-5 bg-muted/40 space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Identificação
        </h3>
        <div className="space-y-2">
          <Label>Nome do Perfil *</Label>
          <Input
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Ex: Professor, Coordenação, Secretaria"
            className="border-border"
          />
        </div>
        <div className="space-y-2">
          <Label>Descrição</Label>
          <Textarea
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            placeholder="Descreva a finalidade e escopo deste perfil..."
            className="border-border min-h-[80px]"
          />
        </div>
        <div className="flex items-center gap-3">
          <Switch id="ativo" checked={ativo} onCheckedChange={setAtivo} />
          <Label htmlFor="ativo" className="cursor-pointer">
            Perfil {ativo ? 'Ativo' : 'Inativo'}
          </Label>
        </div>
        {!ativo && (
          <p className="text-xs text-warning">
            Perfis inativos não podem ser vinculados a usuários.
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Switch id="usa_vinculo_turma" checked={usaVinculoTurma} onCheckedChange={setUsaVinculoTurma} />
          <Label htmlFor="usa_vinculo_turma" className="cursor-pointer flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span>Perfil com vínculo em turma (professor)</span>
          </Label>
        </div>
        {usaVinculoTurma && (
          <p className="text-xs text-muted-foreground">
            Este perfil terá acesso apenas às turmas vinculadas em <code>turmas_profissionais</code>.
          </p>
        )}
        {!usaVinculoTurma && (
          <p className="text-xs text-muted-foreground">
            Acesso administrativo global a todas as turmas da escola.
          </p>
        )}
      </div>

      <Separator />

      {/* Card Permissões */}
      <div className="border border-border rounded-lg p-5 bg-muted/40 space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Permissões de Acesso
        </h3>
        <p className="text-xs text-muted-foreground">
          Configure as permissões por recurso. "Visualizar" é obrigatório para habilitar as demais ações.
        </p>
        <MatrizPermissoes
          recursos={recursos.map(r => ({
            ...r,
            permissao: permissoes[r.id] || null,
          }))}
          onChange={handlePermChange}
        />
      </div>

      <Separator />

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-9 px-4 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!nome.trim() || saving}
          className="h-9 px-4 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Salvando...' : perfil ? 'Atualizar Perfil' : 'Criar Perfil'}
        </button>
      </div>
    </div>
  )
}
