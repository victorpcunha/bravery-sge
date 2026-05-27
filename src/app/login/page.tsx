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
    <div className="min-h-screen flex items-center justify-center gradient-mesh p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#1D3557] to-[#457B9D] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <School className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Bravery SGE</h1>
          <p className="text-[#64748b]">Sistema de Gestão Escolar</p>
        </div>

        <Card className="border-0 shadow-xl card-glass">
          <div className="h-1.5 bg-gradient-to-r from-[#1D3557] via-[#457B9D] to-[#4FB3BF] rounded-t-lg" />
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-[#0f172a]">Acessar Sistema</CardTitle>
            <CardDescription className="text-[#64748b]">
              Informe suas credenciais para entrar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-[#dc2626] bg-red-50 border border-red-100 rounded-lg">
                    {error}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#334155]">CPF ou E-mail</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b]" />
                          <Input
                            placeholder="000.000.000-00 ou email@exemplo.com"
                            className="pl-10 bg-white/80 border-[#e2e8f0] focus:border-[#1D3557] focus:ring-[#1D3557]/20"
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
                      <FormLabel className="text-[#334155]">Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b]" />
                          <Input
                            type="password"
                            placeholder="••••••"
                            className="pl-10 bg-white/80 border-[#e2e8f0] focus:border-[#1D3557] focus:ring-[#1D3557]/20"
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
                  className="w-full bg-gradient-to-r from-[#1D3557] to-[#16304a] hover:from-[#16304a] hover:to-[#1D3557] shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200" 
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

        <p className="text-center text-sm text-[#64748b] mt-6">
          Acesso restrito a usuários autorizados
        </p>
      </div>
    </div>
  )
}