// catalog/*.yaml と elements/ を読み、public/data.json と public/llms.txt を作る
import fs from 'node:fs'; import path from 'node:path'; import yaml from 'js-yaml';
const root = path.resolve(import.meta.dirname, '../../skill/blueprint');
const load = f => yaml.load(fs.readFileSync(path.join(root, f), 'utf8'));
const elements = load('elements/elements.yaml').elements;
const tactics = load('elements/tactics.yaml').tactics;
const glossary = load('elements/glossary.yaml').terms;
const lanes = load('elements/tactics.yaml').lanes;
const template = fs.readFileSync(path.join(root, 'elements/project-map.template.yaml'), 'utf8');
// catalog id → 項目
const items = {};
for (const f of fs.readdirSync(path.join(root, 'catalog')).filter(f => f.endsWith('.yaml'))) {
  const dom = f.slice(0, -5); let d; try { d = load('catalog/' + f); } catch { continue; }
  const lists = []; for (const v of Object.values(d || {})) if (Array.isArray(v)) lists.push(v);
  if (d?.auth?.providers) lists.push(d.auth.providers);
  for (const l of lists) for (const it of l) if (it && it.id) {
    const id = it.id.includes('.') ? it.id : `${dom}.${it.id}`;
    const pb = it.pricing_bands; const cost = pb ? (pb.free || Object.values(pb)[0]) : (it.cost || null);
    const src = typeof it.source === 'object' && it.source ? it.source : {};
    items[id] = { id, domain: dom, name: it.name || it.id, what: it.what || it.principle || it.item || it.rule || it.text || (Array.isArray(it.must) ? '必要なこと：' + it.must.join('、') : '') || '',
      best_for: it.best_for || (Array.isArray(it.pros) ? it.pros.join('、') : ''), avoid_when: it.avoid_when || it.anti_pattern || (Array.isArray(it.cons) ? it.cons.join('、') : ''), why: it.why || '',
      check: it.check || it.acceptance || it.trigger_next && ('次の段階へ：' + it.trigger_next) || (Array.isArray(it.checks) ? it.checks.join(' / ') : ''), cost,
      verified: src.verified ?? it.verified ?? false, checked: src.checked || it.date || null, url: src.url || null };
  }
}
const cats = {};
for (const m of fs.readFileSync(path.join(root, 'reference/12-categories.md'), 'utf8').matchAll(/^## (\d\d) (.+)$/gm)) cats[m[1]] = m[2];
const missing = tactics.flatMap(t => t.options.filter(o => !items[o]).map(o => `${t.topic}:${o}`));
if (missing.length) console.warn('見つからない catalog id:', missing.join(', '));
const data = { generated: new Date().toISOString().slice(0, 10), elements, lanes, glossary, tactics, categories: cats,
  items: Object.fromEntries(tactics.flatMap(t => t.options).filter(o => items[o]).map(o => [o, items[o]])), template };
fs.mkdirSync(path.resolve(import.meta.dirname, '../public'), { recursive: true });
fs.writeFileSync(path.resolve(import.meta.dirname, '../public/data.json'), JSON.stringify(data, null, 1));
const llms = [`# Blueprint`, `> 作り方の作り方。7つの要素（変わりにくい原則）→ 選択肢（tactics）→ プロジェクトの地図。`, '',
  `- データ全体（JSON）: /data.json`, `- 地図の書式: project-map.template.yaml（下に全文）`, `- アプリで「YAMLで書き出す」を押すと、この書式のプロジェクト地図が出る`, '',
  '## 要素', ...elements.map(e => `- ${e.id} ${e.name_ja}: ${e.principle_ja}（カテゴリー ${e.categories.join(',')}）`), '',
  '## 決めること（topic）。depends_on が先に決めるもの', ...tactics.map(t => `- ${t.topic}（${t.element}, lane=${t.lane}, ${t.kind}）${t.label_ja}: options=${t.options.join(',')}${t.ai_pick ? ' pick=' + t.ai_pick : ''} depends_on=[${t.depends_on.join(',')}]`), '',
  '## ことば（専門用語の言い換え）', ...glossary.map(g => `- ${g.term} → ${g.plain}：${g.one_line}`), '',
  '## project-map.template.yaml', '```yaml', template.trim(), '```', ''].join('\n');
fs.writeFileSync(path.resolve(import.meta.dirname, '../public/llms.txt'), llms);
console.log('data.json:', tactics.length, 'topics,', Object.keys(data.items).length, 'items');
