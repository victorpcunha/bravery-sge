import raw from './povos-indigenas.json'

export interface PovoIndigena {
  codigo: number
  nome: string
}

export const povosIndigenas: PovoIndigena[] = raw as PovoIndigena[]

export function getPovoByCodigo(codigo: number | string): PovoIndigena | undefined {
  const c = Number(codigo)
  return povosIndigenas.find(p => p.codigo === c)
}

export function searchPovos(query: string): PovoIndigena[] {
  const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return povosIndigenas.filter(p =>
    p.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q)
  )
}
