// Screenshots of the shared project maps for docs/screens/ (desktop 1440 and phone 390, map + architecture view).
// Usage: cd app && npm run build && npx vite preview --port 4173 &  then  node scripts/capture-screens.cjs [base-url]
// Needs Playwright with Chromium installed. CREATIVITY IS EVERYWHERE, LLC
const { chromium } = require('playwright');
const path = require('node:path');
const BASE = (process.argv[2] || 'http://localhost:4173').replace(/\/+$/, '');
const OUT = path.resolve(__dirname, '../../docs/screens');
const SLUGS = ['rakugaki-jam', 'moime', 'local-pro-kit', 'lpk-frontdesk', 'brand-journey-map'];
const SIZES = [['desktop', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }], ['390', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true }]];
(async () => {
  require('node:fs').mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch(); const errors = [];
  for (const [label, opts] of SIZES) {
    const ctx = await b.newContext({ ...opts, colorScheme: 'light' });
    await ctx.addInitScript(() => { try { localStorage.setItem('bp.lang', 'en'); } catch {} });
    const p = await ctx.newPage(); p.on('pageerror', e => errors.push(String(e)));
    for (const slug of SLUGS) for (const [view, hash] of [['map', `#/p/${slug}`], ['arch', `#/p/${slug}/arch`]]) {
      await p.goto(`${BASE}/${hash}`); await p.waitForSelector(view === 'map' ? '.lgrid' : '#arch'); await p.waitForTimeout(500);
      const file = path.join(OUT, `${slug}-${view}-${label}.png`);
      await p.screenshot({ path: file, fullPage: true }); console.log(path.relative(process.cwd(), file));
    }
    // one node panel, to show what a reviewer sees on click
    await p.goto(`${BASE}/#/p/brand-journey-map/n/payments`); await p.waitForSelector('#pdet'); await p.waitForTimeout(500);
    const nf = path.join(OUT, `brand-journey-map-node-${label}.png`); await p.screenshot({ path: nf, fullPage: label !== 'desktop' }); console.log(path.relative(process.cwd(), nf));
    await ctx.close();
  }
  await b.close();
  if (errors.length) { console.error(errors); process.exit(1); }
})();
