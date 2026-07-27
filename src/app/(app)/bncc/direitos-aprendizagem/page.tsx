'use client'

import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Smile, Users, Search, MessageCircle, User } from 'lucide-react'

const direitos = [
  {
    titulo: 'Conviver',
    icon: Users,
    descricao: 'Conviver com outras crianças e adultos, em pequenos e grandes grupos, utilizando diferentes linguagens, ampliando o conhecimento de si e do outro, o respeito em relação à cultura e às diferenças entre as pessoas.',
  },
  {
    titulo: 'Brincar',
    icon: Smile,
    descricao: 'Brincar cotidianamente de diversas formas, em diferentes espaços e tempos, com diferentes parceiros (crianças e adultos), ampliando e diversificando seu acesso a produções culturais, seus conhecimentos, sua imaginação, sua criatividade, suas experiências emocionais, corporais, sensoriais, expressivas, cognitivas, sociais e relacionais.',
  },
  {
    titulo: 'Participar',
    icon: Users,
    descricao: 'Participar ativamente, com adultos e outras crianças, tanto do planejamento da gestão da escola e das atividades propostas pelo educador quanto da realização das atividades da vida cotidiana, tais como a escolha das brincadeiras, dos materiais e dos ambientes, desenvolvendo diferentes linguagens e elaborando conhecimentos, decidindo e se posicionando.',
  },
  {
    titulo: 'Explorar',
    icon: Search,
    descricao: 'Explorar movimentos, gestos, sons, formas, texturas, cores, palavras, emoções, transformações, relacionamentos, histórias, objetos, elementos da natureza, na escola e fora dela, ampliando seus saberes sobre a cultura, em suas diversas modalidades: as artes, a escrita, a ciência e a tecnologia.',
  },
  {
    titulo: 'Expressar',
    icon: MessageCircle,
    descricao: 'Expressar como sujeito dialógico, criativo e sensível, suas necessidades, emoções, sentimentos, dúvidas, hipóteses, descobertas, opiniões, questionamentos, por meio de diferentes linguagens.',
  },
  {
    titulo: 'Conhecer-se',
    icon: User,
    descricao: 'Conhecer-se e construir sua identidade pessoal, social e cultural, constituindo uma imagem positiva de si e de seus grupos de pertencimento, nas diversas experiências de cuidados, interações, brincadeiras e linguagens vivenciadas na instituição escolar e em seu contexto familiar e comunitário.',
  },
]

export default function DireitosAprendizagemPage() {
  return (
    <PageContainer>
      <PageHeader
        icon={Heart}
        title="Direitos de Aprendizagem"
        description="Direitos de Aprendizagem e Desenvolvimento na Educação Infantil conforme BNCC"
      />

      <PageSection variant="default" title="Os 6 Direitos">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {direitos.map(d => (
            <Card key={d.titulo} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <d.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-foreground">{d.titulo}</h3>
                </div>
                <p className="text-[15px] text-muted-foreground leading-relaxed">{d.descricao}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>
    </PageContainer>
  )
}
