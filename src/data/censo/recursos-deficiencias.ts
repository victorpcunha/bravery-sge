// INEP Censo Escolar 2026 — Anexo 4: Recursos de Acessibilidade × Deficiências/Transtornos
// Fonte: Portaria Inep nº 291/2025 — Tabela de Compatibilidade de Recursos

type Compatibilidade = "X" | "N" | null;

export interface RecursoDeficiencia {
  recurso_campo: number;
  recurso_nome: string;
  compatibilidade: Record<string, Compatibilidade>;
}

export interface RecursoTranstorno {
  recurso_campo: number;
  recurso_nome: string;
  compatibilidade: Record<string, "X" | null>;
}

// -----------------------------------------------------------------------------
// Tabela 1: Recursos × Deficiências (13 recursos × 9 deficiências = 117 células)
// -----------------------------------------------------------------------------
// Legenda:
//   X  = Recurso compatível com a deficiência
//   N  = Recurso explicitamente NÃO aplicável (restrição INEP)
// null = Recurso não se aplica / sem relação direta
//
// Regras "N" (INEP):
//   • Tradutor Libras (39)      NUNCA para cegueira
//   • Leitura labial (40)       NUNCA para cegueira
//   • Prova em Libras (44)      NUNCA para cegueira
//   • Prova vídeo Libras (45)   NUNCA para cegueira
//   • Auxílio ledor (36)        NUNCA para surdez
//   • CD áudio (43)             NUNCA para surdez

const DEFICIENCIAS = [
  "baixa_visao",
  "cegueira",
  "visao_monocular",
  "def_auditiva",
  "surdez",
  "surdocegueira",
  "def_fisica",
  "def_intelectual",
  "tea",
] as const;

type DeficienciaKey = (typeof DEFICIENCIAS)[number];

function buildCompatibilidade(entries: Partial<Record<DeficienciaKey, Compatibilidade>>): Record<DeficienciaKey, Compatibilidade> {
  const result = {} as Record<DeficienciaKey, Compatibilidade>;
  for (const d of DEFICIENCIAS) {
    result[d] = entries[d] ?? null;
  }
  return result;
}

export const RECURSOS_DEFICIENCIAS: RecursoDeficiencia[] = [
  {
    recurso_campo: 36,
    recurso_nome: "Auxílio ledor",
    compatibilidade: buildCompatibilidade({
      baixa_visao: "X",
      cegueira: "X",
      visao_monocular: "X",
      surdez: "N",
      def_intelectual: "X",
      tea: "X",
    }),
  },
  {
    recurso_campo: 37,
    recurso_nome: "Auxílio transcrição",
    compatibilidade: buildCompatibilidade({
      baixa_visao: "X",
      cegueira: "X",
      visao_monocular: "X",
      def_fisica: "X",
      def_intelectual: "X",
      tea: "X",
    }),
  },
  {
    recurso_campo: 38,
    recurso_nome: "Guia-intérprete",
    compatibilidade: buildCompatibilidade({
      surdocegueira: "X",
    }),
  },
  {
    recurso_campo: 39,
    recurso_nome: "Tradutor intérprete de Libras",
    compatibilidade: buildCompatibilidade({
      cegueira: "N",
      def_auditiva: "X",
      surdez: "X",
      surdocegueira: "X",
    }),
  },
  {
    recurso_campo: 40,
    recurso_nome: "Leitura labial",
    compatibilidade: buildCompatibilidade({
      cegueira: "N",
      def_auditiva: "X",
      def_intelectual: "X",
      tea: "X",
    }),
  },
  {
    recurso_campo: 41,
    recurso_nome: "Prova ampliada (fonte 18)",
    compatibilidade: buildCompatibilidade({
      baixa_visao: "X",
      visao_monocular: "X",
      def_intelectual: "X",
      tea: "X",
    }),
  },
  {
    recurso_campo: 42,
    recurso_nome: "Prova superampliada (fonte 24)",
    compatibilidade: buildCompatibilidade({
      baixa_visao: "X",
    }),
  },
  {
    recurso_campo: 43,
    recurso_nome: "CD com áudio para deficiente visual",
    compatibilidade: buildCompatibilidade({
      baixa_visao: "X",
      cegueira: "X",
      visao_monocular: "X",
      surdez: "N",
    }),
  },
  {
    recurso_campo: 44,
    recurso_nome: "Prova em Libras",
    compatibilidade: buildCompatibilidade({
      cegueira: "N",
      surdez: "X",
      surdocegueira: "X",
    }),
  },
  {
    recurso_campo: 45,
    recurso_nome: "Prova em vídeo em Libras",
    compatibilidade: buildCompatibilidade({
      cegueira: "N",
      surdez: "X",
    }),
  },
  {
    recurso_campo: 46,
    recurso_nome: "Material didático adaptado",
    compatibilidade: buildCompatibilidade({
      def_intelectual: "X",
      tea: "X",
    }),
  },
  {
    recurso_campo: 47,
    recurso_nome: "Mobiliário adaptado",
    compatibilidade: buildCompatibilidade({
      def_fisica: "X",
      surdocegueira: "X",
    }),
  },
  {
    recurso_campo: 48,
    recurso_nome: "Tempo adicional para realização da prova",
    compatibilidade: buildCompatibilidade({
      baixa_visao: "X",
      cegueira: "X",
      def_auditiva: "X",
      surdez: "X",
      surdocegueira: "X",
      def_fisica: "X",
      def_intelectual: "X",
      tea: "X",
    }),
  },
];

