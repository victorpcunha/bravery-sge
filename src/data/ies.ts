import raw from './ies.json'

export interface IES {
  codigo: number
  nome: string
  situacao: string
  categoria: number
  municipio: string
}

export const iesList: IES[] = raw as IES[]

export function getIESByCodigo(codigo: number | string): IES | undefined {
  const c = Number(codigo)
  return iesList.find(i => i.codigo === c)
}

export function searchIES(query: string): IES[] {
  const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return iesList.filter(i =>
    i.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q)
  )
}
