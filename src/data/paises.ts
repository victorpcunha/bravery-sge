import raw from './paises.json'

export interface Pais {
  codigo: number
  nome: string
  nacionalidade: string
}

export const paises: Pais[] = (raw as any[]).map(p => ({
  codigo: p['Código'],
  nome: p['Nome do país'],
  nacionalidade: p['Nacionalidade'] || '',
}))

export function getPaisByCodigo(codigo: number | string): Pais | undefined {
  const c = Number(codigo)
  return paises.find(p => p.codigo === c)
}

export function searchPaises(query: string): Pais[] {
  const q = query.toLowerCase()
  return paises.filter(
    p => p.nome.toLowerCase().includes(q) || p.nacionalidade.toLowerCase().includes(q)
  )
}
