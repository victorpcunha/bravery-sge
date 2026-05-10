import Link from 'next/link'
import { Plus, School, MapPin, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getSchools } from '@/lib/actions/schools'

const situacaoFuncionario = {
  '1': 'Em Atividade',
  '2': 'Paralisada',
  '3': 'Extinta',
  '4': 'Em Construção',
}

const dependenciaAdministrativa = {
  '1': 'Federal',
  '2': 'Estadual',
  '3': 'Municipal',
  '4': 'Privada',
}

const localizacao = {
  '1': 'Urbana',
  '2': 'Rural',
}

export default async function EscolasPage() {
  const schools = await getSchools()

  return (
    <div className="container mx-auto py-8 px-4 md:pl-64">
      <div className="flex items-center justify-between mb-8">
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-bold text-[#0f172a]">Escolas</h1>
          <p className="text-[#64748b] mt-1">
            Gerencie as unidades escolares (Registro 00)
          </p>
        </div>
        <Button asChild className="bg-[#1D3557] hover:bg-[#16304a] transition-all duration-200 animate-fade-in-up">
          <Link href="/escolas/novo">
            <Plus className="mr-2 h-4 w-4" />
            Nova Escola
          </Link>
        </Button>
      </div>

      {schools.length === 0 ? (
        <Card className="col-span-full border-0 shadow-md card-glass animate-fade-in-up">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-[#f1f5f9] rounded-2xl flex items-center justify-center mb-6">
              <School className="h-10 w-10 text-[#1D3557]" />
            </div>
            <h3 className="text-xl font-semibold text-[#0f172a] mb-2">Nenhuma escola cadastrada</h3>
            <p className="text-[#64748b] text-center mb-6 max-w-md">
              Comece cadastrando sua primeira escola para utilizar o sistema de gestão escolar.
            </p>
            <Button asChild className="bg-[#1D3557] hover:bg-[#16304a] shadow-lg shadow-blue-500/20">
              <Link href="/escolas/novo">Cadastrar Primeira Escola</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schools.map((school, index) => (
            <Link key={school.id} href={`/escolas/${school.id}`}>
              <Card className="hover:shadow-md transition-all duration-200 cursor-pointer h-full border-0 shadow-sm card-glass group animate-fade-in-up" style={{ animationDelay: `${index * 75}ms` }}>
                <CardHeader className="pb-3 pt-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2 font-semibold text-[#0f172a] group-hover:text-[#1D3557] transition-colors">
                      {school.nome_escola}
                    </CardTitle>
                    <Badge className={
                      school.situacao_funcionamento === '1' 
                        ? "bg-[#d1fae5] text-[#2BAE66] hover:bg-[#d1fae5]" 
                        : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#f1f5f9]"
                    }>
                      {situacaoFuncionario[school.situacao_funcionamento as keyof typeof situacaoFuncionario] || school.situacao_funcionamento}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {school.codigo_inep && (
                    <div className="flex items-center gap-2 text-[#64748b]">
                      <div className="w-7 h-7 bg-[#1D3557]/10 rounded-lg flex items-center justify-center">
                        <MapPin className="h-3.5 w-3.5 text-[#1D3557]" />
                      </div>
                      <span className="font-medium">INEP:</span>
                      <span>{school.codigo_inep}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[#64748b]">
                    <div className="w-7 h-7 bg-[#457B9D]/10 rounded-lg flex items-center justify-center">
                      <School className="h-3.5 w-3.5 text-[#457B9D]" />
                    </div>
                    <span className="font-medium">Tipo:</span>
                    <span>{dependenciaAdministrativa[school.dependencia_administrativa as keyof typeof dependenciaAdministrativa]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#64748b]">
                    <div className="w-7 h-7 bg-[#4FB3BF]/10 rounded-lg flex items-center justify-center">
                      <MapPin className="h-3.5 w-3.5 text-[#4FB3BF]" />
                    </div>
                    <span className="font-medium">Local:</span>
                    <span>{localizacao[school.localizacao as keyof typeof localizacao]}</span>
                  </div>
                  {school.telefone_1 && (
                    <div className="flex items-center gap-2 text-[#64748b]">
                      <div className="w-7 h-7 bg-[#f1f5f9] rounded-lg flex items-center justify-center">
                        <Phone className="h-3.5 w-3.5 text-[#64748b]" />
                      </div>
                      <span>{school.telefone_1}</span>
                    </div>
                  )}
                  {school.email && (
                    <div className="flex items-center gap-2 text-[#64748b]">
                      <div className="w-7 h-7 bg-[#f1f5f9] rounded-lg flex items-center justify-center">
                        <Mail className="h-3.5 w-3.5 text-[#64748b]" />
                      </div>
                      <span className="truncate">{school.email}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#e2e8f0]/50 shadow-sm animate-fade-in-up delay-300">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-[#0f172a]">Total: {schools.length} escola(s)</h4>
            <p className="text-sm text-[#64748b]">
              Estes dados serão enviados ao Censo INEP 2026 (Registro 00)
            </p>
          </div>
          <div className="w-10 h-10 bg-[#f1f5f9] rounded-lg flex items-center justify-center">
            <School className="w-5 h-5 text-[#1D3557]" />
          </div>
        </div>
      </div>
    </div>
  )
}