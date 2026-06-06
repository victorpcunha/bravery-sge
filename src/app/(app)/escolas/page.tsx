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
          <h1 className="text-3xl font-bold text-foreground">Escolas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as unidades escolares (Registro 00)
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 transition-all duration-200 animate-fade-in-up">
          <Link href="/escolas/novo">
            <Plus className="mr-2 h-4 w-4" />
            Nova Escola
          </Link>
        </Button>
      </div>

      {schools.length === 0 ? (
        <Card className="col-span-full border-0 shadow-md card-glass animate-fade-in-up">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-6">
              <School className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Nenhuma escola cadastrada</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Comece cadastrando sua primeira escola para utilizar o sistema de gestão escolar.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 shadow-lg shadow-blue-500/20">
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
                    <CardTitle className="text-lg line-clamp-2 font-semibold text-foreground group-hover:text-primary transition-colors">
                      {school.nome_escola}
                    </CardTitle>
                    <Badge className={
                      school.situacao_funcionamento === '1' 
                        ? "bg-success-light text-success hover:bg-success-light" 
                        : "bg-muted text-muted-foreground hover:bg-muted"
                    }>
                      {situacaoFuncionario[school.situacao_funcionamento as keyof typeof situacaoFuncionario] || school.situacao_funcionamento}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {school.codigo_inep && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="font-medium">INEP:</span>
                      <span>{school.codigo_inep}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-7 h-7 bg-accent/10 rounded-lg flex items-center justify-center">
                      <School className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <span className="font-medium">Tipo:</span>
                    <span>{dependenciaAdministrativa[school.dependencia_administrativa as keyof typeof dependenciaAdministrativa]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-7 h-7 bg-ring/10 rounded-lg flex items-center justify-center">
                      <MapPin className="h-3.5 w-3.5 text-ring" />
                    </div>
                    <span className="font-medium">Local:</span>
                    <span>{localizacao[school.localizacao as keyof typeof localizacao]}</span>
                  </div>
                  {school.telefone_1 && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <span>{school.telefone_1}</span>
                    </div>
                  )}
                  {school.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
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

      <div className="mt-8 p-5 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm animate-fade-in-up delay-300">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-foreground">Total: {schools.length} escola(s)</h4>
            <p className="text-sm text-muted-foreground">
              Estes dados serão enviados ao Censo INEP 2026 (Registro 00)
            </p>
          </div>
          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
            <School className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>
    </div>
  )
}