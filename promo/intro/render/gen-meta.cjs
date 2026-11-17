// Write ../timing.json and ../captions.en.vtt from src/timeline.js (the single source of timing).
//   node render/gen-meta.cjs
const fs = require('fs');
const path = require('path');
const TL = require('../src/timeline.js');
const ROOT = path.join(__dirname, '..');

const ts = s => {
  const ms = Math.round(s * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, sec = Math.floor(ms / 1000) % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(ms % 1000).padStart(3, '0')}`;
};
const words = s => s.split(/\s+/).filter(Boolean).length;

// sanity checks
let prev = 0;
for (const c of TL.cues) {
  const b = TL.beats.find(x => x.id === c.beat);
  if (!b) throw new Error('unknown beat ' + c.beat);
  if (c.start < b.start || c.end > b.end) throw new Error(`cue outside its beat: ${c.text}`);
  if (c.start < prev) throw new Error(`cues overlap at: ${c.text}`);
  if (c.end <= c.start) throw new Error(`empty cue: ${c.text}`);
  prev = c.end;
}
const total = TL.cues.reduce((n, c) => n + words(c.text), 0);

const timing = {
  video: { file: 'intro-silent.mp4', width: TL.width, height: TL.height, fps: TL.fps, duration: TL.duration, audio: 'none (narration to be muxed)' },
  narration_words: total,
  beats: TL.beats.map(b => {
    const cs = TL.cues.filter(c => c.beat === b.id);
    return {
      n: b.n, id: b.id, title: b.title, start: b.start, end: b.end,
      voice_start: cs[0].start, voice_end: cs[cs.length - 1].end,
      text: cs.map(c => c.text).join(' '),
      lines: cs.map(c => ({ start: c.start, end: c.end, text: c.text, words: words(c.text), shot: c.shot })),
    };
  }),
};
fs.writeFileSync(path.join(ROOT, 'timing.json'), JSON.stringify(timing, null, 2) + '\n');

// break lines longer than 42 characters into two balanced lines (common caption guideline)
const wrap = s => {
  if (s.length <= 42) return s;
  const w = s.split(' '); let best = null;
  for (let i = 1; i < w.length; i++) { const a = w.slice(0, i).join(' '), b = w.slice(i).join(' '); const d = Math.max(a.length, b.length); if (!best || d < best[0]) best = [d, a + '\n' + b]; }
  return best[1];
};
const vtt = ['WEBVTT', ''];
TL.cues.forEach((c, i) => { vtt.push(String(i + 1), `${ts(c.start)} --> ${ts(c.end)}`, wrap(c.text), ''); });
fs.writeFileSync(path.join(ROOT, 'captions.en.vtt'), vtt.join('\n'));

console.log(`wrote timing.json and captions.en.vtt — ${TL.cues.length} cues, ${total} words, ${TL.duration}s`);
for (const b of timing.beats) console.log(`  ${b.n} ${b.title.padEnd(18)} ${b.start}-${b.end}s  voice ${b.voice_start}-${b.voice_end}s  ${b.lines.reduce((n, l) => n + l.words, 0)} words`);
