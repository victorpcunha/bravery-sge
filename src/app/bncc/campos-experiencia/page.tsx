'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen } from 'lucide-react'

const camposExperiencia = [
  {
    id: 'cg',
    nome: 'Corpo, Gestos e Movimento',
    descricao: 'Desenvolvimento da coordenação motora, expressão corporal e consciência corporal.',
    cor: '#E11D48'
  },
  {
    id: 'ef',
    nome: 'Escuta, Fala, Pensamento e Imaginação',
    descricao: 'Desenvolvimento da linguagem oral, escrita, leitura e imaginação.',
    cor: '#7C3AED'
  },
  {
    id: 'et',
    nome: 'Espaços, tempos, quantidades, relações e transformações',
    descricao: 'Exploração de conceitos matemáticos, espaciais, temporais e científicos.',
    cor: '#059669'
  },
  {
    id: 'eo',
    nome: 'O eu, o outro e o nós',
    descricao: 'Desenvolvimento da identidade, socialização e convivência coletiva.',
    cor: '#D97706'
  },
  {
    id: 'ts',
    nome: 'Traços, Sons, Cores e Formas',
    descricao: 'Expressão artística através de artes visuais, música e criatividade.',
    cor: '#0891B2'
  }
]

export default function CamposExperienciaPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:pl-64">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-[#0f172a]">Campos de Experiência</h1>
        <p className="text-[#64748b] mt-1">
          Os cinco Campos de Experiência da BNCC do Ensino Infantil
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {camposExperiencia.map((campo, index) => (
          <Card 
            key={campo.id} 
            className="border-0 shadow-md card-glass hover:shadow-lg transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${campo.cor}20` }}
                >
                  <BookOpen className="w-6 h-6" style={{ color: campo.cor }} />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-[#0f172a]">
                    {campo.nome}
                  </CardTitle>
                  <Badge 
                    className="mt-1 text-xs"
                    style={{ backgroundColor: `${campo.cor}20`, color: campo.cor }}
                  >
                    {campo.id.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#64748b] leading-relaxed">
                {campo.descricao}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#e2e8f0]/50 shadow-sm animate-fade-in-up delay-300">
        <p className="text-sm text-[#64748b]">
          Fonte: Base Nacional Comum Curricular (BNCC) - 2018
        </p>
      </div>
    </div>
  )
}