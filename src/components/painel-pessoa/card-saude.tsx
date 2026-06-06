'use client'

import { useState, useEffect } from 'react'
import { getSaudeEstudante, type SaudeEstudante } from '@/lib/actions/painel-pessoa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Pill, Activity, Loader2, Stethoscope, Brain } from 'lucide-react'

type Props = {
  pessoaId: string
  schoolId: string
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
      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Heart className="h-4 w-4" />Saúde</CardTitle></CardHeader>
        <CardContent><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></CardContent>
      </Card>
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
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Heart className="h-4 w-4 text-rose-500" />
            Saúde
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nenhuma informação de saúde cadastrada.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Heart className="h-4 w-4 text-rose-500" />
          Saúde
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {condicoesAtivas.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
              <Stethoscope className="h-3 w-3" /> Deficiências
            </p>
            <div className="flex flex-wrap gap-1">
              {condicoesAtivas.map(c => (
                <span key={c} className="text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded px-1.5 py-0.5">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {transtornosAtivos.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
              <Brain className="h-3 w-3" /> Transtornos / Neurodesenvolvimento
            </p>
            <div className="flex flex-wrap gap-1">
              {transtornosAtivos.map(t => (
                <span key={t} className="text-xs bg-warning/10 text-warning border border-warning/20 rounded px-1.5 py-0.5">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {recursosSaeb.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
              <Activity className="h-3 w-3" /> Condições de Saúde
            </p>
            <div className="flex flex-wrap gap-1">
              {recursosSaeb.map(r => (
                <span key={r} className="text-xs bg-info/10 text-info border border-info/20 rounded px-1.5 py-0.5">
                  {r}
                </span>
              ))}
            </div>
            {dados?.condicoes && (
              <p className="text-sm whitespace-pre-wrap mt-2">{dados.condicoes}</p>
            )}
          </div>
        )}

        {dados?.medicamentos && (
          <div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
              <Pill className="h-3 w-3" /> Outras informações de saúde
            </p>
            <p className="text-sm whitespace-pre-wrap">{dados.medicamentos}</p>
          </div>
        )}

        {/* Condições de saúde sem recursos SAEB, exibe só texto livre */}
        {recursosSaeb.length === 0 && dados?.condicoes && (
          <div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
              <Activity className="h-3 w-3" /> Condições de Saúde
            </p>
            <p className="text-sm whitespace-pre-wrap">{dados.condicoes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
