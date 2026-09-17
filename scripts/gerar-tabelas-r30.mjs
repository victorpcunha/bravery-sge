// Gera povos-indigenas.ts, paises.ts e areas-pos-graduacao.ts da v4.
// Uso: node scripts/gerar-tabelas-r30.mjs (uma vez; commitar o resultado).
import XLSX from 'xlsx';
import fs from 'node:fs';
import path from 'node:path';

const dir = 'documentacao_interna/Censo Escolar/Arquivos do INEP/2026/Matricula Inicial/v4/Tabelas Auxiliares';
const achar = (parte) => {
  const arq = fs.readdirSync(dir).find((f) => f.toLowerCase().includes(parte));
  if (!arq) throw new Error('nao achou tabela: ' + parte);
  return path.join(dir, arq);
};
const esc = (s) => String(s || '').trim().replace(/\\/g, '\\\\').replace(/"/g, '\\"');
const ler = (arq, sheet, ini) => {
  const wb = XLSX.readFile(arq);
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheet], { header: 1, defval: '' });
  return rows.slice(ini).filter((r) => String(r[0] || '').trim() !== '');
};

// --- Povos indígenas: codigo -> nome ---
{
  const rows = ler(achar('povos'), 'Tabela', 8);
  let out = '// Tabela de Povos Indigenas - Censo Escolar 2026 (v4)\n// Gerado por scripts/gerar-tabelas-r30.mjs.\n\nexport const POVOS_INDIGENAS: Record<string, string> = {\n';
  for (const r of rows) out += '  "' + esc(r[0]) + '": "' + esc(r[1]) + '",\n';
  out += '};\n';
  fs.writeFileSync('src/data/censo/povos-indigenas.ts', out, 'utf8');
  console.log('povos: ' + rows.length);
}

// --- Países: só códigos ---
{
  const rows = ler(achar('ses'), 'Planilha1', 8);
  const cods = [...new Set(rows.map((r) => String(r[0]).trim()).filter(Boolean))];
  let out = '// Tabela de Paises - Censo Escolar 2026 (v4): só códigos (c15/c51).\n// Gerado por scripts/gerar-tabelas-r30.mjs.\n\nexport const PAISES_CODIGOS: string[] = [\n';
  for (const c of cods) out += '  "' + esc(c) + '",\n';
  out += '];\n';
  fs.writeFileSync('src/data/censo/paises.ts', out, 'utf8');
  console.log('paises: ' + cods.length);
}

// --- Áreas de pós-graduação: codigo -> nome ---
{
  const rows = ler(achar('reas p'), 'Tabela', 8);
  let out = '// Tabela de Areas de Pos-Graduacao - Censo Escolar 2026 (v4).\n// Gerado por scripts/gerar-tabelas-r30.mjs.\n\nexport const AREAS_POS_GRADUACAO: Record<string, string> = {\n';
  for (const r of rows) out += '  "' + esc(r[0]) + '": "' + esc(r[1]) + '",\n';
  out += '};\n';
  fs.writeFileSync('src/data/censo/areas-pos-graduacao.ts', out, 'utf8');
  console.log('pos-areas: ' + rows.length);
}
