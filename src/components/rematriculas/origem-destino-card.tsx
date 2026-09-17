'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AnoLetivo } from '@/lib/actions/calendarios'
import type { EtapaEnsino } from '@/lib/actions/etapas-ensino'
import { SITUACOES_MATRICULA } from '@/lib/situacoes-matricula'
import type { SituacaoRematricula } from '@/lib/actions/rematriculas'

export type TurmaAtiva = {
  id: string
  nome: string
  etapas_ensino_ids: string[] | null
  multietapa?: boolean | null
}

export type OrigemState = {
  etapaId: string
  turmaId: string
  situacao: SituacaoRematricula | ''
}

export type DestinoState = {
  etapaId: string
  turmaId: string
  dataMatricula: string
}

export type FamiliaSituacao = 'aprovado' | 'reprovado' | null

export const SITUACOES_REMATRICULA: SituacaoRematricula[] = [
  'Aprovado',
  'Aprovado por conselho de classe',
  'Aprovado concluinte',
  'Reprovado',
  'Reprovado por frequência',
]

export function familiaDe(situacao: SituacaoRematricula | ''): FamiliaSituacao {
  if (!situacao) return null
  if (situacao.startsWith('Aprovado')) return 'aprovado'
  if (situacao.startsWith('Reprovado')) return 'reprovado'
  return null
}

