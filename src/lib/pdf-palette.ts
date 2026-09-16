// Paleta Atlas para documentos react-pdf.
//
// react-pdf renderiza fora do DOM e não lê tokens CSS nem Tailwind — por isso
// os stylesheets dos documentos usam literais. Este módulo é a fonte única JS:
// toda troca de paleta atualiza este arquivo; os 6 stylesheets que o importam
// (boletim, declaração, ficha, histórico, 2 relatórios) não carregam hex solto.
//
// Espelha `src/app/globals.css` (:root light) + `DESIGN.md` (Print).
export const PDF_PALETTE = {
  /** Texto principal e títulos (#1E1B4B) */
  ink: '#1E1B4B',
  /** Texto secundário, cabeçalhos de apoio (#64748B) */
  muted: '#64748B',
  /** Destaques, nomes em destaque e linhas de régua (#4F46E5) */
  accent: '#4F46E5',
  /** Bordas e linhas de tabela (#E2E5F0) */
  border: '#E2E5F0',
  /** Fundo de cabeçalho de tabela (#F1F2F9) */
  mutedFill: '#F1F2F9',
  /** Zebra de tabela (#F8F9FC) */
  surface: '#F8F9FC',
  /** Fundo do papel (#FFFFFF) */
  paper: '#FFFFFF',
  /** Fundo de alerta/atenção (#FEE2E2) */
  destructiveLight: '#FEE2E2',
  /** Fundo informativo (#DBEAFE) */
  infoLight: '#DBEAFE',
} as const

export type PdfPalette = typeof PDF_PALETTE
