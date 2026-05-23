import raw from './areas-conhecimento.json'

export interface AreaConhecimento {
  codigo: number
  nome: string
}

export const areasConhecimento: AreaConhecimento[] = raw as AreaConhecimento[]

export function getAreaConhecimentoByCodigo(codigo: number | string): AreaConhecimento | undefined {
  const c = Number(codigo)
  return areasConhecimento.find(a => a.codigo === c)
}
