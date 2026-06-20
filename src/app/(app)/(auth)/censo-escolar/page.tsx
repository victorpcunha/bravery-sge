'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ValidacaoResumo } from '@/components/censo/validacao-resumo'
import { ValidacaoAba } from '@/components/censo/validacao-aba'
import { ResultadoValidacao, ResultadoExportacao } from '@/lib/actions/censo-types'
import { validarCenso, exportarCenso } from '@/lib/actions/censo'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
import { toast } from 'sonner'
import { FileDown, Loader2, Search } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'

const REGISTRO_TABS = [
  { key: 'registro00', label: 'Registro 00 — Dados da Escola' },
  { key: 'registro10', label: 'Registro 10 — Infraestrutura' },
  { key: 'registro20', label: 'Registro 20 — Turmas' },
  { key: 'registro30', label: 'Registro 30 — Pessoas' },
  { key: 'registro40', label: 'Registro 40 — Gestores' },
  { key: 'registro50', label: 'Registro 50 — Profissionais × Turma' },
  { key: 'registro60', label: 'Registro 60 — Matrículas' },
]

export default function CensoEscolarPage() {
  const { schoolId, allSchools } = useAuth()
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [anoLetivoId, setAnoLetivoId] = useState('')
  const [validando, setValidando] = useState(false)
  const [exportando, setExportando] = useState(false)
  const [resultado, setResultado] = useState<ResultadoValidacao | null>(null)
  const [tab, setTab] = useState('registro00')
  const [exportResult, setExportResult] = useState<ResultadoExportacao | null>(null)

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
      const res = await validarCenso(effectiveSchoolId, anoLetivoId)
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
      const res = await exportarCenso(effectiveSchoolId, anoLetivoId)
      setExportResult(res)
      if (res.sucesso && res.arquivo) {
        const blob = new Blob([res.arquivo.conteudo], { type: 'text/plain;charset=ISO-8859-1' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = res.arquivo.nome
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao exportar')
    } finally {
      setExportando(false)
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Censo Escolar — Matrícula Inicial 2026"
        description="Valide os dados da escola contra as regras do INEP/MEC e exporte o arquivo para o EducaCenso."
      />

      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-end gap-4 pt-6">
          {!schoolId && allSchools.length > 0 && (
            <div className="w-56">
              <Select value={selectedSchoolId || ''} onValueChange={(v) => { setSelectedSchoolId(v); setResultado(null); setExportResult(null) }}>
                <SelectTrigger>
                  <SelectValue placeholder="Escola" />
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
            <Select value={anoLetivoId} onValueChange={(v) => { setAnoLetivoId(v); setResultado(null); setExportResult(null) }}>
              <SelectTrigger>
                <SelectValue placeholder="Ano letivo" />
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
          <ValidacaoResumo resultado={resultado} />

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="flex-wrap h-auto gap-1">
              {REGISTRO_TABS.map((t) => {
                const erros = resultado.erros_por_registro[t.key as keyof typeof resultado.erros_por_registro]
                const count = erros?.length ?? 0
                return (
                  <TabsTrigger key={t.key} value={t.key} className="text-xs gap-1">
                    {t.label}
                    {count > 0 && (
                      <span className="inline-flex items-center justify-center size-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-medium">
                        {count}
                      </span>
                    )}
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {REGISTRO_TABS.map((t) => (
              <TabsContent key={t.key} value={t.key} className="mt-3">
                <ValidacaoAba
                  titulo={t.label}
                  registro={t.key}
                  erros={resultado.erros_por_registro[t.key as keyof typeof resultado.erros_por_registro] ?? []}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}

      {exportResult?.sucesso && exportResult.arquivo && (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="pt-4">
            <p className="text-sm text-success font-medium">
              Arquivo gerado com sucesso: {exportResult.arquivo.total_linhas} linhas, {exportResult.arquivo.tamanho_bytes} bytes
            </p>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  )
}
