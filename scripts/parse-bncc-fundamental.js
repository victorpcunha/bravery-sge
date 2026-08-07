const fs = require('fs');
const path = require('path');

const DIR = path.resolve('D:/Victor/Projetos/bravery-sge/documentacao_interna/Documentacao de Desenvolvimento/02-Interfaces/Modulos Essenciais/06-Modulo-Consulta-BNCC/new/Fundamental');
const OUTPUT = path.resolve('D:/Victor/Projetos/bravery-sge/supabase-migrations/patch_bncc_fundamental_dados.sql');

const FILES = [
  { file: 'Fundamental - Arte.md', disciplina: 'Arte' },
  { file: 'Fundamental - Ciências.txt', disciplina: 'Ciências' },
  { file: 'Fundamental - Educação Física.txt', disciplina: 'Educação Física' },
  { file: 'Fundamental - Ensino Religioso.txt', disciplina: 'Ensino Religioso' },
  { file: 'Fundamental - Geografia.txt', disciplina: 'Geografia' },
  { file: 'Fundamental - História.txt', disciplina: 'História' },
  { file: 'Fundamental - Inglês.txt', disciplina: 'Inglês' },
  { file: 'Fundamental - Matemática.txt', disciplina: 'Matemática' },
  { file: 'Fundamental - Português.txt', disciplina: 'Português' },
];

/** Parse "Xº", "X°" to integer */
function parseYearNum(s) {
  return parseInt(s.replace(/[°º]/, '').trim(), 10);
}

/**
 * Parse a year header like:
 *   "CIÊNCIAS – 1º ANO"
 *   "EDUCAÇÃO FÍSICA – 1º E 2º ANOS"
 *   "LÍNGUA PORTUGUESA – 1º AO 5º ANO"
 *   "LÍNGUA INGLESA - 6° ANO"
 *
 * Returns { disciplinaName, years: number[] } or null
 */
function parseYearHeader(line) {
  // Normalize dashes, degrees
  const s = line.replace(/–/g, '-').replace(/°/g, 'º').trim();
  // Match: everything before the last dash, then the year part
  const m = s.match(/^(.+?)\s*[-–]\s*(\d)[°º]\s*(?:(?:E|AO)\s*(\d)[°º]\s*)?ANO(S)?\s*$/i);
  if (!m) return null;
  const name = m[1].trim();
  const y1 = parseInt(m[2], 10);
  const y2 = m[3] ? parseInt(m[3], 10) : null;
  if (y2) {
    const years = [];
    for (let y = y1; y <= y2; y++) years.push(y);
    return { disciplinaName: name, years };
  }
  return { disciplinaName: name, years: [y1] };
}

/**
 * Check if a line is a year header
 */
function isYearHeader(line) {
  return /[-–]\s*\d[°º]\s*(?:(?:E|AO)\s*\d[°º]\s*)?ANOS?\s*$/i.test(line);
}

/**
 * Strip HTML tags from a string
 */
function stripTags(s) {
  return s.replace(/<[^>]+>/g, '').trim();
}

/**
 * Decode HTML entities
 */
