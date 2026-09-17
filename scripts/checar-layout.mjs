// Checa a quantidade de campos emitidos por builder do censo (conta itens
// top-level do array `fields`). Uso: node scripts/checar-layout.mjs
import fs from 'node:fs';
const s = fs.readFileSync('src/lib/actions/censo.ts', 'utf8');

const ESPERADO = {
  buildRegistro00: 53,
  buildRegistro10: 187,
  buildRegistro20: 66,
  buildRegistro30: 110,
  buildRegistro40: 7,
  buildRegistro50: 38,
  buildRegistro60: 33,
};

function sliceFn(name) {
  const i = s.indexOf('function ' + name);
  const a = s.indexOf('const fields = [', i);
  let depth = 0;
  let start = -1;
  for (let k = a; k < s.length; k++) {
    const ch = s[k];
    if (ch === '[') {
      if (start < 0) start = k;
      depth++;
    } else if (ch === ']') {
      depth--;
      if (depth === 0) return s.slice(start + 1, k);
    }
  }
  throw new Error('array nao encontrado em ' + name);
}

function semComentarios(arraySrc) {
  return arraySrc
    .split('\n')
    .map((l) => {
      if (l.trim().startsWith('//')) return '';
      const idx = l.indexOf('//');
      return idx >= 0 ? l.slice(0, idx) : l;
    })
    .join('\n');
}

function contaItens(arraySrc) {
  const limpo = semComentarios(arraySrc);
  const trimmed = limpo.trim();
  const terminaVirgula = trimmed.endsWith(',');
  let depth = 0;
  let virgulas = 0;
  let temConteudo = false;
  for (const ch of limpo) {
    if (ch === '[' || ch === '(' || ch === '{') depth++;
    else if (ch === ']' || ch === ')' || ch === '}') depth--;
    else if (ch === ',' && depth === 0) virgulas++;
    else if (depth === 0 && ch.trim() !== '') temConteudo = true;
  }
  if (!temConteudo) return 0;
  return virgulas + (terminaVirgula ? 0 : 1);
}

let ok = true;
for (const [fn, esp] of Object.entries(ESPERADO)) {
  const n = contaItens(sliceFn(fn));
  const flag = n === esp ? 'OK  ' : 'DIVERGE';
  if (n !== esp) ok = false;
  console.log(flag + ' ' + fn + ': ' + n + ' (esperado ' + esp + ')');
}
process.exit(ok ? 0 : 1);
