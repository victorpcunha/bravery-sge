// Gera src/data/censo/cursos-superiores.ts a partir da tabela oficial v4.
// Uso: node scripts/gerar-cursos-superiores.mjs (uma vez; commitar o resultado).
import XLSX from 'xlsx';
import fs from 'node:fs';

const wb = XLSX.readFile('documentacao_interna/Censo Escolar/Arquivos do INEP/2026/Matricula Inicial/v4/Tabelas Auxiliares/Tabela de Cursos de Formação Superior 2026.xlsx');
const rows = XLSX.utils.sheet_to_json(wb.Sheets['Tabela'], { header: 1, defval: '' });
const data = rows.slice(8).filter((r) => String(r[6] || '').trim() !== '');

const esc = (s) => String(s || '').trim().replace(/\\/g, '\\\\').replace(/"/g, '\\"');

let out = '// Tabela de Cursos de Formacao Superior - Censo Escolar 2026 (Matricula Inicial v4)\n';
out += '// Gerado por scripts/gerar-cursos-superiores.mjs a partir da planilha oficial.\n';
out += '// Codigo (8 posicoes, ex. 0114M011) -> nome do curso.\n\n';
out += 'export const CURSOS_SUPERIORES: Record<string, string> = {\n';
for (const r of data) {
  out += '  "' + esc(r[6]) + '": "' + esc(r[7]) + '",\n';
}
out += '};\n\n';
out += 'export function getNomeCursoSuperior(codigo: string | null | undefined): string | null {\n';
out += '  if (!codigo) return null;\n';
out += '  return CURSOS_SUPERIORES[String(codigo).trim()] ?? null;\n';
out += '}\n';

fs.writeFileSync('src/data/censo/cursos-superiores.ts', out, 'utf8');
console.log('entries: ' + data.length + ' bytes: ' + Buffer.byteLength(out));
