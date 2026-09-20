'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileUp, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import {
  MAX_LINHAS_LOTE,
  validarCabecalho,
  type LinhaArquivo,
  type TipoImportacao,
} from '@/lib/importacao-modelos'

type ArquivoUploadProps = {
  tipo: TipoImportacao
  disabled?: boolean
  onArquivoLido: (nomeArquivo: string, linhas: LinhaArquivo[], cabecalho: string[]) => void
  onErroLeitura: (mensagem: string) => void
  onLimpar: () => void
  arquivoAtual?: string | null
}

function detectarSeparador(texto: string): ';' | ',' {
  const primeiraLinha = texto.split(/\r?\n/, 1)[0] || ''
  const pontoVirgula = (primeiraLinha.match(/;/g) || []).length
  const virgula = (primeiraLinha.match(/,/g) || []).length
  if (pontoVirgula === 0 && virgula === 0) return ';'
  return pontoVirgula >= virgula ? ';' : ','
}

export function ArquivoUpload({ tipo, disabled, onArquivoLido, onErroLeitura, onLimpar, arquivoAtual }: ArquivoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [lendo, setLendo] = useState(false)

  function limparSelecao() {
    if (inputRef.current) inputRef.current.value = ''
    onLimpar()
  }

  async function handleArquivo(file: File | undefined) {
    if (!file) return
    const ehXlsx = /\.xlsx$/i.test(file.name)
    if (!/\.csv$/i.test(file.name) && !ehXlsx) {
      onErroLeitura('Formato não aceito. Envie um arquivo .csv ou .xlsx gerado a partir do modelo oficial.')
      return
    }
    setLendo(true)
    try {
      const XLSX = await import('xlsx')
      let workbook: import('xlsx').WorkBook
      if (ehXlsx) {
        workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' })
      } else {
        const semBOM = (await file.text()).replace(/^\uFEFF/, '')
        if (!semBOM.trim()) {
          onErroLeitura('O arquivo está vazio. Preencha ao menos uma linha além do cabeçalho.')
          return
        }
        workbook = XLSX.read(semBOM, {
          type: 'string',
          codepage: 65001,
          FS: detectarSeparador(semBOM),
        })
      }
      // Modelo .xlsx oficial usa a aba "Preencher"; demais arquivos, a primeira aba
      const nomeAba = workbook.SheetNames.includes('Preencher') ? 'Preencher' : workbook.SheetNames[0]
      const planilha = workbook.Sheets[nomeAba]
      if (!planilha) {
        onErroLeitura('Não foi possível ler o conteúdo do arquivo. Confira se é um CSV ou Excel válido.')
        return
      }
      // raw:false mantém tudo como texto (preserva zeros à esquerda, ex.: CPF)
      const matriz = XLSX.utils.sheet_to_json<unknown[]>(planilha, { header: 1, defval: '', blankrows: false, raw: false }) as unknown[][]
      if (matriz.length < 2) {
        onErroLeitura('O arquivo só tem cabeçalho. Preencha ao menos uma linha para importar.')
        return
      }
      const cabecalho = matriz[0].map((c) => String(c ?? ''))
      const errosCabecalho = validarCabecalho(tipo, cabecalho)
      if (errosCabecalho.length > 0) {
        onErroLeitura(`${errosCabecalho[0].mensagem} ${errosCabecalho[0].orientacao}`)
        return
      }
      const corpo = matriz.slice(1).filter((r) => r.some((c) => String(c ?? '').trim() !== ''))
      if (corpo.length === 0) {
        onErroLeitura('O arquivo só tem cabeçalho. Preencha ao menos uma linha para importar.')
        return
      }
      if (corpo.length > MAX_LINHAS_LOTE) {
        onErroLeitura(`O arquivo tem ${corpo.length} linhas (limite de ${MAX_LINHAS_LOTE}). Divida em arquivos menores.`)
        return
      }
      const linhas: LinhaArquivo[] = corpo.map((r, idx) => ({
        numeroLinha: idx + 2,
        valores: r.map((c) => String(c ?? '')),
      }))
      onArquivoLido(file.name, linhas, cabecalho)
    } catch {
      toast.error('Não foi possível ler o arquivo. Confira se é um CSV ou Excel válido.')
      onErroLeitura('Não foi possível ler o arquivo. Confira se é um CSV ou Excel válido e tente novamente.')
    } finally {
      setLendo(false)
    }
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        className="hidden"
        disabled={disabled || lendo}
        onChange={(e) => {
          void handleArquivo(e.target.files?.[0])
        }}
      />
      {arquivoAtual ? (
        <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/30 px-4 py-3">
          <p className="min-w-0 truncate text-[14px] font-medium text-foreground" title={arquivoAtual}>
            {arquivoAtual}
          </p>
          <Button type="button" variant="ghost" size="icon-sm" onClick={limparSelecao} disabled={disabled || lendo} aria-label="Remover arquivo">
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full min-h-[44px]"
          disabled={disabled || lendo}
          onClick={() => inputRef.current?.click()}
        >
          {lendo ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <FileUp className="h-4 w-4" aria-hidden="true" />
          )}
          {lendo ? 'Lendo arquivo…' : `Selecionar arquivo de ${tipo === 'aluno' ? 'alunos' : 'profissionais'} (.csv ou .xlsx)`}
        </Button>
      )}
      <p className="text-[13px] text-muted-foreground">
        Arquivo .csv (UTF-8, separado por ponto e vírgula) ou .xlsx, no layout do modelo oficial.
      </p>
    </div>
  )
}
