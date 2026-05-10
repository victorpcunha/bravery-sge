'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, DoorOpen, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const mockMatriculas = [
  { id: '1', aluno: 'Pedro Santos', turma: '1º Ano A', data: '2026-01-15' },
  { id: '2', aluno: 'Lucas Oliveira', turma: '2º Ano B', data: '2026-01-15' },
]

export default function MatriculasPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <>
      <div className="container mx-auto py-8 px-4 md:pl-64">
        <div className="flex items-center justify-between mb-8">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold text-[#0f172a]">Matrículas</h1>
            <p className="text-[#64748b] mt-1">
              Gerencie as matrículas dos alunos (Registro 60)
            </p>
          </div>
          <Button asChild className="bg-[#2BAE66] hover:bg-[#1f8a4d] shadow-lg shadow-emerald-500/20">
            <Link href="/matriculas/nova">
              <Plus className="mr-2 h-4 w-4" />
              Nova Matrícula
            </Link>
          </Button>
        </div>

        {/* Busca */}
        <Card className="mb-6 border-0 shadow-md card-glass animate-fade-in-up delay-75">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b]" />
              <Input 
                placeholder="Buscar por nome do aluno..." 
                className="pl-10 bg-white/80 border-[#e2e8f0] focus:border-[#2BAE66] focus:ring-[#2BAE66]/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista */}
        {mockMatriculas.length === 0 ? (
          <Card className="border-0 shadow-lg card-glass animate-fade-in-up delay-150">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-[#2BAE66]/10 to-[#1D3557]/10 rounded-2xl flex items-center justify-center mb-6">
                <DoorOpen className="h-10 w-10 text-[#2BAE66]" />
              </div>
              <h3 className="text-xl font-semibold text-[#0f172a] mb-2">Nenhuma matrícula realizada</h3>
              <p className="text-[#64748b] text-center mb-6 max-w-md">
                Matricule os alunos nas turmas da escola.
              </p>
              <Button asChild className="bg-[#2BAE66] hover:bg-[#1f8a4d]">
                <Link href="/matriculas/nova">Fazer Primeira Matrícula</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {mockMatriculas.map((matricula, index) => (
              <Card key={matricula.id} className="border-0 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 card-glass group animate-fade-in-up cursor-pointer" style={{ animationDelay: `${index * 75 + 150}ms` }}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#2BAE66]/20 to-[#1D3557]/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-[#2BAE66]">{matricula.aluno.charAt(0)}</span>
                      </div>
                      <CardTitle className="text-lg font-semibold text-[#0f172a] group-hover:text-[#2BAE66] transition-colors">{matricula.aluno}</CardTitle>
                    </div>
                    <Badge className="bg-[#d1fae5] text-[#2BAE66] hover:bg-[#d1fae5] border-0">
                      Matriculado
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pl-[52px]">
                  <div className="text-sm text-[#64748b] space-y-1">
                    <p><span className="font-medium">Turma:</span> {matricula.turma}</p>
                    <p><span className="font-medium">Data da matrícula:</span> {matricula.data}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#e2e8f0]/50 shadow-sm animate-fade-in-up delay-300">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-[#0f172a]">Total: {mockMatriculas.length} matrícula(s)</h4>
              <p className="text-sm text-[#64748b]">
                Estes dados serão enviados ao Census INEP 2026 (Registro 60 - 33 campos)
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#2BAE66]/10 to-[#4FB3BF]/10 rounded-xl flex items-center justify-center">
              <DoorOpen className="w-6 h-6 text-[#2BAE66]" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}