function decodeEntities(s) {
  return s.replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function cleanText(s) {
  let t = decodeEntities(s);
  // Replace <br> with a readable separator
  t = t.replace(/<br\s*\/?>/gi, ' / ');
  // Strip other HTML tags (preserve their content)
  t = t.replace(/<[^>]+>/g, '');
  // Collapse whitespace (newlines to spaces, multiple spaces to single)
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

/**
 * Extract habilidade codes and descriptions from a TD cell content.
 * Pattern: <strong>(CODE)</strong> Description<br>...
 */
function parseHabilidades(rawHtml) {
  // Split by <strong>
  const results = [];
  // Find all <strong>(CODE)</strong> followed by description
  const regex = /<strong>\s*\(([^)]+)\)\s*<\/strong>\s*([\s\S]*?)(?=<strong>|$)/gi;
  let match;
  while ((match = regex.exec(rawHtml)) !== null) {
    const code = match[1].trim();
    let desc = match[2].trim();
    // Remove trailing <br> tags and whitespace
    desc = desc.replace(/<br\s*\/?>\s*$/gi, '').trim();
    results.push({ code, desc: cleanText(desc) });
  }
  return results;
}

/**
 * Extract all <td> cells from a <tr> string, handling <th> as well.
 * Returns array of cell objects: { tag: 'th'|'td', raw: string, attrs: string }
 */
function extractCells(trHtml) {
  const cells = [];
  const regex = /<(th|td)([^>]*)>([\s\S]*?)<\/\1>/gi;
  let match;
  while ((match = regex.exec(trHtml)) !== null) {
    cells.push({
      tag: match[1].toLowerCase(),
      attrs: match[2],
      raw: match[3]
    });
  }
  return cells;
}

function stripBrTags(t) {
  // Remove standalone <br> at end
  return t.replace(/<br\s*\/?>\s*$/gi, '').trim();
}

/**
 * Parse a single (year section) table block.
 * Each year section has its own <thead> and <tbody>.
 *
 * Cell classification rules (table columns: UT | OC | HAB...):
 *  - <th> cell                     → UT (unidade temática), tracked via rowspan
 *  - <td> cell containing a code   → habilidade cell (may contain 1+ codes)
 *  - <td> cell with plain text     → OC (objeto de conhecimento), tracked via rowspan
 *  - <td> empty cell               → ignored
 *  - single <th colspan> row       → section header (CAMPO..., EIXO...), skipped
 *
 * Returns array of rows: { ut, oc, habilidades: [{code, desc}] }
 */
function parseYearSection(htmlBlock) {
  const rows = [];
  
  // Find tbody content
  const tbodyMatch = htmlBlock.match(/<tbody>([\s\S]*?)<\/tbody>/i);
  if (!tbodyMatch) return rows;
  const tbodyContent = tbodyMatch[1];
  
  // Split into <tr>...</tr> blocks
  const trRegex = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch;
  
  let currentUT = null;
  let currentOC = null;
  
  while ((trMatch = trRegex.exec(tbodyContent)) !== null) {
    const trHtml = trMatch[1];
    const cells = extractCells(trHtml);
    
    // Skip section header rows (single <th> with colspan, e.g. "CAMPO...", "EIXO...")
    if (cells.length === 1 && cells[0].tag === 'th' && cells[0].attrs.includes('colspan')) {
      continue;
    }
    
    let utText = null;
    let ocText = null;
    const habilidades = [];
    
    for (const cell of cells) {
      if (cell.tag === 'th') {
        // UT cell (rowspan) — the first column header inside tbody
        const t = cleanText(stripBrTags(cell.raw));
        if (t) utText = t;
        continue;
      }
      
      // td cell: habilidade if it contains a code, else OC if non-empty
      const habs = parseHabilidades(cell.raw);
      if (habs.length > 0) {
        habilidades.push(...habs);
      } else {
        const t = cleanText(stripBrTags(cell.raw));
        if (t) ocText = t;
      }
    }
    
    if (utText) currentUT = utText;
    if (ocText) currentOC = ocText;
    
    // Rows may update only UT or only OC (rowspan continuation) with no habilidade
    if (habilidades.length > 0 && currentUT) {
      rows.push({ ut: currentUT, oc: currentOC, habilidades });
    }
  }
  
  return rows;
}

/**
 * Derive the school years from a BNCC habilidade code.
 * EF01-EF09 → single year; EF12→1-2; EF15→1-5; EF35→3-5; EF67→6-7; EF69→6-9; EF89→8-9
 */
function anosFromCode(code) {
  const m = (code || '').match(/^EF(\d{1,2})/);
  if (!m) return [];
  const n = parseInt(m[1], 10);
  const ranges = {
    1: [1], 2: [2], 3: [3], 4: [4], 5: [5],
    6: [6], 7: [7], 8: [8], 9: [9],
    12: [1, 2], 15: [1, 2, 3, 4, 5], 35: [3, 4, 5],
    67: [6, 7], 69: [6, 7, 8, 9], 89: [8, 9],
  };
  return ranges[n] || [];
}

/**
 * Derive the etapa_ensino from the first year of a habilidade code.
 */
function etapaFromCode(code) {
  const anos = anosFromCode(code);
  return anos.length > 0 && anos[0] <= 5 ? 'anos_iniciais' : 'anos_finais';
}

/**
 * Parse a single file's content into structured data.
 * Returns array of { disciplina, etapa_ensino, anos, ut, oc, code, desc }
 */
function parseFile(content, disciplina) {
  const results = [];
  const lines = content.split('\n');
  
  let currentBlock = [];
  let inTable = false;
  
  // Flush a buffered table block into results
  const flushBlock = () => {
    if (!inTable || currentBlock.length === 0) return;
    const rows = parseYearSection(currentBlock.join('\n'));
    for (const row of rows) {
      for (const hab of row.habilidades) {
        if (hab.code && hab.desc) {
          results.push({
            disciplina,
            etapa_ensino: etapaFromCode(hab.code),
            anos: anosFromCode(hab.code),
            ut: row.ut,
            oc: row.oc,
            code: hab.code,
            desc: hab.desc,
          });
        }
      }
    }
    currentBlock = [];
    inTable = false;
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for year header (acts as a section boundary)
    if (parseYearHeader(line)) {
      flushBlock();
      continue;
    }
    
    // Detect start of table
    if (line.includes('<thead>') || line.includes('<tbody>') || (inTable && line.includes('<tr>'))) {
      inTable = true;
    }
    
    if (inTable) {
      currentBlock.push(lines[i]); // keep original line formatting
    }
    
    // Detect end of tbody
    if (inTable && line.includes('</tbody>')) {
      flushBlock();
    }
  }
  
  // Process any remaining block
  flushBlock();
  
  return results;
}

function escapeSql(s) {
  return s.replace(/'/g, "''");
}

function generateSql(allData) {
  const lines = [];
  lines.push('-- Migration: Dados BNCC Ensino Fundamental');
  lines.push('-- Gerado automaticamente em ' + new Date().toISOString());
  lines.push('');
  lines.push('-- Limpar dados existentes (ordem inversa das FKs)');
  lines.push('DELETE FROM bncc_habilidades;');
  lines.push('DELETE FROM bncc_objetos_conhecimento;');
  lines.push('DELETE FROM bncc_unidades_tematicas;');
  lines.push('');

  // Group by disciplina
  const byDisciplina = {};
  for (const d of allData) {
    if (!byDisciplina[d.disciplina]) byDisciplina[d.disciplina] = [];
    byDisciplina[d.disciplina].push(d);
  }

  for (const [disciplina, rows] of Object.entries(byDisciplina)) {
    lines.push(`-- ============================================================`);
    lines.push(`-- ${disciplina.toUpperCase()}`);
    lines.push(`-- ============================================================`);
    lines.push('');

    // Build unique UT -> {(disciplina, etapa_ensino): [OC -> [habilidades]]}
    // First group by (ut, etapa_ensino)
    const utMap = new Map();
    for (const r of rows) {
      const key = `${r.ut}|||${r.etapa_ensino}`;
      if (!utMap.has(key)) {
        utMap.set(key, { ut: r.ut, etapa_ensino: r.etapa_ensino, ocs: new Map() });
      }
      const utEntry = utMap.get(key);
      const ocKey = r.oc || '__NO_OC__';
      if (!utEntry.ocs.has(ocKey)) {
        utEntry.ocs.set(ocKey, { oc: r.oc, habilidades: [] });
      }
      // Only add if not duplicate by code within this oc
      const habs = utEntry.ocs.get(ocKey).habilidades;
      if (!habs.find(h => h.code === r.code)) {
        habs.push({ code: r.code, desc: r.desc, anos: r.anos });
      }
    }

    // Now generate SQL in blocks per UT
    for (const [, utEntry] of utMap) {
      const utName = escapeSql(utEntry.ut);
      const etapa = escapeSql(utEntry.etapa_ensino);

      // Determine which years this UT applies to
      const allYears = new Set();
      for (const [, ocEntry] of utEntry.ocs) {
        for (const h of ocEntry.habilidades) {
          for (const y of h.anos) {
            allYears.add(y);
          }
        }
      }

      lines.push(`-- ${utEntry.ut} (${etapa})`);
      lines.push(`WITH ut AS (`);
      lines.push(`  INSERT INTO bncc_unidades_tematicas (id, disciplina, unidade_tematica, etapa_ensino)`);
      lines.push(`  VALUES (gen_random_uuid(), '${escapeSql(disciplina)}', '${utName}', '${etapa}')`);
      lines.push(`  RETURNING id`);
      lines.push(`)`);

      const ocEntries = Array.from(utEntry.ocs.values());
      for (let oi = 0; oi < ocEntries.length; oi++) {
        const ocEntry = ocEntries[oi];
        const ocName = ocEntry.oc ? escapeSql(ocEntry.oc) : null;

        if (ocName) {
          lines.push(`, oc${oi} AS (`);
          lines.push(`  INSERT INTO bncc_objetos_conhecimento (id, unidade_tematica_id, objeto_conhecimento)`);
          lines.push(`  SELECT gen_random_uuid(), ut.id, '${ocName}' FROM ut`);
          lines.push(`  RETURNING id`);
          lines.push(`)`);
        }

        // Insert habilidades
        for (const h of ocEntry.habilidades) {
          const anosJson = JSON.stringify(h.anos.map(y => `${y}º`));
          const code = escapeSql(h.code);
          const desc = escapeSql(h.desc);
          
          if (ocName) {
            lines.push(`, h_${oi}_${h.code.replace(/[^a-zA-Z0-9]/g, '_')} AS (`);
            lines.push(`  INSERT INTO bncc_habilidades (id, objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)`);
            lines.push(`  SELECT gen_random_uuid(), oc${oi}.id, '${code}', '${desc}', '${anosJson}'::jsonb, '${etapa}' FROM oc${oi}`);
            lines.push(`)`);
          } else {
            lines.push(`, h_${h.code.replace(/[^a-zA-Z0-9]/g, '_')} AS (`);
            lines.push(`  INSERT INTO bncc_habilidades (id, objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)`);
            lines.push(`  SELECT gen_random_uuid(), NULL, '${code}', '${desc}', '${anosJson}'::jsonb, '${etapa}' FROM ut`);
            lines.push(`)`);
          }
        }
      }

      // Final dummy SELECT to make the CTE valid
      lines.push(`SELECT 1;`);
      lines.push('');
    }
  }

  return lines.join('\n');
}

// Main
console.log('Parsing BNCC Fundamental files...');

let allData = [];

for (const { file, disciplina } of FILES) {
  const filePath = path.join(DIR, file);
  console.log(`  Processing: ${file} (${disciplina})...`);
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = parseFile(content, disciplina);
  console.log(`    Found ${data.length} habilidades`);
  allData = allData.concat(data);
}

console.log(`\nTotal habilidades: ${allData.length}`);

// Deduplicate by code (same code appearing under different year sections)
const seen = new Set();
const deduped = [];
for (const d of allData) {
  const key = `${d.code}|||${d.desc}|||${d.ut}|||${d.oc}|||${d.etapa_ensino}`;
  if (!seen.has(key)) {
    seen.add(key);
    // Merge anos from duplicates
    const existing = deduped.find(x => x.code === d.code && x.ut === d.ut && x.oc === d.oc && x.etapa_ensino === d.etapa_ensino);
    if (existing) {
      for (const y of d.anos) {
        if (!existing.anos.includes(y)) {
          existing.anos.push(y);
        }
      }
    } else {
      deduped.push({ ...d });
    }
  }
}

console.log(`After dedup: ${deduped.length} habilidades`);
console.log(`\nGenerating SQL...`);

const sql = generateSql(deduped);
fs.writeFileSync(OUTPUT, sql, 'utf-8');
console.log(`SQL written to: ${OUTPUT}`);
console.log('Done!');
