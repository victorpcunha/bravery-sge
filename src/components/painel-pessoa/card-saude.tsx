'use client'

import { useState, useEffect } from 'react'
import { getSaudeEstudante, type SaudeEstudante } from '@/lib/actions/painel-pessoa'
import { StatusBadge } from '@/components/feedback/status-badge'
import { Heart, Pill, Activity, Stethoscope, Brain, Loader2 } from 'lucide-react'

type Props = {
  pessoaId: string
  schoolId: string | null
  pessoaLogadaId: string | null
}

const CONDICOES_FISICAS: Record<string, string> = {
  cegueira: 'Cegueira',
  baixa_visao: 'Baixa Visão',
  visao_monocular: 'Visão Monocular',
  surdez: 'Surdez',
  deficiencia_auditiva: 'Deficiência Auditiva',
  surdocegueira: 'Surdocegueira',
  deficiencia_fisica: 'Deficiência Física',
  deficiencia_intelectual: 'Deficiência Intelectual',
  deficiencia_multipla: 'Deficiência Múltipla',
}

const TRANSTORNOS: Record<string, string> = {
  tea: 'TEA (Transtorno do Espectro Autista)',
  altas_habilidades: 'Altas Habilidades / Superdotação',
  discalculia: 'Discalculia',
  disgrafia: 'Disgrafia',
  dislalia: 'Dislalia',
  dislexia: 'Dislexia',
  tdah: 'TDAH',
  tpac: 'TPAC',
}

const RECURSOS_SAEB: Record<string, string> = {
  auxilio_ledor: 'Auxílio Ledor',
  auxiliary_transcricao: 'Auxílio Transcrição',
  guia_interprete: 'Guia Intérprete',
  tradutor_libras: 'Tradutor de Libras',
  leitura_labial: 'Leitura Labial',
  prova_ampliada: 'Prova Ampliada',
  prova_superampliada: 'Prova Superampliada',
  cd_audio: 'CD Áudio',
  prova_libras: 'Prova em Libras',
  prova_video_libras: 'Prova em Vídeo Libras',
  material_braille: 'Material em Braille',
  prova_braille: 'Prova em Braille',
  tempo_adicional: 'Tempo Adicional',
}

type SectionHeaderProps = {
  icon: React.ReactNode
  title: string
  chipClass: string
}

function SectionHeader({ icon, title, chipClass }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${chipClass}`}>
        {icon}
      </div>
      <h4 className="text-[14px] font-semibold text-foreground">{title}</h4>
    </div>
  )
}

export default function CardSaude({ pessoaId, schoolId, pessoaLogadaId }: Props) {
  const [dados, setDados] = useState<SaudeEstudante | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getSaudeEstudante(pessoaId, schoolId, pessoaLogadaId)
      .then(setDados)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [pessoaId, schoolId, pessoaLogadaId])

  if (loading) {
    return (
      <div className="space-y-4" aria-busy="true">
        <div className="h-6 w-40 bg-muted rounded-md animate-pulse" />
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-7 w-32 bg-muted rounded-full animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const condicoesAtivas = Object.entries(CONDICOES_FISICAS)
    .filter(([key]) => (dados as any)?.[key])
    .map(([, label]) => label)

  const transtornosAtivos = Object.entries(TRANSTORNOS)
    .filter(([key]) => (dados as any)?.[key])
    .map(([, label]) => label)

  const recursosSaeb = Object.entries(RECURSOS_SAEB)
    .filter(([key]) => (dados as any)?.[key])
    .map(([, label]) => label)

  const temMedicamentos = !!dados?.medicamentos
  const temAlgo = condicoesAtivas.length > 0 || transtornosAtivos.length > 0 || recursosSaeb.length > 0 || temMedicamentos

  if (!temAlgo) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
          <Heart className="h-4 w-4" aria-hidden="true" />
        </div>
        <p className="text-[15px] text-muted-foreground">Nenhuma informação de saúde cadastrada.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {condicoesAtivas.length > 0 && (
        <div className="space-y-2">
          <SectionHeader
            icon={<Stethoscope className="h-4 w-4" aria-hidden="true" />}
            title="Tipos de Deficiência"
            chipClass="bg-destructive/10 text-destructive"
          />
          <div className="flex flex-wrap gap-1.5 pl-10">
            {condicoesAtivas.map(c => (
              <StatusBadge key={c} status="destructive">
                {c}
              </StatusBadge>
            ))}
          </div>
        </div>
      )}

      {transtornosAtivos.length > 0 && (
        <div className="space-y-2">
          <SectionHeader
            icon={<Brain className="h-4 w-4" aria-hidden="true" />}
            title="Tipos de Transtorno"
            chipClass="bg-warning/10 text-warning"
          />
          <div className="flex flex-wrap gap-1.5 pl-10">
            {transtornosAtivos.map(t => (
              <StatusBadge key={t} status="warning">
                {t}
              </StatusBadge>
            ))}
          </div>
        </div>
      )}

      {recursosSaeb.length > 0 && (
        <div className="space-y-2">
          <SectionHeader
            icon={<Activity className="h-4 w-4" aria-hidden="true" />}
            title="Recursos de Acessibilidade"
            chipClass="bg-info/10 text-info"
          />
          <div className="flex flex-wrap gap-1.5 pl-10">
            {recursosSaeb.map(r => (
              <StatusBadge key={r} status="info">
                {r}
              </StatusBadge>
            ))}
          </div>
        </div>
      )}

      {dados?.medicamentos && (
        <div className="space-y-1.5">
          <SectionHeader
            icon={<Pill className="h-4 w-4" aria-hidden="true" />}
            title="Medicamentos / Outras informações"
            chipClass="bg-muted text-muted-foreground"
          />
          <p className="text-[15px] text-foreground whitespace-pre-wrap pl-10">{dados.medicamentos}</p>
        </div>
      )}

      {recursosSaeb.length === 0 && dados?.condicoes && (
        <div className="space-y-1.5">
          <SectionHeader
            icon={<Heart className="h-4 w-4" aria-hidden="true" />}
            title="Condições de Saúde"
            chipClass="bg-primary/10 text-primary"
          />
          <p className="text-[15px] text-foreground whitespace-pre-wrap pl-10">{dados.condicoes}</p>
        </div>
      )}
    </div>
  )
}
