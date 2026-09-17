// Gera src/data/censo/linguas-indigenas.ts a partir da tabela oficial v4.
// Uso: node scripts/gerar-linguas-indigenas.mjs (uma vez; commitar o resultado).
import XLSX from 'xlsx';
import fs from 'node:fs';
import path from 'node:path';

const dir = 'documentacao_interna/Censo Escolar/Arquivos do INEP/2026/Matricula Inicial/v4/Tabelas Auxiliares';
const arq = fs.readdirSync(dir).find((f) => f.toLowerCase().includes('nguas ind'));
const wb = XLSX.readFile(path.join(dir, arq));
const rows = XLSX.utils.sheet_to_json(wb.Sheets['Planilha1'], { header: 1, defval: '' });
const data = rows.slice(8).filter((r) => String(r[4] || '').trim() !== '');

const esc = (s) => String(s || '').trim().replace(/\\/g, '\\\\').replace(/"/g, '\\"');

let out = '// Tabela de Linguas Indigenas - Censo Escolar 2026 (v4).\n// Gerado por scripts/gerar-linguas-indigenas.mjs.\n\nexport const LINGUAS_INDIGENAS: Record<string, string> = {\n';
for (const r of data) out += '  "' + esc(r[4]) + '": "' + esc(r[5]) + '",\n';
out += '};\n';

fs.writeFileSync('src/data/censo/linguas-indigenas.ts', out, 'utf8');
console.log('linguas: ' + data.length);
