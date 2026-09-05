'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ModernTabs, type ModernTabItem } from '@/components/ui/modern-tabs'
import { ValidacaoAba } from '@/components/censo/validacao-aba'
import type { ResultadoValidacaoSituacaoFinal, ResultadoExportacaoSituacaoFinal } from '@/lib/actions/censo-situacao-final-types'
import { validarSituacaoFinal, exportarSituacaoFinal } from '@/lib/actions/censo-situacao-final'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
import { toast } from 'sonner'
import { FileDown, Loader2, Search } from 'lucide-react'
import { StatusBadge } from '@/components/feedback/status-badge'

const REGISTRO_TABS: ModernTabItem[] = [
  { value: 'registro89', label: 'Registro 89 — Escola e Gestor' },
  { value: 'registro90', label: 'Registro 90 — Situação do Aluno' },
  { value: 'registro91', label: 'Registro 91 — Admitidos Após' },
]

export function SituacaoFinalPainel() {
  const { schoolId, allSchools } = useAuth()
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [anoLetivoId, setAnoLetivoId] = useState('')
  const [validando, setValidando] = useState(false)
  const [exportando, setExportando] = useState(false)
  const [resultado, setResultado] = useState<ResultadoValidacaoSituacaoFinal | null>(null)
  const [exportResult, setExportResult] = useState<ResultadoExportacaoSituacaoFinal | null>(null)

  const effectiveSchoolId = schoolId || selectedSchoolId

  useEffect(() => {
    if (!schoolId && allSchools.length > 0 && !selectedSchoolId) {
      setSelectedSchoolId(allSchools[0].id)
    }
  }, [schoolId, allSchools, selectedSchoolId])

  useEffect(() => {
    getAnosLetivosAtivos(effectiveSchoolId).then(setAnosLetivos).catch(() => {})
  }, [effectiveSchoolId])

  useEffect(() => {
    if (anosLetivos.length > 0 && !anoLetivoId) {
      setAnoLetivoId(anosLetivos[0].id)
    }
  }, [anosLetivos, anoLetivoId])

  const handleValidar = async () => {
    if (!effectiveSchoolId || !anoLetivoId) {
      toast.error('Selecione a escola e o ano letivo')
      return
    }
    setValidando(true)
    setExportResult(null)
    try {
      const res = await validarSituacaoFinal(effectiveSchoolId, anoLetivoId)
      setResultado(res)
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao validar')
    } finally {
      setValidando(false)
    }
  }

  const handleExportar = async () => {
    if (!effectiveSchoolId || !anoLetivoId) {
      toast.error('Selecione a escola e o ano letivo')
      return
    }
    setExportando(true)
    try {
      const res = await exportarSituacaoFinal(effectiveSchoolId, anoLetivoId)
      setExportResult(res)
      if (res.sucesso && res.arquivo) {
        const blob = new Blob([res.arquivo.conteudo], { type: 'text/plain;charset=ISO-8859-1' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = res.arquivo.nome
        a.click()
        URL.revokeObjectURL(url)
      } else if (!res.sucesso && res.erros && res.erros.length > 0) {
        toast.error(`${res.erros.length} inconsistência(s) impedem a exportação`)
      }
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao exportar')
    } finally {
      setExportando(false)
    }
  }

  const tabs: ModernTabItem[] = REGISTRO_TABS.map((t) => ({
    ...t,
    badge: resultado?.erros_por_registro[t.value as keyof typeof resultado.erros_por_registro]?.length ?? 0,
  }))

  return (
    <>
      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-end gap-4 pt-6">
          {!schoolId && allSchools.length > 0 && (
            <div className="w-72">
              <Select
                value={selectedSchoolId || ''}
                onValueChange={(v) => { setSelectedSchoolId(v); setResultado(null); setExportResult(null) }}
              >
                <SelectTrigger className="max-w-[280px]">
                  <SelectValue placeholder="Escola" className="truncate" />
                </SelectTrigger>
                <SelectContent>
                  {allSchools.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.nome_escola}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="w-56">
            <Select
              value={anoLetivoId}
              onValueChange={(v) => { setAnoLetivoId(v); setResultado(null); setExportResult(null) }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o ano letivo" />
              </SelectTrigger>
              <SelectContent>
                {anosLetivos.map((a) => (
                  <SelectItem key={a.id} value={a.id}>{a.descricao}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleValidar} disabled={validando || !anoLetivoId || !effectiveSchoolId} className="gap-2">
            {validando ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            {resultado ? 'Validar novamente' : 'Validar'}
          </Button>
          <Button
            onClick={handleExportar}
            disabled={exportando || !resultado?.valido}
            variant="accent"
            className="gap-2"
            title={!resultado?.valido ? 'Corrija todos os erros antes de exportar' : undefined}
          >
            {exportando ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
            Exportar
          </Button>
        </CardContent>
      </Card>

      {resultado && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant={resultado.valido ? 'default' : 'destructive'} className="text-sm px-3 py-1">
              {resultado.valido ? '0 inconsistências' : `${resultado.total_erros} inconsistências`}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {resultado.valido ? 'Pronto para exportar' : 'Corrija os erros antes de exportar'}
            </span>
          </div>

          {resultado.resumo && (
            <div className="flex flex-wrap gap-3">
              <StatusBadge status="primary" className="text-[13px]">
                {resultado.resumo.total_matriculas_90} matrículas (Registro 90)
              </StatusBadge>
              <StatusBadge status="warning" className="text-[13px]">
                {resultado.resumo.total_admitidos_apos_91} admitidos após (Registro 91)
              </StatusBadge>
              <StatusBadge status="destructive" className="text-[13px]">
                {resultado.resumo.total_sem_inep} alunos sem código INEP
              </StatusBadge>
            </div>
          )}

          <ModernTabs tabs={tabs} scroll={true} fullWidth urlSync={false}>
            <ValidacaoAba
              titulo="Registro 89 — Escola e Gestor"
              registro="89"
              erros={resultado.erros_por_registro.registro89}
            />
            <ValidacaoAba
              titulo="Registro 90 — Situação do Aluno"
              registro="90"
              erros={resultado.erros_por_registro.registro90}
            />
            <ValidacaoAba
              titulo="Registro 91 — Admitidos Após"
              registro="91"
              erros={resultado.erros_por_registro.registro91}
            />
          </ModernTabs>
        </div>
      )}

      {exportResult?.sucesso && exportResult.arquivo && (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="pt-4">
            <p className="text-sm text-success font-medium">
              Arquivo gerado com sucesso: {exportResult.arquivo.total_linhas} linhas, {exportResult.arquivo.tamanho_bytes} bytes
              {' '}({exportResult.arquivo.registros.registro90} × 90, {exportResult.arquivo.registros.registro91} × 91)
            </p>
          </CardContent>
        </Card>
      )}
    </>
  )
}