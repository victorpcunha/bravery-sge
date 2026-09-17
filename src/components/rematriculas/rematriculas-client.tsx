'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { getAnosLetivos, type AnoLetivo } from '@/lib/actions/calendarios'
import { getEtapasEnsino, type EtapaEnsino } from '@/lib/actions/etapas-ensino'
import { getTurmasAtivas } from '@/lib/actions/matriculas'
import {
  listarAlunosElegiveis,
  rematricularLote,
  type AlunoElegivel,
  type SituacaoRematricula,
  type RematricularLoteResult,
} from '@/lib/actions/rematriculas'
import { REMATRICULAS_RESOURCE } from '@/lib/rematriculas'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Repeat, ShieldAlert, Info, CircleAlert } from 'lucide-react'
import { toast } from 'sonner'
import OrigemDestinoCard, {
  type OrigemState, type DestinoState, type TurmaAtiva, hojeLocal, familiaDe,
} from './origem-destino-card'
import AlunosRematriculaList from './alunos-rematricula-list'

type Props = {
  schoolId: string | null
}

export default function RematriculasClient({ schoolId }: Props) {
  const { isSuperAdmin, allSchools, loading: authLoading, pessoaId: pessoaAuth } = useAuth()
  const { pode, loaded: permLoaded, pessoaId: pessoaPerm } = usePermissoes(schoolId || '')
  const pessoaId = pessoaPerm || pessoaAuth || null

  // US4 (T014): superadmin escolhe a escola; demais usam schoolId
  const [escolaId, setEscolaId] = useState('')
  const escolaOperacional = isSuperAdmin ? (escolaId || null) : schoolId

  const [anos, setAnos] = useState<AnoLetivo[]>([])
  const [anoOrigemId, setAnoOrigemId] = useState('')
  const [anoDestinoId, setAnoDestinoId] = useState('')
  const [etapasOrigem, setEtapasOrigem] = useState<EtapaEnsino[]>([])
  const [turmasOrigem, setTurmasOrigem] = useState<TurmaAtiva[]>([])
  const [etapasDestino, setEtapasDestino] = useState<EtapaEnsino[]>([])
  const [turmasDestino, setTurmasDestino] = useState<TurmaAtiva[]>([])
  const [carregando, setCarregando] = useState(false)

  const [origem, setOrigem] = useState<OrigemState>({ etapaId: '', turmaId: '', situacao: '' })
  const [destino, setDestino] = useState<DestinoState>({ etapaId: '', turmaId: '', dataMatricula: hojeLocal() })

  // US2 (T011): listagem de elegíveis
  const [elegiveis, setElegiveis] = useState<AlunoElegivel[]>([])
  const [jaMatriculados, setJaMatriculados] = useState(0)
  const [carregandoLista, setCarregandoLista] = useState(false)
  const [selecionados, setSelecionados] = useState<string[]>([])
  const [destinosIndividuais, setDestinosIndividuais] = useState<Record<string, string>>({})
  const [removidos, setRemovidos] = useState<string[]>([])

  // US3 (T013): salvamento em lote
  const [salvando, setSalvando] = useState(false)
  const [resultado, setResultado] = useState<RematricularLoteResult | null>(null)

  useEffect(() => {
    if (isSuperAdmin && allSchools.length === 1 && !escolaId) {
      setEscolaId(allSchools[0].id)
    }
  }, [isSuperAdmin, allSchools, escolaId])

  const carregarBase = useCallback(async (esc: string) => {
    setCarregando(true)
    try {
      const lista = await getAnosLetivos(esc)
      setAnos(lista || [])
      // Origem = encerrado mais recente; destino = ativo mais recente (lista já vem em descricao desc)
      const origemAno = (lista || []).find(a => a.status === 'encerrado') || null
      const destinoAno = (lista || []).find(a => a.status === 'ativo') || null
      setAnoOrigemId(origemAno?.id || '')
      setAnoDestinoId(destinoAno?.id || '')
      const [etO, tuO, etD, tuD] = await Promise.all([
        origemAno ? getEtapasEnsino(esc, origemAno.id) : Promise.resolve([]),
        origemAno ? getTurmasAtivas(esc, origemAno.id) : Promise.resolve([]),
        destinoAno ? getEtapasEnsino(esc, destinoAno.id) : Promise.resolve([]),
        destinoAno ? getTurmasAtivas(esc, destinoAno.id) : Promise.resolve([]),
      ])
      setEtapasOrigem(etO as EtapaEnsino[])
      setTurmasOrigem(tuO as TurmaAtiva[])
      setEtapasDestino(etD as EtapaEnsino[])
      setTurmasDestino(tuD as TurmaAtiva[])
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao carregar anos letivos')
      setAnos([])
      setAnoOrigemId('')
      setAnoDestinoId('')
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    if (escolaOperacional) {
      carregarBase(escolaOperacional)
    } else {
      setAnos([])
      setAnoOrigemId('')
      setAnoDestinoId('')
    }
    // Troca de escola/ano limpa seleções anteriores incompatíveis
    setOrigem({ etapaId: '', turmaId: '', situacao: '' })
    setDestino({ etapaId: '', turmaId: '', dataMatricula: hojeLocal() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escolaOperacional, carregarBase])

  const origemDestinoValidos =
    !!escolaOperacional &&
    !!anoOrigemId && !!anoDestinoId &&
    !!origem.etapaId && !!origem.turmaId && !!origem.situacao &&
    !!destino.etapaId && !!destino.turmaId &&
    !!destino.dataMatricula && destino.dataMatricula <= hojeLocal()

  const carregarElegiveis = useCallback(async () => {
    if (!origemDestinoValidos || !escolaOperacional) {
      setElegiveis([])
      setJaMatriculados(0)
      setSelecionados([])
      setDestinosIndividuais({})
      setRemovidos([])
      return
    }
    setCarregandoLista(true)
    try {
      const res = await listarAlunosElegiveis({
        schoolId: escolaOperacional,
        turmaOrigemId: origem.turmaId,
        situacoes: [origem.situacao as SituacaoRematricula],
        anoDestinoId,
        pessoaId,
      })
      setElegiveis(res.alunos)
      setJaMatriculados(res.jaMatriculados)
      setSelecionados(res.alunos.map(a => a.alunoId))
      setDestinosIndividuais({})
      setRemovidos([])
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao listar alunos')
      setElegiveis([])
      setJaMatriculados(0)
    } finally {
      setCarregandoLista(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escolaOperacional, anoDestinoId, origem.turmaId, origem.situacao, origemDestinoValidos])

  useEffect(() => {
    carregarElegiveis()
  }, [carregarElegiveis])

  const turmasDestinoDaEtapa = turmasDestino.filter(t =>
    !destino.etapaId || (t.etapas_ensino_ids || []).includes(destino.etapaId)
  )

  async function salvar() {
    if (!escolaOperacional) return
    const familia = familiaDe(origem.situacao)
    if (selecionados.length === 0) {
      toast.error('Selecione ao menos um aluno para rematricular.')
      return
    }
    if (!familia) {
      toast.error('Selecione a Situação na origem antes de salvar.')
      return
    }
    setSalvando(true)
    setResultado(null)
    try {
      const visiveis = elegiveis.filter(a => !removidos.includes(a.alunoId) && selecionados.includes(a.alunoId))
      const res = await rematricularLote({
        schoolId: escolaOperacional,
        anoDestinoId,
        turmaOrigemId: origem.turmaId,
        familiaSituacao: familia,
        etapaOrigemId: origem.etapaId,
        dataMatricula: destino.dataMatricula,
        itens: visiveis.map(a => ({
          alunoId: a.alunoId,
          turmaDestinoId: destinosIndividuais[a.alunoId] || destino.turmaId,
          etapaDestinoId: destino.etapaId,
        })),
        pessoaId,
      })
      setResultado(res)
      if (res.criados.length > 0) {
        toast.success(res.criados.length === 1
          ? '1 aluno rematriculado com sucesso.'
          : `${res.criados.length} alunos rematriculados com sucesso.`)
      }
      if (res.falhas.length > 0) {
        toast.error(res.falhas.length === 1
          ? '1 aluno não pôde ser rematriculado. Veja o motivo abaixo.'
          : `${res.falhas.length} alunos não puderam ser rematriculados. Veja os motivos abaixo.`)
      }
      // Recarrega a lista refletindo as novas matrículas
      await carregarElegiveis()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao salvar rematrícula.')
    } finally {
      setSalvando(false)
    }
  }

  if (authLoading || !permLoaded) {
    return (
      <>
        <PageHeader title="Rematrículas" description="Rematricule alunos do ano encerrado para o novo ano letivo" icon={Repeat} />
        <PageSection variant="default" title="Carregando...">
          <div className="space-y-3 animate-pulse">
            <div className="h-10 w-full bg-muted rounded-lg" />
            <div className="h-32 w-full bg-muted rounded-lg" />
          </div>
        </PageSection>
      </>
    )
  }

  if (!pode.visualizar(REMATRICULAS_RESOURCE)) {
    return (
      <>
        <PageHeader title="Rematrículas" description="Rematricule alunos do ano encerrado para o novo ano letivo" icon={Repeat} />
        <EmptyState
          icon={ShieldAlert}
          title="Sem permissão"
          description="Você não tem permissão para visualizar as Rematrículas."
        />
      </>
    )
  }

  return (
    <>
      <PageHeader title="Rematrículas" description="Rematricule alunos do ano encerrado para o novo ano letivo" icon={Repeat} />
      {isSuperAdmin && (
        <PageSection variant="compact" title="Unidade Escolar">
          <div className="space-y-2">
            <Label>Unidade Escolar</Label>
            <Select value={escolaId || undefined} onValueChange={setEscolaId}>
              <SelectTrigger><SelectValue placeholder="Selecione a unidade escolar" /></SelectTrigger>
              <SelectContent>
                {allSchools.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.nome_escola}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </PageSection>
      )}
      {!escolaOperacional ? (
        <EmptyState
          icon={Repeat}
          title="Selecione a unidade escolar"
          description="Escolha a unidade escolar para iniciar a rematrícula."
        />
      ) : !anoOrigemId || !anoDestinoId ? (
        <EmptyState
          icon={Repeat}
          title="Rematrícula indisponível"
          description={
            !anoOrigemId && !anoDestinoId
              ? 'É necessário um ano letivo encerrado e um ano letivo ativo com turmas criadas.'
              : !anoOrigemId
                ? 'A rematrícula exige um ano letivo encerrado.'
                : 'É preciso um ano letivo ativo com turmas criadas para receber as rematrículas.'
          }
        />
      ) : (
        <>
          <PageSection variant="default" title="Origem e Destino">
            <OrigemDestinoCard
              anos={anos}
              anoOrigemId={anoOrigemId}
              anoDestinoId={anoDestinoId}
              etapasOrigem={etapasOrigem}
              turmasOrigem={turmasOrigem}
              etapasDestino={etapasDestino}
              turmasDestino={turmasDestino}
              origem={origem}
              destino={destino}
              onOrigemChange={setOrigem}
              onDestinoChange={setDestino}
              carregando={carregando}
            />
          </PageSection>
          {origemDestinoValidos && (
            <PageSection variant="default" title="Alunos">
              {carregandoLista ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-10 w-full bg-muted rounded-lg" />
                  <div className="h-24 w-full bg-muted rounded-lg" />
                </div>
              ) : (
                <div className="space-y-3">
                  {jaMatriculados > 0 && (
                    <p className="flex items-start gap-2 text-[13px] text-muted-foreground">
                      <Info className="mt-0.5 h-4 w-4 shrink-0" />
                      {jaMatriculados === 1
                        ? '1 aluno já possui matrícula no novo ano e não aparece na lista.'
                        : `${jaMatriculados} alunos já possuem matrícula no novo ano e não aparecem na lista.`}
                    </p>
                  )}
                  <AlunosRematriculaList
                    alunos={elegiveis}
                    turmasDestino={turmasDestinoDaEtapa}
                    turmaPadraoId={destino.turmaId}
                    selecionados={selecionados}
                    destinos={destinosIndividuais}
                    removidos={removidos}
                    onToggle={(id) => setSelecionados(s =>
                      s.includes(id) ? s.filter(x => x !== id) : [...s, id]
                    )}
                    onSelecionarTodos={() => setSelecionados(
                      elegiveis.filter(a => !removidos.includes(a.alunoId)).map(a => a.alunoId)
                    )}
                    onLimparSelecao={() => setSelecionados([])}
                    onDestinoChange={(id, turmaId) => setDestinosIndividuais(d => ({ ...d, [id]: turmaId }))}
                    onRemover={(id) => {
                      setRemovidos(r => [...r, id])
                      setSelecionados(s => s.filter(x => x !== id))
                    }}
                  />
                </div>
              )}
            </PageSection>
          )}
          {resultado && resultado.falhas.length > 0 && (
            <PageSection variant="default" title="Alunos não rematriculados">
              <ul className="space-y-3">
                {resultado.falhas.map(f => (
                  <li key={f.alunoId} className="rounded-lg border border-border bg-card p-3">
                    <p className="flex items-start gap-2 text-[15px] font-semibold">
                      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                      {f.nome}
                    </p>
                    <p className="mt-1 text-[14px]">{f.motivo}</p>
                    <p className="text-[13px] text-muted-foreground">{f.proximoPasso}</p>
                  </li>
                ))}
              </ul>
            </PageSection>
          )}
          {origemDestinoValidos && elegiveis.length > 0 && (
            <div className="sticky bottom-0 z-10 border-t border-border bg-card/95 backdrop-blur px-4 py-3 flex items-center justify-end gap-3">
              <span className="text-[13px] text-muted-foreground tabular-nums">
                {selecionados.length} selecionados
              </span>
              <Button
                type="button"
                onClick={salvar}
                disabled={salvando || selecionados.length === 0}
                className="h-11 min-h-[44px]"
              >
                {salvando ? 'Salvando...' : 'Salvar Rematrícula'}
              </Button>
            </div>
          )}
        </>
      )}
    </>
  )
}
