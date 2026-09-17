// Uso: node scripts/checar-rotulos.mjs campo1 campo2 ...
import fs from 'node:fs';
const s = fs.readFileSync('src/data/censo/rotulos-campos.ts', 'utf8');
for (const c of process.argv.slice(2)) {
  const ok = new RegExp('^\\s*' + c + '\\s*:', 'm').test(s);
  console.log(c + ': ' + (ok ? 'OK' : 'FALTA'));
}
