'use client'

import { useState } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { FormCard } from '@/components/layout/form-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { Save, ArrowLeft } from 'lucide-react'
import type { BreadcrumbItem } from '@/components/layout/page-header'

const breadcrumbs: BreadcrumbItem[] = [
  { label: 'Pessoas', href: '/design-system-demo' },
  { label: 'Nova Pessoa' },
]

export function FormPage() {
  const [showCancel, setShowCancel] = useState(false)

  return (
    <PageContainer>
      <PageHeader
        icon={Save}
        title="Nova Pessoa"
        description="Exemplo de página de cadastro usando Design System"
        breadcrumbs={breadcrumbs}
        actions={
          <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button>
        }
      />

      <FormCard title="Dados Pessoais" description="Informações básicas da pessoa">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input id="nome" placeholder="Digite o nome completo" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="email@exemplo.com" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input id="cpf" placeholder="000.000.000-00" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input id="telefone" placeholder="(00) 00000-0000" />
          </div>
        </div>
      </FormCard>

      <FormCard title="Endereço" description="Informações de localização" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="logradouro">Logradouro</Label>
            <Input id="logradouro" placeholder="Rua, Avenida..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numero">Número</Label>
            <Input id="numero" placeholder="Nº" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bairro">Bairro</Label>
            <Input id="bairro" placeholder="Bairro" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="complemento">Complemento</Label>
            <Input id="complemento" placeholder="Apto, Bloco..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cep">CEP</Label>
            <Input id="cep" placeholder="00000-000" />
          </div>
        </div>
      </FormCard>

      <FormCard title="Observações" description="Informações adicionais (opcional)" className="mt-6">
        <Textarea placeholder="Observações sobre a pessoa..." rows={4} />
      </FormCard>

      <div className="flex items-center justify-end gap-3 mt-6">
        <Button variant="outline" onClick={() => setShowCancel(true)}>Cancelar</Button>
        <Button><Save className="mr-2 h-4 w-4" /> Salvar</Button>
      </div>

      <ConfirmDialog
        open={showCancel}
        onOpenChange={setShowCancel}
        title="Descartar alterações?"
        description="Todas as informações preenchidas serão perdidas."
        variant="warning"
        confirmLabel="Descartar"
        onConfirm={() => setShowCancel(false)}
      />
    </PageContainer>
  )
}