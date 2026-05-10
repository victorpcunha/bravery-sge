'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ArrowLeft, Save, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { getSchool, updateSchool, deleteSchool } from '@/lib/actions/schools'
import { School } from '@/lib/actions/schools'

const schoolSchema = z.object({
  nome_escola: z.string().min(1, 'Nome da escola é obrigatório'),
  codigo_inep: z.string().optional(),
  cnpj: z.string().optional(),
  situacao_funcionamento: z.string().min(1, 'Situação de funcionamento é obrigatória'),
  dependencia_administrativa: z.string().min(1, 'Dependência administrativa é obrigatória'),
  formato_organizacional: z.string().min(1, 'Formato organizacional é obrigatório'),
  localizacao: z.string().min(1, 'Localização é obrigatória'),
  telefone_1: z.string().optional(),
  telefone_2: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  nome_gestor: z.string().optional(),
  cpf_gestor: z.string().optional(),
})

type SchoolFormValues = z.infer<typeof schoolSchema>

interface EditSchoolPageProps {
  params: Promise<{ id: string }>
}

export default function EditSchoolPage({ params }: EditSchoolPageProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [school, setSchool] = useState<School | null>(null)

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      nome_escola: '',
      situacao_funcionamento: '1',
      dependencia_administrativa: '3',
      formato_organizacional: '1',
      localizacao: '1',
    },
  })

  // Carregar dados da escola
  useState(async () => {
    const { id } = await params
    const data = await getSchool(id)
    setSchool(data)
    form.reset({
      nome_escola: data.nome_escola,
      codigo_inep: data.codigo_inep || '',
      cnpj: data.cnpj || '',
      situacao_funcionamento: data.situacao_funcionamento,
      dependencia_administrativa: data.dependencia_administrativa,
      formato_organizacional: data.formato_organizacional,
      localizacao: data.localizacao,
      telefone_1: data.telefone_1 || '',
      telefone_2: data.telefone_2 || '',
      email: data.email || '',
      nome_gestor: data.nome_gestor || '',
      cpf_gestor: data.cpf_gestor || '',
    })
  })

  async function onSubmit(data: SchoolFormValues) {
    setIsSubmitting(true)
    try {
      const { id } = await params
      await updateSchool(id, data)
      router.push('/escolas')
    } catch (error) {
      console.error('Erro ao atualizar escola:', error)
      alert('Erro ao atualizar escola. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja excluir esta escola?')) return
    
    try {
      const { id } = await params
      await deleteSchool(id)
      router.push('/escolas')
    } catch (error) {
      console.error('Erro ao excluir escola:', error)
      alert('Erro ao excluir escola.')
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/escolas">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Escolas
        </Link>
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Editar Escola</CardTitle>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nome_escola"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Escola *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo da escola" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="codigo_inep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código INEP</FormLabel>
                      <FormControl>
                        <Input placeholder="8 dígitos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ</FormLabel>
                      <FormControl>
                        <Input placeholder="00.000.000/0001-00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="situacao_funcionamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Situação de Funcionamento *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Em Atividade</SelectItem>
                          <SelectItem value="2">Paralisada</SelectItem>
                          <SelectItem value="3">Extinta</SelectItem>
                          <SelectItem value="4">Em Construção</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dependencia_administrativa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dependência Administrativa *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Federal</SelectItem>
                          <SelectItem value="2">Estadual</SelectItem>
                          <SelectItem value="3">Municipal</SelectItem>
                          <SelectItem value="4">Privada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="formato_organizacional"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Formato Organizacional *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Escola</SelectItem>
                          <SelectItem value="2">Centro de Educação</SelectItem>
                          <SelectItem value="3">Creche</SelectItem>
                          <SelectItem value="4">Pré-Escola</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="localizacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localização *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Urbana</SelectItem>
                          <SelectItem value="2">Rural</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="telefone_1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone 1</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefone_2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone 2</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="escola@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border-t pt-4">
                <h3 className="font-medium mb-4">Dados do Gestor</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nome_gestor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Gestor</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cpf_gestor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF do Gestor</FormLabel>
                        <FormControl>
                          <Input placeholder="000.000.000-00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" asChild>
                  <Link href="/escolas">Cancelar</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}