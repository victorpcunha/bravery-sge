'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, GraduationCap, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const mockTurmas = [
  { id: '1', nome: '1º Ano A', tipo_turma: '6', tipo_mediacao: '1', etapa_ensino: '1' },
  { id: '2', nome: '2º Ano B', tipo_turma: '6', tipo_mediacao: '1', etapa_ensino: '1' },
]

const tipoTurma = {
  '4': 'Atividade Complementar',
  '5': 'AEE',
  '6': 'Ensino Regular',
  '9': 'Ensino Regular + Atividade',
}

const tipoMediacao = {
  '1': 'Presencial',
  '2': 'Semipresencial',
  '3': 'EAD',
}

const etapaEnsino = {
  '1': 'Educação Infantil',
  '2': 'Ensino Fundamental',
  '3': 'Ensino Médio',
}

export default function TurmasPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <>
      <div className="container mx-auto py-8 px-4 md:pl-64">
        <div className="flex items-center justify-between mb-8">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold text-[#0f172a]">Turmas</h1>
            <p className="text-[#64748b] mt-1">
              Gerencie as turmas da escola (Registro 20)
            </p>
          </div>
          <Button asChild className="bg-[#457B9D] hover:bg-[#457B9D]">
            <Link href="/turmas/nova">
              <Plus className="mr-2 h-4 w-4" />
              Nova Turma
            </Link>
          </Button>
        </div>

        {/* Busca */}
        <Card className="mb-6 border-0 shadow-md card-glass animate-fade-in-up delay-75">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b]" />
              <Input 
                placeholder="Buscar por nome da turma..." 
                className="pl-10 bg-white/80 border-[#e2e8f0] focus:border-[#457B9D] focus:ring-[#457B9D]/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista */}
        {mockTurmas.length === 0 ? (
          <Card className="border-0 shadow-md card-glass animate-fade-in-up delay-150">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-[#f1f5f9] rounded-2xl flex items-center justify-center mb-6">
                <GraduationCap className="h-10 w-10 text-[#457B9D]" />
              </div>
              <h3 className="text-xl font-semibold text-[#0f172a] mb-2">Nenhuma turma cadastrada</h3>
              <p className="text-[#64748b] text-center mb-6 max-w-md">
                Crie as turmas da sua escola para continuar.
              </p>
<Button asChild className="bg-[#457B9D] hover:bg-[#3a6a8a]">
                <Link href="/turmas/nova">Criar Primeira Turma</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockTurmas.map((turma, index) => (
              <Link key={turma.id} href={`/turmas/${turma.id}`}>
                <Card className="hover:shadow-md transition-all duration-200 cursor-pointer h-full border-0 shadow-sm card-glass group animate-fade-in-up" style={{ animationDelay: `${index * 75 + 150}ms` }}>
                  <CardHeader className="pb-3 pt-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-[#0f172a] group-hover:text-[#457B9D] transition-colors">{turma.nome}</CardTitle>
                      <Badge className="bg-[#e0f2fe] text-[#457B9D] hover:bg-[#e0f2fe] border-0">
                        {tipoMediacao[turma.tipo_mediacao as keyof typeof tipoMediacao]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-[#64748b] space-y-1">
                      <p><span className="font-medium">Tipo:</span> {tipoTurma[turma.tipo_turma as keyof typeof tipoTurma]}</p>
                      <p><span className="font-medium">Etapa:</span> {etapaEnsino[turma.etapa_ensino as keyof typeof etapaEnsino]}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#e2e8f0]/50 shadow-sm animate-fade-in-up delay-300">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-[#0f172a]">Total: {mockTurmas.length} turma(s)</h4>
              <p className="text-sm text-[#64748b]">
                Estes dados serão enviados ao Censo INEP 2026 (Registro 20 - 66 campos)
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#457B9D]/10 to-[#4FB3BF]/10 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[#457B9D]" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}