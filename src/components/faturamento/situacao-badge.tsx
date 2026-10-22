import { StatusBadge } from '@/components/feedback/status-badge'
import type {
  SituacaoMatriculaFat,
  SituacaoMensalidadeDerivada,
} from '@/lib/faturamento-tipos'
import { cn } from '@/lib/utils'

const ROTULO_MENSALIDADE: Record<SituacaoMensalidadeDerivada, string> = {
  pendente: 'Pendente',
  pago: 'Pago',
  cancelado: 'Cancelado',
  isento: 'Isento',
  vencida: 'Vencida',
}

const STATUS_MENSALIDADE: Record<
  SituacaoMensalidadeDerivada,
  'success' | 'warning' | 'destructive' | 'info' | 'primary' | 'muted'
> = {
  pendente: 'warning',
  pago: 'success',
  cancelado: 'muted',
  isento: 'info',
  vencida: 'destructive',
}

const ROTULO_MATRICULA: Record<SituacaoMatriculaFat, string> = {
  em_dia: 'Em dia',
  pendente: 'Pendente',
  vencida: 'Vencida',
  sem_plano: 'Sem plano',
}

const STATUS_MATRICULA: Record<
  SituacaoMatriculaFat,
  'success' | 'warning' | 'destructive' | 'info' | 'primary' | 'muted'
> = {
  em_dia: 'success',
  pendente: 'warning',
  vencida: 'destructive',
  sem_plano: 'muted',
}

export function MensalidadeBadge({
  situacao,
  className,
}: {
  situacao: SituacaoMensalidadeDerivada
  className?: string
}) {
  return (
    <StatusBadge status={STATUS_MENSALIDADE[situacao]} className={cn(className)}>
      {ROTULO_MENSALIDADE[situacao]}
    </StatusBadge>
  )
}

export function SituacaoMatriculaBadge({
  situacao,
  className,
}: {
  situacao: SituacaoMatriculaFat
  className?: string
}) {
  return (
    <StatusBadge status={STATUS_MATRICULA[situacao]} className={cn(className)}>
      {ROTULO_MATRICULA[situacao]}
    </StatusBadge>
  )
}
