'use client'

import * as React from 'react'
import { listarProfissionaisSelecionaveis } from '@/lib/actions/ocorrencias'
import { MultiSelectField } from './multi-select-field'

type ProfissionaisSelectFieldProps = {
  schoolId: string | null
  values: string[]
  onChange: (values: string[]) => void
  pessoaId?: string | null
  label?: string
  disabled?: boolean
  /** Nomes já conhecidos (ex.: edição) para exibir chips de inativos */
  nomesIniciais?: Record<string, string>
  labelClassName?: string
  /** false = seleção única (uso em filtros). Default: true */
  multiple?: boolean
}

export function ProfissionaisSelectField({
  schoolId,
  values,
  onChange,
  pessoaId,
  label = 'Profissionais da ocorrência',
  disabled = false,
  nomesIniciais,
  labelClassName,
  multiple = true,
}: ProfissionaisSelectFieldProps) {
  const [base, setBase] = React.useState<Array<{ value: string; label: string }>>([])

  React.useEffect(() => {
    if (!schoolId) {
      setBase([])
      return
    }
    let ativo = true
    listarProfissionaisSelecionaveis(schoolId, pessoaId)
      .then(list => {
        if (ativo) setBase(list.map(p => ({ value: p.id, label: p.nome })))
      })
      .catch(() => {
        if (ativo) setBase([])
      })
    return () => {
      ativo = false
    }
  }, [schoolId, pessoaId])

  const options = React.useMemo(() => {
    const mapa = new Map<string, string>()
    for (const [id, nome] of Object.entries(nomesIniciais ?? {})) {
      if (values.includes(id)) mapa.set(id, nome)
    }
    for (const o of base) mapa.set(o.value, o.label)
    return [...mapa.entries()].map(([value, label]) => ({ value, label }))
  }, [base, nomesIniciais, values])

  return (
    <MultiSelectField
      label={label}
      labelClassName={labelClassName}
      single={!multiple}
      showClearAll={multiple}
      options={options}
      values={values}
      onChange={onChange}
      disabled={disabled || !schoolId}
      placeholder="Selecione os profissionais..."
      searchPlaceholder="Buscar profissional..."
      emptyMessage="Nenhum profissional ativo encontrado."
    />
  )
}
