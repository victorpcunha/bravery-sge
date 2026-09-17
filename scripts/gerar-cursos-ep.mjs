// Gera src/data/censo/cursos-ep.ts a partir da tabela oficial v4.
// Uso: node scripts/gerar-cursos-ep.mjs (uma vez; commitar o resultado).
import XLSX from 'xlsx';
import fs from 'node:fs';

const wb = XLSX.readFile('documentacao_interna/Censo Escolar/Arquivos do INEP/2026/Matricula Inicial/v4/Tabelas Auxiliares/Tabela de Cursos da Educação Profissional 2026.xlsx');
const rows = XLSX.utils.sheet_to_json(wb.Sheets['Tabela'], { header: 1, defval: '' });
const data = rows.slice(8).filter((r) => String(r[1] || '').trim() !== '');

const esc = (s) => String(s || '').trim().replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const eixos = new Map();
const cursos = [];
for (const r of data) {
  const eixoRaw = String(r[0] || '').trim();
  const m = eixoRaw.match(/^(\d+)\s*-\s*(.+)$/);
  const eixoCod = m ? m[1] : eixoRaw;
  const eixoNome = m ? m[2] : eixoRaw;
  if (eixoCod && !eixos.has(eixoCod)) eixos.set(eixoCod, eixoNome);
  cursos.push({
    codigo: String(r[1]).trim(),
    nome: String(r[2] || '').trim(),
    eixo: eixoCod,
    cargaMinima: Number(String(r[3] || '').replace(/\D/g, '')) || 0,
    tipo: String(r[4] || '').trim(),
  });
}

let out = '// Tabela de Cursos da Educacao Profissional - Censo Escolar 2026 (v4)\n';
out += '// Gerado por scripts/gerar-cursos-ep.mjs a partir da planilha oficial.\n\n';
out += 'export const EIXOS_EP: Record<string, string> = {\n';
for (const [cod, nome] of eixos) out += '  "' + esc(cod) + '": "' + esc(nome) + '",\n';
out += '};\n\n';
out += 'export interface CursoEP { codigo: string; nome: string; eixo: string; cargaMinima: number; tipo: string }\n\n';
out += 'export const CURSOS_EP: Record<string, CursoEP> = {\n';
for (const c of cursos) {
  out += '  "' + esc(c.codigo) + '": { codigo: "' + esc(c.codigo) + '", nome: "' + esc(c.nome) + '", eixo: "' + esc(c.eixo) + '", cargaMinima: ' + c.cargaMinima + ', tipo: "' + esc(c.tipo) + '" },\n';
}
out += '};\n\n';
out += 'export function getCursoEP(codigo: string | null | undefined): CursoEP | null {\n';
out += '  if (!codigo) return null;\n';
out += '  return CURSOS_EP[String(codigo).trim()] ?? null;\n';
out += '}\n';

fs.writeFileSync('src/data/censo/cursos-ep.ts', out, 'utf8');
console.log('eixos: ' + eixos.size + ' cursos: ' + cursos.length + ' bytes: ' + Buffer.byteLength(out));
