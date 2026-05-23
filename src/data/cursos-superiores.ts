import raw from './cursos-superiores.json'

export interface CursoSuperior {
  codigo: string
  nome: string
  nivel: string
  areaGeral: string
  areaEspecifica: string
  areaDetalhada: string
}

export const cursosSuperiores: CursoSuperior[] = raw as CursoSuperior[]

export function getCursoByCodigo(codigo: string): CursoSuperior | undefined {
  return cursosSuperiores.find(c => c.codigo === codigo)
}

export function searchCursos(query: string): CursoSuperior[] {
  const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return cursosSuperiores.filter(c =>
    c.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q) ||
    c.codigo.includes(q)
  )
}
