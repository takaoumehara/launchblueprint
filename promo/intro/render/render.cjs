// Render the intro with headless Chromium (Playwright) + ffmpeg.
//
//   node render/render.cjs                      -> ../intro-silent.mp4 (1920x1080, 30fps, no audio)
//   node render/render.cjs --stills 2.9,27.5    -> PNG stills into ../stills/
//   node render/render.cjs --from 29 --to 45 --out /tmp/part.mp4   (partial preview)
//
// Needs: playwright (with Chromium) resolvable by require, and ffmpeg on PATH.
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { chromium } = require('playwright');
const TL = require('../src/timeline.js');

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const ROOT = path.join(__dirname, '..');
const url = 'file://' + path.join(ROOT, 'src', 'index.html') + '?capture=1';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: TL.width, height: TL.height }, deviceScaleFactor: 1 });
  page.on('pageerror', e => { console.error('page error:', e.message); process.exitCode = 1; });
  await page.goto(url);
  await page.waitForFunction(() => window.BP && window.BP.ready);

  const stills = arg('--stills');
  if (stills) {
    const dir = arg('--dir', path.join(ROOT, 'stills'));
    fs.mkdirSync(dir, { recursive: true });
    for (const s of stills.split(',').map(Number)) {
      await page.evaluate(t => window.BP.seek(t), s);
      const name = `intro-${String(s.toFixed(1)).padStart(4, '0')}s.png`;
      await page.screenshot({ path: path.join(dir, name) });
      console.log('still', name);
    }
    await browser.close();
    return;
  }

  const from = +arg('--from', 0), to = +arg('--to', TL.duration);
  const out = arg('--out', path.join(ROOT, 'intro-silent.mp4'));
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(TL.fps), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-tune', 'animation', '-pix_fmt', 'yuv420p', '-r', String(TL.fps),
    '-movflags', '+faststart', '-an', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const f0 = Math.round(from * TL.fps), f1 = Math.round(to * TL.fps);
  const started = Date.now();
  for (let f = f0; f < f1; f++) {
    await page.evaluate(t => window.BP.seek(t), f / TL.fps);
    const buf = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - f0) % 150 === 0) console.log(`frame ${f}/${f1} (${((Date.now() - started) / 1000).toFixed(0)}s)`);
  }
  ff.stdin.end();
  const code = await new Promise(r => ff.on('close', r));
  await browser.close();
  if (code !== 0) { console.error('ffmpeg failed', code); process.exit(1); }
  console.log('wrote', out);
})();
