'use client'

import * as React from 'react'
import { buscarPessoasMatriculadas } from '@/lib/actions/painel-pessoa'
import { MultiSelectField, type MultiSelectOption } from './multi-select-field'

type AlunosSelectFieldProps = {
  schoolId: string | null
  values: string[]
  onChange: (values: string[]) => void
  label?: string
  disabled?: boolean
  /** false = seleção única (uso em filtros). Default: true */
  multiple?: boolean
  /** Nomes já conhecidos (ex.: edição) para exibir chips antes de buscar */
  nomesIniciais?: Record<string, string>
  labelClassName?: string
}

export function AlunosSelectField({
  schoolId,
  values,
  onChange,
  label = 'Alunos envolvidos',
  disabled = false,
  multiple = true,
  nomesIniciais,
  labelClassName,
}: AlunosSelectFieldProps) {
  const [search, setSearch] = React.useState('')
  const [resultados, setResultados] = React.useState<MultiSelectOption[]>([])
  const [buscando, setBuscando] = React.useState(false)
  const [conhecidos, setConhecidos] = React.useState(() => new Map(Object.entries(nomesIniciais ?? {})))

  React.useEffect(() => {
    if (!schoolId || search.trim().length < 3) {
      setResultados([])
      setBuscando(false)
      return
    }
    setBuscando(true)
    const t = setTimeout(() => {
      // A página já exige `gestao-academica.ocorrencias` + escopo da escola;
      // passa pessoaId nulo para não acoplar à permissão do Painel do Aluno.
      buscarPessoasMatriculadas(search.trim(), schoolId, null)
        .then(list => {
          setConhecidos(prev => {
            const next = new Map(prev)
            for (const p of list) next.set(p.id, p.nome_completo)
            return next
          })
          setResultados(list.map(p => ({ value: p.id, label: p.nome_completo })))
        })
        .catch(() => setResultados([]))
        .finally(() => setBuscando(false))
    }, 300)
    return () => clearTimeout(t)
  }, [search, schoolId])

  const options = React.useMemo(() => {
    const mapa = new Map<string, string>()
    for (const r of resultados) mapa.set(r.value, r.label)
    for (const [id, nome] of conhecidos) {
      if (values.includes(id)) mapa.set(id, nome)
    }
    return [...mapa.entries()].map(([value, label]) => ({ value, label }))
  }, [resultados, conhecidos, values])

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
      searchText={search}
      onSearchTextChange={setSearch}
      placeholder={multiple ? 'Selecione os alunos...' : 'Buscar aluno por nome...'}
      searchPlaceholder="Digite pelo menos 3 letras..."
      emptyMessage={
        buscando
          ? 'Buscando...'
          : search.trim().length < 3
            ? 'Digite pelo menos 3 letras para buscar.'
            : 'Nenhum aluno encontrado.'
      }
    />
  )
}
