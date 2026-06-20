// INEP Censo Escolar 2026 — Anexo 5: Formas de Contratação × Dependência Administrativa
// Fonte: Portaria Inep nº 291/2025 — Campos 35–40 (Estadual) e 41–46 (Municipal)
//
// Cada forma de contratação possui um par de campos (Estadual / Municipal)
// e só pode ser declarada nas dependências administrativas listadas.

export interface FormaContratacao {
  forma: string;
  campo_estadual: number;
  campo_municipal: number;
  dependencias_permitidas: string[];
}

export const FORMAS_CONTRATACAO: FormaContratacao[] = [
  {
    forma: "Termo de colaboração (Lei 13.019)",
    campo_estadual: 35,
    campo_municipal: 41,
    dependencias_permitidas: [
      "Privada (não Particular)",
    ],
  },
  {
    forma: "Termo de fomento (Lei 13.019)",
    campo_estadual: 36,
    campo_municipal: 42,
    dependencias_permitidas: [
      "Privada (não Particular)",
    ],
  },
  {
    forma: "Acordo de cooperação (Lei 13.019)",
    campo_estadual: 37,
    campo_municipal: 43,
    dependencias_permitidas: [
      "Privada (não Particular)",
    ],
  },
  {
    forma: "Contrato de prestação de serviço",
    campo_estadual: 38,
    campo_municipal: 44,
    dependencias_permitidas: [
      "Municipal",
      "Privada (Particular)",
    ],
  },
  {
    forma: "Termo de cooperação técnica e financeira",
    campo_estadual: 39,
    campo_municipal: 45,
    dependencias_permitidas: [
      "Federal",
      "Estadual",
      "Municipal",
    ],
  },
  {
    forma: "Contrato de consórcio público / Convênio de cooperação",
    campo_estadual: 40,
    campo_municipal: 46,
    dependencias_permitidas: [
      "Federal",
      "Estadual",
      "Municipal",
    ],
  },
];
