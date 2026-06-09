'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Users, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const mockDocentes = [
  { id: '1', nome: 'Maria Santos', cpf: '123.456.789-00', tipo_vinculo: '1', formacao: '3' },
  { id: '2', nome: 'João Pedro', cpf: '987.654.321-00', tipo_vinculo: '1', formacao: '4' },
]

const tipoVinculo = {
  '1': 'Efetivo',
  '2': 'Contratado',
  '3': 'Temporário',
}

const formacao = {
  '1': 'Ensino Médio',
  '2': 'Graduação',
  '3': 'Pós-Graduação',
  '4': 'Mestrado',
  '5': 'Doutorado',
}

export default function DocentesPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold text-foreground">Docentes</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os professores da escola (Registro 10)
            </p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary">
            <Link href="/docentes/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo Docente
            </Link>
          </Button>
        </div>

        {/* Busca */}
        <Card className="mb-6 border-0 shadow-md card-glass animate-fade-in-up delay-75">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nome ou CPF..." 
                  className="pl-10 bg-input/80 border-border focus:border-primary focus:ring-primary/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista */}
        {mockDocentes.length === 0 ? (
          <Card className="border-0 shadow-md card-glass animate-fade-in-up delay-150">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-6">
                <Users className="h-10 w-10 text-info" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum docente cadastrado</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Comece cadastrando os professores da sua escola.
              </p>
          <Button asChild className="bg-primary hover:bg-primary">
                <Link href="/docentes/novo">Cadastrar Primeiro Docente</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {mockDocentes.map((docente, index) => (
              <Card key={docente.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-200 card-glass group animate-fade-in-up cursor-pointer" style={{ animationDelay: `${index * 75 + 150}ms` }}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-foreground">{docente.nome}</CardTitle>
                    <Badge className="bg-info-light text-info hover:bg-info-light border-0">
                      {tipoVinculo[docente.tipo_vinculo as keyof typeof tipoVinculo]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><span className="font-medium">CPF:</span> {docente.cpf}</p>
                    <p><span className="font-medium">Formação:</span> {formacao[docente.formacao as keyof typeof formacao]}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 p-5 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm animate-fade-in-up delay-300">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-foreground">Total: {mockDocentes.length} docente(s)</h4>
              <p className="text-sm text-muted-foreground">
                Estes dados serão enviados ao Censo INEP 2026 (Registro 10 - 187 campos)
              </p>
            </div>
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-info" />
            </div>
          </div>
        </div>
      </div>
  )
}