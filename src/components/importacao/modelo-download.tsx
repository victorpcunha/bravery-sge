'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import {
  CABECALHO_ALUNO,
  CABECALHO_PROFISSIONAL,
  rotuloTipo,
  type TipoImportacao,
} from '@/lib/importacao-modelos'

const EXEMPLO_ALUNO = [
  'Maria Silva Santos',
  '11144477735',
  '12/03/2018',
  'Feminino',
  '',
]

const EXEMPLO_PROFISSIONAL = [
  'Carlos Souza',
  '12345678909',
  '20/07/1985',
  'Masculino',
  'carlos.souza@escola.edu.br',
]

function gerarCsv(tipo: TipoImportacao): string {
  const cabecalho = tipo === 'aluno' ? CABECALHO_ALUNO : CABECALHO_PROFISSIONAL
  const exemplo = tipo === 'aluno' ? EXEMPLO_ALUNO : EXEMPLO_PROFISSIONAL
  return `\uFEFF${[...cabecalho].join(';')}\n${exemplo.join(';')}\n`
}

export function ModeloDownload({ tipo }: { tipo: TipoImportacao }) {
  function baixar() {
    const blob = new Blob([gerarCsv(tipo)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = tipo === 'aluno' ? 'modelo-alunos.csv' : 'modelo-profissionais.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <Button type="button" variant="outline" className="min-h-[44px]" onClick={baixar}>
      <Download className="h-4 w-4" aria-hidden="true" />
      Baixar modelo de {rotuloTipo(tipo).toLowerCase()}
    </Button>
  )
}
