// Le campos do layout v4 no terminal.
// Uso: node scripts/ler-layout.mjs <aba> [ini] [fim]
// Ex.: node scripts/ler-layout.mjs 30 85 110
import XLSX from 'xlsx';
const [aba, ini = 0, fim = 25] = process.argv.slice(2);
const wb = XLSX.readFile('documentacao_interna/Censo Escolar/Arquivos do INEP/2026/Matricula Inicial/v4/Layout de Importação e Exportação 2026 (Matrícula Inicial) v4.xlsx');
const ws = wb.Sheets[aba];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
rows.slice(Number(ini), Number(fim)).forEach((r, k) => {
  console.log((Number(ini) + k) + ': campo=' + JSON.stringify(r[0]) + ' nome=' + JSON.stringify(r[1]) + ' obg=' + r[2] + ' tm=' + r[3] + ' tipo=' + r[5]);
});
