'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { EmptyState } from '@/components/ui/empty-state'
import { FileText, BarChart3, ShieldAlert, FilePlus2, School } from 'lucide-react'
import OficiaisTab from './oficiais-tab'
import RelatoriosTab from './relatorios-tab'

type Props = {
  schoolId: string | null
  pessoaId: string | null
  podeOficiais: boolean
  podePreencher: boolean
  podeRelatorios: boolean
}

const TRIGGER_CLASS =
  'h-10 min-h-[40px] flex-none whitespace-nowrap rounded-md px-4 text-[14px] font-semibold text-foreground/80 ' +
  'transition-colors hover:bg-accent/10 hover:text-accent-foreground ' +
  'data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm ' +
  'data-active:hover:bg-primary data-active:hover:text-primary-foreground ' +
  'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-foreground/80'

export default function DocumentosTabs({
  schoolId,
  pessoaId,
  podeOficiais,
  podePreencher,
  podeRelatorios,
}: Props) {
  const [secao, setSecao] = useState<'documentos' | 'relatorios'>('documentos')
  const [sub, setSub] = useState<'oficiais' | 'preencher'>(
    podeOficiais ? 'oficiais' : 'preencher'
  )

  return (
    <Tabs value={secao} onValueChange={v => setSecao(v as 'documentos' | 'relatorios')}>
      <div className="relative -mx-4 sm:mx-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <TabsList className="mx-4 mb-6 flex h-auto min-h-[48px] w-max gap-1 rounded-lg border border-border bg-card p-1 shadow-xs">
          <TabsTrigger
            value="documentos"
            disabled={!podeOficiais && !podePreencher}
            className={TRIGGER_CLASS}
          >
            <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="relatorios" disabled={!podeRelatorios} className={TRIGGER_CLASS}>
            <BarChart3 className="h-4 w-4 mr-2" aria-hidden="true" />
            Relatórios
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="documentos" className="mt-0 focus-visible:outline-none">
        <Tabs
          value={sub}
          onValueChange={v => setSub(v as 'oficiais' | 'preencher')}
        >
          <div className="relative -mx-4 sm:mx-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <TabsList className="mx-4 mb-6 flex h-auto min-h-[44px] w-max gap-1 rounded-lg border border-border bg-muted/40 p-1">
              <TabsTrigger value="oficiais" disabled={!podeOficiais} className={TRIGGER_CLASS}>
                Documentos Oficiais
              </TabsTrigger>
              <TabsTrigger value="preencher" disabled={!podePreencher} className={TRIGGER_CLASS}>
                <FilePlus2 className="h-4 w-4 mr-2" aria-hidden="true" />
                Preenchimento Manual
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="oficiais" className="mt-0 focus-visible:outline-none">
            {podeOficiais ? (
              schoolId ? (
                <OficiaisTab schoolId={schoolId} pessoaId={pessoaId} />
              ) : (
                <EmptyState
                  icon={School}
                  title="Selecione uma unidade escolar"
                  description="Selecione a unidade escolar no seletor acima para gerar os documentos."
                />
              )
            ) : (
              <EmptyState
                icon={ShieldAlert}
                title="Sem permissão"
                description="Seu perfil não possui permissão para a seção de Documentos Oficiais. Peça ao gestor da escola para conceder o recurso 'Documentos Oficiais' ao seu perfil."
              />
            )}
          </TabsContent>

          <TabsContent value="preencher" className="mt-0 focus-visible:outline-none">
            {podePreencher ? (
              <EmptyState
                icon={FilePlus2}
                title="Documentos para Preenchimento Manual"
                description="Esta seção disponibilizará modelos em branco com o cabeçalho da Unidade Escolar para impressão. Em breve."
              />
            ) : (
              <EmptyState
                icon={ShieldAlert}
                title="Sem permissão"
                description="Seu perfil não possui permissão para a seção de Preenchimento Manual. Peça ao gestor da escola para conceder o recurso 'Documentos para Preenchimento Manual' ao seu perfil."
              />
            )}
          </TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="relatorios" className="mt-0 focus-visible:outline-none">
        {podeRelatorios ? (
          schoolId ? (
            <RelatoriosTab schoolId={schoolId} pessoaId={pessoaId} />
          ) : (
            <EmptyState
              icon={School}
              title="Selecione uma unidade escolar"
              description="Selecione a unidade escolar no seletor acima para gerar os relatórios."
            />
          )
        ) : (
<EmptyState
                icon={ShieldAlert}
                title="Sem permissão"
                description="Seu perfil não possui permissão para a seção de Relatórios. Peça ao gestor da escola para conceder o recurso 'Relatórios' ao seu perfil."
              />
            )}
      </TabsContent>
    </Tabs>
  )
}