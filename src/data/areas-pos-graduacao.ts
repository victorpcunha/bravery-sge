import raw from './areas-pos-graduacao.json'

export interface AreaPosGraduacao {
  codigo: number
  nome: string
}

export const areasPosGraduacao: AreaPosGraduacao[] = raw as AreaPosGraduacao[]

export function getAreaPosByCodigo(codigo: number | string): AreaPosGraduacao | undefined {
  const c = Number(codigo)
  return areasPosGraduacao.find(a => a.codigo === c)
}
