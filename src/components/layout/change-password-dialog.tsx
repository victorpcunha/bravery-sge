'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getSupabaseClient } from '@/lib/auth'
import { toast } from 'sonner'
import { Lock, Eye, EyeOff } from 'lucide-react'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function validarSenha(senha: string): string | null {
  if (senha.length < 10) return 'Senha deve ter no mínimo 10 caracteres'
  if (!/[A-Z]/.test(senha)) return 'Senha deve conter pelo menos uma letra maiúscula'
  if (!/[a-z]/.test(senha)) return 'Senha deve conter pelo menos uma letra minúscula'
  if (!/[0-9]/.test(senha)) return 'Senha deve conter pelo menos um número'
  if (!/[^A-Za-z0-9]/.test(senha)) return 'Senha deve conter pelo menos um caractere especial'
  return null
}

export function ChangePasswordDialog({ open, onOpenChange }: Props) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')

  const canSave = currentPassword && newPassword && confirmPassword

  const handleSave = async () => {
    setError('')

    const erro = validarSenha(newPassword)
    if (erro) {
      setError(erro)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('A confirmação da nova senha não corresponde')
      return
    }

    setSaving(true)
    try {
      const supabase = getSupabaseClient()

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        if (updateError.message?.toLowerCase().includes('same password')) {
          setError('A nova senha deve ser diferente da senha atual')
        } else {
          setError(updateError.message)
        }
        setSaving(false)
        return
      }

      toast.success('Senha alterada com sucesso')
      onOpenChange(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      setError('Erro ao alterar senha. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setError('')
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <DialogTitle>Alterar Senha</DialogTitle>
              <DialogDescription>
                Informe a senha atual e a nova senha desejada
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="current-password">Senha atual</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite sua senha atual"
                aria-required="true"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">Nova senha</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha"
                aria-required="true"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[13px] text-muted-foreground mt-1">
              Mínimo 10 caracteres: 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar nova senha</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a nova senha"
                aria-required="true"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {error}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-border px-6 py-3 flex justify-end gap-2 bg-muted/30">
          <Button variant="outline" onClick={() => handleOpenChange(false)} className="min-h-[40px] sm:min-h-[44px]">
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!canSave || saving} className="min-h-[40px] sm:min-h-[44px]">
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
