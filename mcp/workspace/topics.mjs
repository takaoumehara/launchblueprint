// Decision topics for the workspace: the existing Blueprint tactics + catalog, plus three workspace-local
// design nodes (visual identity, interaction, animation) that connect to brand and UI decisions.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const skillDir = (env = process.env) => env.BLUEPRINT_DIR || path.resolve(HERE, '../../skill/blueprint');

const EXTRA = [
  { topic: 'brand_visual', lane: 'brand', stage: 'idea', label_ja: 'ビジュアルの方向', label_en: 'Visual identity', question_ja: '見た目の骨格（色・線・余白）をどう決める？', question_en: 'What is the visual skeleton (colour, line, spacing)?', depends_on: ['brand_basics'],
    options: [{ id: 'visual.thin-line', name: 'Thin-line, light + deep blue', what: 'Hairline strokes, one accent, generous space. Reads as calm and precise.', avoid_when: 'You need a loud, playful brand.' }, { id: 'visual.editorial', name: 'Editorial / type-led', what: 'Large type and imagery carry the brand.', avoid_when: 'You have no strong imagery or copy.' }, { id: 'visual.bold-color', name: 'Bold colour blocks', what: 'Saturated surfaces and heavy shapes.', avoid_when: 'The product is dense with data.' }] },
  { topic: 'interaction', lane: 'ux', stage: 'idea', label_ja: '操作の考え方', label_en: 'Interaction model', question_ja: 'どう操作させる？（キーボード・タッチ・ポインタ）', question_en: 'How is it operated (keyboard, touch, pointer)?', depends_on: ['ui_patterns', 'brand_visual'],
    options: [{ id: 'interaction.keyboard-first', name: 'Keyboard-first, touch-safe', what: 'Every action reachable by keyboard; 44px touch targets.', avoid_when: 'Never skip keyboard access.' }, { id: 'interaction.touch-first', name: 'Touch-first', what: 'Gestures and large targets; keyboard as fallback.', avoid_when: 'Heavy desktop power-user flows.' }] },
  { topic: 'animation', lane: 'ui', stage: 'idea', label_ja: 'アニメーション', label_en: 'Animation', question_ja: '動きは何のために使う？', question_en: 'What is motion for?', depends_on: ['interaction', 'brand_visual'],
    options: [{ id: 'animation.state-only', name: 'State changes only, reduced-motion safe', what: 'Short fades that explain a change; none when the user prefers reduced motion.', avoid_when: 'You want showpiece motion.' }, { id: 'animation.expressive', name: 'Expressive', what: 'Choreographed transitions as part of the brand.', avoid_when: 'Low-end devices or accessibility-first audiences.' }, { id: 'animation.none', name: 'None', what: 'Static; fastest and simplest.', avoid_when: 'State changes would be confusing without feedback.' }] },
];

export function loadTopics(env = process.env) {
  const root = skillDir(env), load = f => yaml.load(fs.readFileSync(path.join(root, f), 'utf8'));
  const tac = load('elements/tactics.yaml');
  const comparisons = Object.fromEntries(load('elements/stack_comparisons.yaml').comparisons.map(c => [c.topic, c]));
  const items = {};
  for (const f of fs.readdirSync(path.join(root, 'catalog')).filter(f => f.endsWith('.yaml'))) {
    const dom = f.slice(0, -5); let d; try { d = load('catalog/' + f); } catch { continue; }
    const lists = Object.values(d || {}).filter(Array.isArray); if (d?.auth?.providers) lists.push(d.auth.providers);
    for (const l of lists) for (const it of l) if (it?.id) items[it.id.includes('.') ? it.id : `${dom}.${it.id}`] = it;
  }
  const opt = id => { const it = items[id] || {}; return { id, name: it.name || id, what: it.what || it.principle || it.item || '', avoid_when: it.avoid_when || it.anti_pattern || '', cost: it.cost || it.pricing_bands?.free || null }; };
  const topics = {};
  for (const t of tac.tactics) topics[t.topic] = { topic: t.topic, lane: t.lane, stage: t.stage, kind: t.kind, label_ja: t.label_ja, label_en: t.label_en || t.topic, question_ja: t.question_ja, question_en: t.question_en || '', depends_on: t.depends_on, ai_pick: t.ai_pick || null, options: t.kind === 'choose' ? t.options.map(opt) : [], comparison: comparisons[t.topic] ? { pick: comparisons[t.topic].recommendation?.pick, switch_points: (comparisons[t.topic].switch_points || []).map(w => ({ when: w.when, upgrade_to: w.upgrade_to })) } : null };
  for (const e of EXTRA) topics[e.topic] = { kind: 'choose', ai_pick: null, comparison: null, extra: true, ...e };
  return { topics, lanes: tac.lanes, stages: tac.stages };
}
// Which topics does a decision on `topic` affect (downstream), and which does it rest on (upstream)?
export const downstream = (topics, topic) => Object.values(topics).filter(t => t.depends_on.includes(topic)).map(t => t.topic);
