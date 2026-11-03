// catalog/*.yaml と elements/ を読み、public/data.json と public/llms.txt を作る
import fs from 'node:fs'; import path from 'node:path'; import yaml from 'js-yaml';
const root = path.resolve(import.meta.dirname, '../../skill/blueprint');
const load = f => yaml.load(fs.readFileSync(path.join(root, f), 'utf8'));
const elements = load('elements/elements.yaml').elements;
const tactics = load('elements/tactics.yaml').tactics;
const comparisons = Object.fromEntries(load('elements/stack_comparisons.yaml').comparisons.map(c => [c.topic, c]));
const glossary = load('elements/glossary.yaml').terms;
const lanes = load('elements/tactics.yaml').lanes;
const stages = load('elements/tactics.yaml').stages;
const template = fs.readFileSync(path.join(root, 'elements/project-map.template.yaml'), 'utf8');
// catalog id → 項目
const items = {};
const catalog = {};   // 分野ごとの題名と id 一覧（カタログ画面）
const titleOf = (f, d) => { const first = fs.readFileSync(path.join(root, 'catalog', f), 'utf8').split('\n').find(l => l.startsWith('#'));
  return first ? first.replace(/^#\s*/, '').replace(/\s*[—–-]\s*CREATIVITY IS EVERYWHERE, LLC.*$/, '').trim() : (d?.title || d?.name_ja || f.slice(0, -5)); };
for (const f of fs.readdirSync(path.join(root, 'catalog')).filter(f => f.endsWith('.yaml'))) {
  const dom = f.slice(0, -5); let d; try { d = load('catalog/' + f); } catch { continue; }
  catalog[dom] = { domain: dom, title: titleOf(f, d), updated: d?.updated || null, ids: [] };
  const lists = []; for (const v of Object.values(d || {})) if (Array.isArray(v)) lists.push(v);
  if (d?.auth?.providers) lists.push(d.auth.providers);
  for (const l of lists) for (const it of l) if (it && it.id) {
    const id = it.id.includes('.') ? it.id : `${dom}.${it.id}`;
    catalog[dom].ids.push(id);
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
const data = { generated: new Date().toISOString().slice(0, 10), elements, lanes, stages, glossary, comparisons, tactics, categories: cats, catalog, items, template };
fs.mkdirSync(path.resolve(import.meta.dirname, '../public'), { recursive: true });
fs.writeFileSync(path.resolve(import.meta.dirname, '../public/data.json'), JSON.stringify(data, null, 1));
const llms = [`# Blueprint`, `> 作り方の作り方。7つの要素（変わりにくい原則）→ 選択肢（tactics）→ プロジェクトの地図。`, '',
  `- データ全体（JSON）: /data.json`, `- 地図の書式: project-map.template.yaml（下に全文）`, `- アプリで「YAMLで書き出す」を押すと、この書式のプロジェクト地図が出る`, '',
  '## 段（stage）。決めることはどれか1つの段に属する（5 段：idea → launch → operate → scale → exit）', ...stages.map(s => `- ${s.id} ${s.ja} / ${s.what_en || ''}: ${s.what_ja}（${tactics.filter(t => t.stage === s.id).length} 件）`), '',
  '## 要素', ...elements.map(e => `- ${e.id} ${e.name_ja}: ${e.principle_ja}（カテゴリー ${e.categories.join(',')}）`), '',
  '## 決めること（topic）。depends_on が先に決めるもの', ...tactics.map(t => `- ${t.topic}（${t.element}, stage=${t.stage}, lane=${t.lane}, ${t.kind}）${t.label_ja}${t.label_en ? ' / ' + t.label_en : ''}: options=${t.options.join(',')}${t.ai_pick ? ' pick=' + t.ai_pick : ''} depends_on=[${t.depends_on.join(',')}]`), '',
  '## スタック比較（R-030）。技術の選択ごと', ...Object.values(comparisons).map(c => `- ${c.topic}: pick=${c.recommendation.pick} 切り替え=${c.switch_points.map(w => w.when + '→' + w.upgrade_to).join(' / ')}`), '',
  '## カタログの分野（domain）。MCP の get_catalog(domain) / get_item(id) で読める', ...Object.values(catalog).map(c => `- ${c.domain}: ${c.title}（${c.ids.length} 件）`), '',
  '## AI から使う：MCP サーバー', '- リポジトリの mcp/ を build して `node mcp/dist/index.js` を MCP サーバーとして登録。list_topics → draft_project_map(profile) → get_comparison / get_item → draft_project_map(decided) の順', '',
  '## ことば（専門用語の言い換え）', ...glossary.map(g => `- ${g.term} → ${g.plain}：${g.one_line}`), '',
  '## project-map.template.yaml', '```yaml', template.trim(), '```', ''].join('\n');
fs.writeFileSync(path.resolve(import.meta.dirname, '../public/llms.txt'), llms);
console.log('data.json:', tactics.length, 'topics,', Object.keys(items).length, 'items,', Object.keys(catalog).length, 'domains');
