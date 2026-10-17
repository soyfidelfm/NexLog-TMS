// Verifies that public/i18n/es.json and en.json have identical key sets,
// and that every translation key used in templates/TS exists.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const load = (l) => JSON.parse(readFileSync(`public/i18n/${l}.json`, 'utf8'));
const flat = (o, p = '') => Object.entries(o).flatMap(([k, v]) =>
  v && typeof v === 'object' ? flat(v, `${p}${k}.`) : [`${p}${k}`]);

const es = new Set(flat(load('es')));
const en = new Set(flat(load('en')));
const onlyEs = [...es].filter(k => !en.has(k));
const onlyEn = [...en].filter(k => !es.has(k));

const walk = (d) => readdirSync(d).flatMap(f => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const used = new Set();
for (const f of walk('src/app').filter(f => /\.(html|ts)$/.test(f) && !f.endsWith('.spec.ts'))) {
  const src = readFileSync(f, 'utf8');
  // literal keys piped through translate, instant(), or route titles / labelKey
  for (const m of src.matchAll(/'([a-zA-Z]+\.[A-Za-z0-9_.\- ]+)'\s*\|\s*translate/g)) used.add(m[1]);
  for (const m of src.matchAll(/instant\('([a-zA-Z]+\.[A-Za-z0-9_.\- ]+)'/g)) used.add(m[1]);
  for (const m of src.matchAll(/(?:title|labelKey|label): '((?:routes|nav|orderDetail)\.[A-Za-z0-9_.]+)'/g)) used.add(m[1]);
  for (const m of src.matchAll(/'((?:status|priority|severity|equipment|analytics\.csv|carriers\.status)\.[A-Za-z]+)'/g)) used.add(m[1]);
}
const missing = [...used].filter(k => !k.endsWith('.') && (!es.has(k) || !en.has(k)));

console.log(`es: ${es.size} keys, en: ${en.size} keys, literal keys referenced in code: ${used.size}`);
if (onlyEs.length) console.log('Only in es.json:', onlyEs);
if (onlyEn.length) console.log('Only in en.json:', onlyEn);
if (missing.length) console.log('Referenced but missing:', missing);
process.exit(onlyEs.length || onlyEn.length || missing.length ? 1 : 0);
