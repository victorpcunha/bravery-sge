// ---------------------------------------------------------------------------
// Derivacao das areas do conhecimento (Registro 20, campos 39-65) a partir
// dos nomes das disciplinas vinculadas a turma (turmas_disciplinas).
//
// FONTE UNICA usada pela exportacao (censo.ts) e pela validacao
// (censo-regras.ts) - as duas precisam enxergar as mesmas areas.
//
// O matching e insensivel a acentos: "Matematica" casa com "matematica",
// "Ciencias" com "ciencias" etc. Por isso as palavras-chave ja estao
// armazenadas sem acento (este arquivo e 100% ASCII de proposito).
// ---------------------------------------------------------------------------

export const AREA_NOME_KEYWORDS: Record<string, string> = {
  'quimica': 'area_quimica', 'fisica': 'area_fisica', 'matematica': 'area_matematica_turma',
  'biologia': 'area_biologia', 'ciencias': 'area_ciencias', 'portugues': 'area_portugues',
  'ingles': 'area_ingles', 'espanhol': 'area_espanhol',
  'arte': 'area_arte', 'artes': 'area_arte',
  'educacao fisica': 'area_ed_fisica', 'ed. fisica': 'area_ed_fisica',
  'historia': 'area_historia', 'geografia': 'area_geografia',
  'filosofia': 'area_filosofia', 'informatica': 'area_informatica',
  'computacao': 'area_informatica', 'libras': 'area_libras',
  'ensino religioso': 'area_ensino_religioso',
  'sociologia': 'area_sociologia', 'frances': 'area_frances',
  'estagio': 'area_estagio', 'projeto de vida': 'area_projeto_vida',
}

export function normalizarNomeDisciplina(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const KEYWORDS_NORMALIZADAS: [string, string][] = Object.entries(AREA_NOME_KEYWORDS).map(
  ([kw, area]) => [normalizarNomeDisciplina(kw), area],
)

/**
 * Deriva o conjunto de áreas (`area_*`) a partir dos nomes das disciplinas
 * vinculadas a turma. Retorna conjunto vazio quando nada casa.
 *
 * Exceção: "Educação Física" (área 11) contém "física" mas NÃO gera a área
 * 2-Física (disciplina do EM) — sem isso, todo 1º ano com Ed. Física
 * acusaria área incompatível na matriz por etapa.
 */
export function derivarAreasDeDisciplinas(
  nomes: (string | null | undefined)[],
): Set<string> {
  const areas = new Set<string>()
  for (const raw of nomes) {
    if (!raw) continue
    const nome = normalizarNomeDisciplina(raw)
    const eEdFisica = nome.includes('educacao fisica') || nome.includes('ed.fisica')
    for (const [kw, area] of KEYWORDS_NORMALIZADAS) {
      if (kw === 'fisica' && eEdFisica) continue
      if (nome.includes(kw)) areas.add(area)
    }
  }
  return areas
}