// -----------------------------------------------------------------------------
// Tabela 2: Recursos × Transtornos (13 recursos × 6 transtornos)
// -----------------------------------------------------------------------------
// Apenas os recursos 36, 37 e 48 são compatíveis com TODOS os transtornos.
// Todos os demais recursos são nulos (não se aplicam).

const TRANSTORNOS = [
  "discalculia",
  "disgrafia",
  "dislalia",
  "dislexia",
  "tdah",
  "tpac",
] as const;

type TranstornoKey = (typeof TRANSTORNOS)[number];

function buildCompatibilidadeTranstorno(valor: "X" | null): Record<TranstornoKey, "X" | null> {
  const result = {} as Record<TranstornoKey, "X" | null>;
  for (const t of TRANSTORNOS) {
    result[t] = valor;
  }
  return result;
}

export const RECURSOS_TRANSTORNOS: RecursoTranstorno[] = [
  {
    recurso_campo: 36,
    recurso_nome: "Auxílio ledor",
    compatibilidade: buildCompatibilidadeTranstorno("X"),
  },
  {
    recurso_campo: 37,
    recurso_nome: "Auxílio transcrição",
    compatibilidade: buildCompatibilidadeTranstorno("X"),
  },
  {
    recurso_campo: 38,
    recurso_nome: "Guia-intérprete",
    compatibilidade: buildCompatibilidadeTranstorno(null),
  },
  {
    recurso_campo: 39,
    recurso_nome: "Tradutor intérprete de Libras",
    compatibilidade: buildCompatibilidadeTranstorno(null),
  },
  {
    recurso_campo: 40,
    recurso_nome: "Leitura labial",
    compatibilidade: buildCompatibilidadeTranstorno(null),
  },
  {
    recurso_campo: 41,
    recurso_nome: "Prova ampliada (fonte 18)",
    compatibilidade: buildCompatibilidadeTranstorno(null),
  },
  {
    recurso_campo: 42,
    recurso_nome: "Prova superampliada (fonte 24)",
    compatibilidade: buildCompatibilidadeTranstorno(null),
  },
  {
    recurso_campo: 43,
    recurso_nome: "CD com áudio para deficiente visual",
    compatibilidade: buildCompatibilidadeTranstorno(null),
  },
  {
    recurso_campo: 44,
    recurso_nome: "Prova em Libras",
    compatibilidade: buildCompatibilidadeTranstorno(null),
  },
  {
    recurso_campo: 45,
    recurso_nome: "Prova em vídeo em Libras",
    compatibilidade: buildCompatibilidadeTranstorno(null),
  },
  {
    recurso_campo: 46,
    recurso_nome: "Material didático adaptado",
    compatibilidade: buildCompatibilidadeTranstorno(null),
  },
  {
    recurso_campo: 47,
    recurso_nome: "Mobiliário adaptado",
    compatibilidade: buildCompatibilidadeTranstorno(null),
  },
  {
    recurso_campo: 48,
    recurso_nome: "Tempo adicional para realização da prova",
    compatibilidade: buildCompatibilidadeTranstorno("X"),
  },
];
