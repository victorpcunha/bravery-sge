'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { School, Lock, Mail, User, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useAuth } from '@/components/providers/auth-provider'

const loginSchema = z.object({
  email: z.string().min(1, 'Informe CPF ou e-mail'),
  password: z.string().min(1, 'Informe a senha'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginFormValues) {
    console.log('Tentando login com:', data.email)
    setIsSubmitting(true)
    setError(null)

    try {
      const { error: authError } = await signIn(data.email, data.password)

      if (authError) {
        setError('Usuário ou senha inválidos')
        setIsSubmitting(false)
        return
      }

      // Aguardar um momento para a sessão ser estabelecida
      await new Promise(resolve => setTimeout(resolve, 500))
      
      console.log('Redirecionando para dashboard...')
      router.push('/')
    } catch (err) {
      console.error('Erro durante login:', err)
      setError('Erro interno ao fazer login')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-md">
              <School className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Bravery SGE</h1>
          <p className="text-muted-foreground">Sistema de Gestão Escolar</p>
        </div>

        <Card className="border border-border shadow-lg">
          <div className="h-1.5 bg-gradient-to-r from-primary to-accent rounded-t-lg" />
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-foreground">Acessar Sistema</CardTitle>
            <CardDescription className="text-muted-foreground">
              Informe suas credenciais para entrar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg">
                    {error}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">CPF ou E-mail</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="000.000.000-00 ou email@exemplo.com"
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

                <Button
                  type="submit"
                  className="w-full transition-all duration-200"
                  disabled={isSubmitting}
                >
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
          Acesso restrito a usuários autorizados
        </p>
      </div>
    </div>
  )
}