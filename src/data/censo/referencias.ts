// Data de referência do Censo Escolar para a etapa de Situação do Aluno.
// A "última quarta-feira de maio" de 2026 — mesma data usada na Matrícula Inicial
// (censo-regras.ts, validarRegistro60). Matrículas com data_matricula após esta
// data são consideradas "admitido após" (registro 91 do layout de Situação do Aluno).

export const DATA_REFERENCIA_CENSO = new Date(2026, 4, 27)

export function dataReferenciaIso(): string {
  const d = DATA_REFERENCIA_CENSO
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}