export function hojeLocal(): string {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${dia}`
}

type Props = {
  anos: AnoLetivo[]
  anoOrigemId: string
  anoDestinoId: string
  etapasOrigem: EtapaEnsino[]
  turmasOrigem: TurmaAtiva[]
  etapasDestino: EtapaEnsino[]
  turmasDestino: TurmaAtiva[]
  origem: OrigemState
  destino: DestinoState
  onOrigemChange: (o: OrigemState) => void
  onDestinoChange: (d: DestinoState) => void
  carregando?: boolean
}

function AnoTravado({ label, anos, value, vazio }: { label: string; anos: AnoLetivo[]; value: string; vazio: string }) {
  const ano = anos.find(a => a.id === value)
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value || undefined} disabled>
        <SelectTrigger>
          <SelectValue placeholder={vazio}>
            {ano ? (ano.descricao || 'Ano letivo') : undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {ano && <SelectItem value={ano.id}>{ano.descricao || 'Ano letivo'}</SelectItem>}
        </SelectContent>
      </Select>
    </div>
  )
}

export default function OrigemDestinoCard({
  anos,
  anoOrigemId,
  anoDestinoId,
  etapasOrigem,
  turmasOrigem,
  etapasDestino,
  turmasDestino,
  origem,
  destino,
  onOrigemChange,
  onDestinoChange,
  carregando,
}: Props) {
  const familia = familiaDe(origem.situacao)
  const codigoOrigem = etapasOrigem.find(e => e.id === origem.etapaId)?.etapa_codigo ?? null

  const turmasOrigemFiltradas = turmasOrigem.filter(t =>
    !origem.etapaId || (t.etapas_ensino_ids || []).includes(origem.etapaId)
  )

  // Consistência Situação × Etapa: aprovado avança (exclui origem), reprovado permanece (só origem)
  const etapasDestinoOpcoes = !familia || codigoOrigem === null
    ? []
    : familia === 'aprovado'
      ? etapasDestino.filter(e => e.etapa_codigo !== codigoOrigem)
      : etapasDestino.filter(e => e.etapa_codigo === codigoOrigem)

  const turmasDestinoFiltradas = turmasDestino.filter(t =>
    !destino.etapaId || (t.etapas_ensino_ids || []).includes(destino.etapaId)
  )

  const destinoHabilitado = familia !== null

  function handleOrigemEtapa(etapaId: string) {
    onOrigemChange({ ...origem, etapaId, turmaId: '' })
    onDestinoChange({ ...destino, etapaId: '', turmaId: '' })
  }

  function handleSituacao(s: SituacaoRematricula | '') {
    const fam = familiaDe(s)
    if (fam === 'reprovado') {
      // Trava o destino na etapa de origem (mesmo código no novo ano)
      const cod = etapasOrigem.find(e => e.id === origem.etapaId)?.etapa_codigo ?? null
      const match = cod === null ? undefined : etapasDestino.find(e => e.etapa_codigo === cod)
      onDestinoChange({ ...destino, etapaId: match?.id || '', turmaId: '' })
    } else {
      onDestinoChange({ ...destino, etapaId: '', turmaId: '' })
    }
    onOrigemChange({ ...origem, situacao: s })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Subcard Origem */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-4">
        <h3 className="text-[16px] font-semibold">Origem</h3>
        <AnoTravado label="Ano Letivo de Origem" anos={anos} value={anoOrigemId} vazio="Nenhum ano encerrado" />
        <div className="space-y-2">
          <Label>Etapa de Ensino de Origem</Label>
          <Select value={origem.etapaId || undefined} onValueChange={handleOrigemEtapa} disabled={!anoOrigemId || carregando}>
            <SelectTrigger><SelectValue placeholder="Selecione a etapa" /></SelectTrigger>
            <SelectContent>
              {etapasOrigem.map(e => (
                <SelectItem key={e.id} value={e.id}>{e.etapa_nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Turma de Origem</Label>
          <Select
            value={origem.turmaId || undefined}
            onValueChange={(v) => onOrigemChange({ ...origem, turmaId: v })}
            disabled={!origem.etapaId || carregando}
          >
            <SelectTrigger><SelectValue placeholder={origem.etapaId ? 'Selecione a turma' : 'Selecione a etapa primeiro'} /></SelectTrigger>
            <SelectContent>
              {turmasOrigemFiltradas.map(t => (
                <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Situação</Label>
          <Select
            value={origem.situacao || undefined}
            onValueChange={(v) => handleSituacao(v as SituacaoRematricula)}
            disabled={!origem.turmaId || carregando}
          >
            <SelectTrigger><SelectValue placeholder="Selecione a situação" /></SelectTrigger>
            <SelectContent>
              {SITUACOES_REMATRICULA.map(s => (
                <SelectItem key={s} value={s}>{SITUACOES_MATRICULA[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[13px] text-muted-foreground">Somente situações que geram rematrícula: Aprovado e Reprovado.</p>
        </div>
      </div>

      {/* Subcard Destino */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-4">
        <h3 className="text-[16px] font-semibold">Destino</h3>
        {!destinoHabilitado && (
          <p className="text-[13px] text-muted-foreground">Selecione a Situação na origem para habilitar o destino.</p>
        )}
        <AnoTravado label="Ano Letivo de Destino" anos={anos} value={anoDestinoId} vazio="Nenhum ano ativo" />
        <div className="space-y-2">
          <Label>Etapa de Ensino de Destino</Label>
          <Select
            value={destino.etapaId || undefined}
            onValueChange={(v) => onDestinoChange({ ...destino, etapaId: v, turmaId: '' })}
            disabled={!destinoHabilitado || !anoDestinoId || carregando || familia === 'reprovado'}
          >
            <SelectTrigger>
              <SelectValue placeholder={!destinoHabilitado ? 'Aguardando situação' : 'Selecione a etapa'} />
            </SelectTrigger>
            <SelectContent>
              {etapasDestinoOpcoes.map(e => (
                <SelectItem key={e.id} value={e.id}>{e.etapa_nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {familia === 'aprovado' && (
            <p className="text-[13px] text-muted-foreground">Aluno aprovado avança de etapa — a etapa de origem não está disponível.</p>
          )}
          {familia === 'reprovado' && (
            <p className="text-[13px] text-muted-foreground">
              {destino.etapaId
                ? 'Aluno reprovado permanece na mesma etapa.'
                : 'A etapa de origem não existe no novo ano letivo — crie a etapa/turma antes de rematricular.'}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Turma de Destino</Label>
          <Select
            value={destino.turmaId || undefined}
            onValueChange={(v) => onDestinoChange({ ...destino, turmaId: v })}
            disabled={!destino.etapaId || carregando}
          >
            <SelectTrigger><SelectValue placeholder={destino.etapaId ? 'Selecione a turma' : 'Selecione a etapa primeiro'} /></SelectTrigger>
            <SelectContent>
              {turmasDestinoFiltradas.map(t => (
                <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {destino.etapaId && turmasDestinoFiltradas.length === 0 && (
            <p className="text-[13px] text-muted-foreground">Nenhuma turma criada para esta etapa no novo ano — crie a turma antes de rematricular.</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Data de Matrícula</Label>
          <Input
            type="date"
            value={destino.dataMatricula}
            max={hojeLocal()}
            onChange={(e) => onDestinoChange({ ...destino, dataMatricula: e.target.value })}
            disabled={!destinoHabilitado || carregando}
          />
          <p className="text-[13px] text-muted-foreground">Aplicada a todas as rematrículas do lote. Não permite data futura.</p>
        </div>
      </div>
    </div>
  )
}
