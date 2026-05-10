'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, UserCheck, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const mockPessoas = [
  { id: '1', nome: 'José Silva', cpf: '111.222.333-44', papel: 'gestor' },
  { id: '2', nome: 'Ana Costa', cpf: '555.666.777-88', papel: 'docente' },
]

const papelPessoa = {
  'gestor': 'Gestor',
  'docente': 'Docente',
  'aluno': 'Aluno',
  'responsavel': 'Responsável',
}

const papelColors: Record<string, string> = {
  'gestor': 'bg-[#457B9D]/10 text-[#457B9D]',
  'docente': 'bg-[#1D3557]/10 text-[#1D3557]',
  'aluno': 'bg-[#E9A23B]/10 text-[#E9A23B]',
  'responsavel': 'bg-[#2BAE66]/10 text-[#2BAE66]',
}

export default function PessoasPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <>
      <div className="container mx-auto py-8 px-4 md:pl-64">
        <div className="flex items-center justify-between mb-8">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold text-[#0f172a]">Pessoas</h1>
            <p className="text-[#64748b] mt-1">
              Cadastro único de pessoas (Registro 30)
            </p>
          </div>
          <Button asChild className="bg-[#4FB3BF] hover:bg-[#3d8a8c] shadow-lg shadow-teal-500/20">
            <Link href="/pessoas/nova">
              <Plus className="mr-2 h-4 w-4" />
              Nova Pessoa
            </Link>
          </Button>
        </div>

        {/* Busca */}
        <Card className="mb-6 border-0 shadow-md card-glass animate-fade-in-up delay-75">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b]" />
              <Input 
                placeholder="Buscar por nome ou CPF..." 
                className="pl-10 bg-white/80 border-[#e2e8f0] focus:border-[#4FB3BF] focus:ring-[#4FB3BF]/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista */}
        {mockPessoas.length === 0 ? (
          <Card className="border-0 shadow-lg card-glass animate-fade-in-up delay-150">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-[#4FB3BF]/10 to-[#1D3557]/10 rounded-2xl flex items-center justify-center mb-6">
                <UserCheck className="h-10 w-10 text-[#4FB3BF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#0f172a] mb-2">Nenhuma pessoa cadastrada</h3>
              <p className="text-[#64748b] text-center mb-6 max-w-md">
                Cadastre pessoas para usar no sistema.
              </p>
              <Button asChild className="bg-[#4FB3BF] hover:bg-[#3d8a8c]">
                <Link href="/pessoas/nova">Cadastrar Primeira Pessoa</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {mockPessoas.map((pessoa, index) => (
              <Card key={pessoa.id} className="border-0 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 card-glass group animate-fade-in-up cursor-pointer" style={{ animationDelay: `${index * 75 + 150}ms` }}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#4FB3BF]/20 to-[#1D3557]/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-[#4FB3BF]">{pessoa.nome.charAt(0)}</span>
                      </div>
                      <CardTitle className="text-lg font-semibold text-[#0f172a] group-hover:text-[#4FB3BF] transition-colors">{pessoa.nome}</CardTitle>
                    </div>
                    <Badge className={`${papelColors[pessoa.papel]} border-0`}>
                      {papelPessoa[pessoa.papel as keyof typeof papelPessoa]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pl-[52px]">
                  <div className="text-sm text-[#64748b]">
                    <p><span className="font-medium">CPF:</span> {pessoa.cpf}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#e2e8f0]/50 shadow-sm animate-fade-in-up delay-300">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-[#0f172a]">Total: {mockPessoas.length} pessoa(s)</h4>
              <p className="text-sm text-[#64748b]">
                Estes dados serão enviados ao Census INEP 2026 (Registro 30 - 110 campos)
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#4FB3BF]/10 to-[#457B9D]/10 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-[#4FB3BF]" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}