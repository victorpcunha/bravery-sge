'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Loader2, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { usePortal } from '@/components/portal/portal-provider'
import { aceitarTermo, getTermoVigente, type TermoVigente } from '@/lib/actions/portal'

export default function PortalTermoPage() {
  const router = useRouter()
  const { sessao, refresh, escola } = usePortal()
  const base = escola ? `/portal/${escola.slug}` : '/portal'
  const [termo, setTermo] = useState<TermoVigente | null>(null)
  const [loading, setLoading] = useState(true)
  const [aceitando, setAceitando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    getTermoVigente()
      .then(setTermo)
      .catch(() => setErro('Não foi possível carregar o termo. Tente novamente.'))
      .finally(() => setLoading(false))
  }, [])

  async function onAceitar() {
    const responsavelId = sessao?.responsavel.id
    if (!responsavelId) return
    setAceitando(true)
    setErro(null)
    try {
      await aceitarTermo(responsavelId)
      await refresh()
      router.replace(`${base}/aluno`)
    } catch {
      setErro('Não foi possível registrar o aceite. Tente novamente.')
      setAceitando(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl border border-border shadow-md">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-[20px] font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Termo de Uso e Política de Privacidade
            {termo && <span className="text-[13px] font-medium text-muted-foreground">v{termo.versao}</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {!termo ? (
            <EmptyState
              icon={ShieldAlert}
              title="Termo indisponível"
              description="Não foi possível carregar o termo. Procure a secretaria da escola."
            />
          ) : (
            <>
              <div className="max-h-[50vh] overflow-y-auto rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-[15px] leading-relaxed text-foreground whitespace-pre-line">{termo.conteudo}</p>
              </div>
              {erro && (
                <div role="alert" className="p-3 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg">
                  {erro}
                </div>
              )}
              <div className="flex justify-end">
                <Button onClick={onAceitar} disabled={aceitando} className="min-h-[44px]">
                  {aceitando ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    'Aceitar'
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
