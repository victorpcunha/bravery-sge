'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { School, Lock, Mail, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { getPortalSupabase } from '@/lib/portal-client'
import { getSessaoPortal } from '@/lib/actions/portal'
import { usePortal } from '@/components/portal/portal-provider'

const portalLoginSchema = z.object({
  email: z.string().min(1, 'Informe o e-mail').email('Informe um e-mail válido'),
  password: z.string().min(1, 'Informe a senha'),
})

type PortalLoginValues = z.infer<typeof portalLoginSchema>

const ERRO_GENERICO = 'Usuário ou senha inválidos'

export default function PortalLoginPage() {
  const router = useRouter()
  const { escola } = usePortal()
  const base = escola ? `/portal/${escola.slug}` : '/portal'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<PortalLoginValues>({
    resolver: zodResolver(portalLoginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: PortalLoginValues) {
    setIsSubmitting(true)
    setError(null)
    try {
      const supabase = getPortalSupabase()
      const { data: signData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email.trim(),
        password: data.password,
      })
      const user = signData?.user ?? null
      // Gate do portal (R2/R8): credencial interna ou sem vínculo é recusada
      // com mensagem genérica, sem revelar o motivo (LGPD).
      if (authError || !user || user.user_metadata?.portal_only !== true) {
        await supabase.auth.signOut()
        setError(ERRO_GENERICO)
        setIsSubmitting(false)
        return
      }
      try {
        await getSessaoPortal(String(user.user_metadata?.person_id || ''), escola?.schoolId)
      } catch {
        await supabase.auth.signOut()
        setError(ERRO_GENERICO)
        setIsSubmitting(false)
        return
      }
      await new Promise(resolve => setTimeout(resolve, 400))
      router.push(`${base}/aluno`)
    } catch {
      setError('Erro interno ao fazer login')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {escola?.branding?.imagemFundo && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={escola.branding.imagemFundo}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-background/70" aria-hidden="true" />
        </>
      )}
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {escola?.branding?.logo ? (
              <div className="h-14 max-w-[240px] rounded-2xl bg-card border border-border px-4 py-2 flex items-center justify-center shadow-md overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={escola.branding.logo} alt={`Logo ${escola.branding.nome}`} className="max-h-full max-w-full object-contain" />
              </div>
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-md">
                <School className="w-8 h-8 text-primary-foreground" />
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {escola?.branding?.nome || 'Portal do Responsável'}
          </h1>
          <p className="text-muted-foreground">
            {escola?.branding?.textoLogin || 'Acompanhe a vida escolar do seu filho'}
          </p>
        </div>

        <Card className="border border-border shadow-lg">
          <div className="h-1.5 bg-gradient-to-r from-primary to-accent rounded-t-lg" />
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-foreground">Acessar Portal</CardTitle>
            <CardDescription className="text-muted-foreground">
              Use o e-mail e a senha informados pela escola
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div role="alert" className="p-3 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg">
                    {error}
                    <span className="block mt-1 text-muted-foreground">
                      Se o problema persistir, procure a secretaria da escola.
                    </span>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">E-mail</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="email@exemplo.com"
                            className="pl-10 bg-card border-border focus:border-accent focus:ring-accent/20"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="••••••"
                            className="pl-10 bg-card border-border focus:border-accent focus:ring-accent/20"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Esqueceu a senha? Procure a secretaria da escola.
        </p>
      </div>
    </div>
  )
}
