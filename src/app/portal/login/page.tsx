import { PortalOrientacao } from '@/components/portal/portal-orientacao'

// Rota genérica sem slug (US3): só orientação — sem formulário, sem dados.
// O acesso ao portal exige o link completo da escola (/portal/[slug]).
export default function PortalLoginGenericoPage() {
  return <PortalOrientacao variante="orientacao" />
}
