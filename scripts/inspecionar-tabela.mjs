// Uso: node scripts/inspecionar-tabela.mjs "<parte do nome>" [linhas]
// Ex.: node scripts/inspecionar-tabela.mjs "Paises" 12
import XLSX from 'xlsx';
import fs from 'node:fs';
import path from 'node:path';

const dir = 'documentacao_interna/Censo Escolar/Arquivos do INEP/2026/Matricula Inicial/v4/Tabelas Auxiliares';
const needle = (process.argv[2] || '').toLowerCase();
const n = Number(process.argv[3] || 12);
const arq = fs.readdirSync(dir).find((f) => f.toLowerCase().includes(needle));
if (!arq) {
  console.log('nao achou: ' + needle);
  process.exit(1);
}
console.log('ARQ: ' + arq);
const wb = XLSX.readFile(path.join(dir, arq));
console.log('SHEETS: ' + wb.SheetNames.join('|'));
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
console.log('NROWS: ' + rows.length);
let shown = 0;
for (let i = 0; i < rows.length && shown < n; i++) {
  const r = rows[i];
  if (r.some((c) => String(c).trim() !== '')) {
    console.log(i + ': ' + JSON.stringify(r.slice(0, 6)));
    shown++;
  }
}
