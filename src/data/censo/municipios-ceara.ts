// Dados de municípios e distritos do Ceará conforme Tabelas Auxiliares 2026 (INEP/Censo Escolar 2026)
// Fontes: Tabela de Municípios 2026, Tabela de Distritos 2026 e Tabela de DDD 2026

export interface MunicipioCensoCeara {
  codigo: string
  nome: string
  uf: string
  ddd: string
  distritos: DistritoCensoCeara[]
}

export interface DistritoCensoCeara {
  codigo: string
  nome: string
  importCodigo: string
}

export const MUNICIPIOS_CEARA: MunicipioCensoCeara[] = [
  { codigo: '2303709', nome: 'Caucaia', uf: 'Ceará', ddd: '85', distritos: [
    { codigo: '230370905', nome: 'Caucaia', importCodigo: '05' },
    { codigo: '230370907', nome: 'Bom Princípio', importCodigo: '07' },
    { codigo: '230370910', nome: 'Catuana', importCodigo: '10' },
    { codigo: '230370915', nome: 'Guararu', importCodigo: '15' },
    { codigo: '230370917', nome: 'Jurema', importCodigo: '17' },
    { codigo: '230370920', nome: 'Mirambé', importCodigo: '20' },
    { codigo: '230370925', nome: 'Sítios Novos', importCodigo: '25' },
    { codigo: '230370930', nome: 'Tucunduba', importCodigo: '30' }
  ] },
  { codigo: '2304400', nome: 'Fortaleza', uf: 'Ceará', ddd: '85', distritos: [
    { codigo: '230440005', nome: 'Fortaleza', importCodigo: '05' }
  ] },
  { codigo: '2307650', nome: 'Maracanaú', uf: 'Ceará', ddd: '85', distritos: [
    { codigo: '230765005', nome: 'Maracanaú', importCodigo: '05' },
    { codigo: '230765030', nome: 'Pajuçara', importCodigo: '30' }
  ] }
]
