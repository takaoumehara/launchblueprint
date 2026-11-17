/* Blueprint intro — deterministic animation.
 * Every visual is a pure function of time t (seconds): BP.seek(t) draws that frame.
 * The renderer (render/render.cjs) calls seek() once per frame; the browser player
 * calls it from requestAnimationFrame (or, with reduced motion, only at still key frames).
 */
(function () {
  'use strict';
  const TL = window.BP_TIMELINE;
  const $ = (s, r = document) => r.querySelector(s);
  const NS = 'http://www.w3.org/2000/svg';
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const sv = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };

  // ---------- easing / time helpers ----------
  const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
  const E = {
    lin: t => t,
    out: t => 1 - Math.pow(1 - t, 3),
    outExpo: t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    inOut: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    inOutQuint: t => (t < 0.5 ? 16 * Math.pow(t, 5) : 1 - Math.pow(-2 * t + 2, 5) / 2),
    in: t => t * t * t,
  };
  const P = (t, a, b, e = E.inOut) => e(clamp((t - a) / (b - a)));
  const L = (a, b, x) => a + (b - a) * x;
  // in at a (dur din), out ending at b (dur dout)
  const W = (t, a, b, din = 0.5, dout = 0.5, ei = E.out) => Math.min(P(t, a, a + din, ei), 1 - P(t, b - dout, b, E.inOut));
  const css = (el, o) => { for (const k in o) el.style[k] = o[k]; };
  const fade = (el, o, dy = 0, dx = 0) => { el.style.opacity = o.toFixed(4); el.style.transform = (dx || dy) ? `translate(${dx.toFixed(2)}px,${dy.toFixed(2)}px)` : ''; el.style.visibility = o <= 0.001 ? 'hidden' : ''; };
  // standard reveal: fade + rise
  const rise = (el, t, a, dur = 0.55, dist = 8, out = null) => {
    const k = P(t, a, a + dur, E.outExpo);
    const o = out ? Math.min(k, 1 - P(t, out[0], out[1], E.inOut)) : k;
    fade(el, o, (1 - k) * dist);
    return k;
  };

  // ---------- map model ----------
  const X0 = 50, COLW = 152, HEADY = 372, NODEY = 460, ROWH = 56;
  const COLS = [
    ['brand', 'BRAND', [['brand_found', 'Brand foundation'], ['name_voice', 'Name and voice'], ['tone', 'Tone of copy']]],
    ['visuals', 'VISUALS', [['color', 'Color system'], ['type', 'Type scale'], ['icons', 'Icon style']]],
    ['interactions', 'INTERACTIONS', [['primary', 'Primary action'], ['selected', 'Selected state'], ['hints', 'Hints on demand']]],
    ['animation', 'ANIMATION', [['timing', 'Motion timing'], ['reduced', 'Reduced motion'], ['transitions', 'Page transitions']]],
    ['experience', 'EXPERIENCE', [['problem', 'Confirm problem'], ['demand', 'Testing demand'], ['onboarding', 'Onboarding'], ['support', 'Support channel']]],
    ['screens', 'SCREENS', [['copy', 'Words on screen'], ['library', 'Components'], ['checkout', 'Checkout screen'], ['settings', 'Settings screen']]],
    ['tech', 'TECH STACK', [['buy', 'Build or buy'], ['frontend', 'Frontend'], ['hosting', 'Where it runs'], ['auth', 'Sign-in'], ['data', 'Where data lives'], ['backups', 'Restore plan']]],
    ['money', 'MONEY', [['pricing', 'Pricing model'], ['payments', 'Taking money'], ['freecap', 'Free tier cap'], ['refunds', 'Refunds']]],
    ['rules', 'RULES & LEGAL', [['terms', 'Terms & privacy'], ['store', 'App-store rules'], ['consent', 'Tracking consent'], ['tax', 'Sales tax']]],
    ['ethics', 'ETHICS', [['aidisc', 'AI disclosure'], ['age', 'Age gate'], ['darkp', 'No dark patterns']]],
    ['ops', 'OPERATIONS', [['errors', 'Error watch'], ['spend', 'Spending caps'], ['keys', 'Key storage'], ['uptime', 'Uptime watch']]],
    ['launch', 'LAUNCH', [['country', 'First country'], ['announce', 'Launch channels'], ['launchday', 'Launch-day plan']]],
    ['a11y', 'ACCESSIBILITY', [['contrast', 'Contrast check'], ['keyboard', 'Keyboard path'], ['reader', 'Screen reader']]],
  ].map(([id, label, nodes], i) => ({ id, label, i, x: X0 + i * COLW, nodes: nodes.map(([nid, nl], j) => ({ id: nid, label: nl, j, col: i, x: X0 + i * COLW, y: NODEY + j * ROWH })) }));
  const NODES = {}; COLS.forEach(c => c.nodes.forEach(n => (NODES[n.id] = n)));
  const COL = Object.fromEntries(COLS.map(c => [c.id, c]));
  // source -> target means "target depends on source"
  const EDGES = [
    ['brand_found', 'name_voice'], ['brand_found', 'color'], ['name_voice', 'tone'], ['tone', 'copy'], ['brand_found', 'type'],
    ['color', 'selected'], ['type', 'library'], ['icons', 'library'], ['brand_found', 'library'],
    ['primary', 'library'], ['primary', 'timing'], ['timing', 'reduced'], ['timing', 'transitions'], ['primary', 'onboarding'], ['hints', 'onboarding'],
    ['problem', 'demand'], ['demand', 'pricing'], ['demand', 'announce'], ['onboarding', 'support'],
    ['copy', 'checkout'], ['library', 'checkout'], ['library', 'settings'], ['selected', 'checkout'],
    ['buy', 'frontend'], ['buy', 'data'], ['frontend', 'hosting'], ['frontend', 'library'], ['data', 'auth'], ['data', 'backups'],
    ['hosting', 'errors'], ['hosting', 'uptime'], ['hosting', 'spend'], ['data', 'spend'], ['hosting', 'keys'],
    ['auth', 'payments'], ['payments', 'pricing'], ['payments', 'checkout'], ['payments', 'store'], ['payments', 'tax'], ['payments', 'refunds'],
    ['pricing', 'freecap'], ['spend', 'freecap'], ['store', 'checkout'], ['auth', 'settings'],
    ['country', 'terms'], ['country', 'tax'], ['terms', 'consent'], ['terms', 'aidisc'], ['terms', 'age'], ['pricing', 'darkp'],
    ['support', 'launchday'], ['announce', 'launchday'], ['errors', 'launchday'], ['country', 'announce'],
    ['color', 'contrast'], ['primary', 'keyboard'], ['library', 'reader'],
  ].map(([a, b], k) => ({ a: NODES[a], b: NODES[b], k, grow: NODES[b].col === 12 }));

  const AI_START = new Set(['buy', 'frontend', 'hosting', 'auth', 'data', 'backups', 'pricing', 'payments', 'library', 'country', 'announce', 'refunds']);
  const PAY_DEPS = ['pricing', 'checkout', 'store', 'tax', 'refunds'];
  const OPS_FLIP = { errors: 59.4, spend: 59.75, keys: 60.1, uptime: 60.45 };
  const T_APPROVE = 42.3, T_OPS_APPROVE = 61.95;

  // ripple from "Where data lives" (breadth-first depth along depends_on)
  const DEPTH = { data: 0 };
  { let q = ['data']; while (q.length) { const nx = []; for (const id of q) for (const e of EDGES) if (e.a.id === id && !(e.b.id in DEPTH) && !e.grow) { DEPTH[e.b.id] = DEPTH[id] + 1; nx.push(e.b.id); } q = nx; } }

  // ---------- camera ----------
  // key = world point at screen centre (cx,cy) and scale s
  const F = (px, py, s, sx = 960, sy = 540) => ({ cx: px + (960 - sx) / s, cy: py + (540 - sy) / s, s });
  const ID = { cx: 960, cy: 540, s: 1 };
  const PAY = F(X0 + 7 * COLW + 5, NODEY + ROWH, 1.3, 590, 520);
  const MAPCX = X0 + 6.5 * COLW + 60, MAPCY = (HEADY - 26 + NODEY + 5 * ROWH) / 2 + 10;
  const WIDE = F(MAPCX, MAPCY, 0.9);
  const STORE = F(X0 + 8 * COLW + 5, NODEY + ROWH, 1.32, 700, 540);
  const OPS = F(X0 + 10 * COLW + 5, NODEY + 1.5 * ROWH, 1.55, 820, 520);
  const END = F(MAPCX, MAPCY, 0.84, 960, 818);
  const CAM = [
    [0, ID], [16.8, ID], [29.0, F(960, 540, 1.03)], [30.6, PAY, E.inOutQuint], [43.7, PAY], [46.2, WIDE, E.inOutQuint],
    [53.2, WIDE], [54.6, STORE, E.inOutQuint], [58.3, STORE], [59.6, OPS, E.inOutQuint], [62.6, OPS], [63.9, WIDE, E.inOutQuint],
    [71.4, F(MAPCX, MAPCY, 0.92)], [73.6, END, E.inOutQuint], [86, F(MAPCX, MAPCY, 0.81, 960, 818)],
  ];
  function cam(t) {
    let i = 0; while (i < CAM.length - 1 && CAM[i + 1][0] <= t) i++;
    const [t0, a] = CAM[i]; if (i === CAM.length - 1) return a;
    const [t1, b, e] = CAM[i + 1]; const k = (e || E.inOut)(clamp((t - t0) / (t1 - t0)));
    const s = Math.exp(L(Math.log(a.s), Math.log(b.s), k));
    return { cx: L(a.cx, b.cx, k), cy: L(a.cy, b.cy, k), s };
  }
  const toScreen = (c, x, y) => [(x - c.cx) * c.s + 960, (y - c.cy) * c.s + 540];

  // ---------- build DOM ----------
  const stage = $('#stage'), world = $('#world'), svg = $('#strands');
  // grain: seeded noise so every render is identical
  {
    const cv = document.createElement('canvas'); cv.width = cv.height = 256; const g = cv.getContext('2d'); const im = g.createImageData(256, 256);
    let s = 1337; const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
    for (let i = 0; i < im.data.length; i += 4) { const v = 110 + rnd() * 40; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    g.putImageData(im, 0, 0); $('#grain').style.backgroundImage = `url(${cv.toDataURL()})`;
  }

  // strands
  function pathD(a, b) {
    const x1 = a.x + 5, y1 = a.y, x2 = b.x + 5, y2 = b.y;
    if (a.col === b.col) { const o = 46 + Math.abs(y2 - y1) * 0.12; return `M${x1} ${y1}C${x1 - o} ${y1} ${x2 - o} ${y2} ${x2} ${y2}`; }
    const sg = x2 > x1 ? 1 : -1, c = Math.max(Math.abs(x2 - x1) * 0.45, 40) * sg;
    return `M${x1} ${y1}C${x1 + c} ${y1} ${x2 - c} ${y2} ${x2} ${y2}`;
  }
  for (const e of EDGES) {
    const d = pathD(e.a, e.b);
    e.base = sv('path', { d, pathLength: 1, 'stroke-dasharray': '1 1' });
    e.hot = sv('path', { d, pathLength: 1, 'stroke-dasharray': '1 1', class: 'hot' });
    svg.appendChild(e.base);
  }
  for (const e of EDGES) svg.appendChild(e.hot);
  // order of first draw: left to right with a small deterministic jitter
  EDGES.forEach(e => { e.t0 = e.grow ? 46.9 + (e.k % 3) * 0.18 : 18.3 + ((Math.min(e.a.x, e.b.x) - X0) / 1640) * 3.0 + ((e.k * 37) % 10) * 0.035; });

  // headers
  const GHOST = { brand: [236, 224], money: [300, 520], ethics: [214, 806], rules: [1500, 300], tech: [1590, 690], launch: [1470, 905] };
  const GHOST_ORDER = ['rules', 'money', 'brand', 'tech', 'ethics', 'launch'];
  const SWEEP = { brand: 22.0, screens: 22.55, tech: 23.05, money: 23.6, rules: 24.1, launch: 24.7 };
  for (const c of COLS) {
    const el = h('div', 'head', `<span class="ix">${String(c.i + 1).padStart(2, '0')}</span><span class="lb"><em class="ghostdot" style="position:absolute;left:-19px;top:3px"></em>${c.label.replace('&', '&amp;')}<i></i></span>`);
    css(el, { left: c.x + 'px', top: HEADY - 26 + 'px' });
    $('#heads').appendChild(el); c.el = el; c.ix = $('.ix', el); c.ul = $('i', el); c.gd = $('.ghostdot', el); c.lb = $('.lb', el);
  }
  // nodes
  for (const c of COLS) for (const n of c.nodes) {
    const el = h('div', 'node', `<span class="d"></span><span class="tx" style="position:relative"><b>${n.label.replace('&', '&amp;')}</b><span class="tag" style="position:absolute;left:0;top:19px;white-space:nowrap"></span></span>`);
    css(el, { left: n.x + 'px', top: n.y - 9 + 'px', height: '18px' });
    $('#nodes').appendChild(el); n.el = el; n.dot = $('.d', el); n.b = $('b', el); n.tag = $('.tag', el); n.tx = $('.tx', el);
    n.b.style.textShadow = '0 0 4px #0B1C2E,0 0 8px #0B1C2E,0 0 14px #0B1C2E';
  }
  // foresight flag on App-store rules
  NODES.store.flag = h('span', 'flag'); NODES.store.el.appendChild(NODES.store.flag);
  // inline approve chip on Error watch
  NODES.errors.chip = h('span', 'chip', 'Approve'); css(NODES.errors.chip, { position: 'absolute', left: '0px', top: '20px' }); NODES.errors.tx.appendChild(NODES.errors.chip);

  // ---------- pain scene ----------
  const pain = $('#pain');
  pain.innerHTML = `
    <svg width="1920" height="1080" id="painlines"></svg>
    <div class="win"><div class="frame" style="position:absolute;inset:-1px;border:1px solid var(--hair2)"></div>
      <div class="inner">
      <div class="bar"><span>Preview</span><span style="color:var(--m3)">/subscribe</span></div>
      <div class="body">
        <div class="kick p0">PLUS</div>
        <h3 class="p1">Go Plus</h3>
        <div class="ln p2" style="width:300px"></div><div class="ln p3" style="width:240px"></div>
        <div style="height:14px"></div>
        <div class="feat p4"><i></i><em style="width:200px"></em></div>
        <div class="feat p5"><i></i><em style="width:170px"></em></div>
        <div class="feat p6"><i></i><em style="width:186px"></em></div>
        <div class="img p7"><svg width="210" height="200"><path d="M0 0L210 200M210 0L0 200" stroke="rgba(246,249,252,.08)" stroke-width="1"/></svg></div>
        <div class="cta p8"><span class="ct">Subscribe</span><s></s></div>
      </div>
      <div class="prompt"><b>›</b><span class="typed"></span><span class="caret"></span></div>
      </div>
    </div>
    <div class="tl"><div class="rail"></div><div class="run"></div>${[0, 1, 2, 3, 4, 5].map(i => `<div class="tick" style="left:${i * 120}px"></div><div class="wk" style="left:${i * 120}px">WEEK ${i + 1}</div>`).join('')}<div class="head2"></div><div class="rew mono" style="top:-34px">REDO</div></div>
    <div class="notice"><div class="k"><i></i>STORE REVIEW · WEEK 6</div><p>Checkout doesn’t meet the store’s payment rules.</p></div>`;
  const win = $('.win', pain), winFrame = $('.frame', win), winInner = $('.inner', win), typed = $('.typed', pain), caret = $('.caret', pain);
  const parts = [...Array(9)].map((_, i) => $('.p' + i, pain));
  const cta = $('.cta', pain), ctaText = $('.ct', pain), strike = $('s', cta);
  const tl = $('.tl', pain), run = $('.run', tl), ph = $('.head2', tl), rew = $('.rew', tl), wks = [...tl.querySelectorAll('.wk')];
  const notice = $('.notice', pain), painlines = $('#painlines');
  const PROMPT = 'build a subscribe screen';
  // notice → button connector
  const conn = sv('path', { d: 'M1420 520C1180 520 1000 597 760 597', fill: 'none', stroke: '#FF8A3D', 'stroke-width': 1.2, pathLength: 1, 'stroke-dasharray': '1 1' });
  painlines.appendChild(conn);
  // ghost connectors (dashed, from ghost to window edge)
  const ghostLines = {};
  // built after fonts load (needs label widths): left-side ghosts connect from the label end, right-side from the dot
  function buildGhostLines() {
    for (const id of GHOST_ORDER) {
      const [gx, gy] = GHOST[id], lw = COL[id].lb.offsetWidth;
      const left = gx < 560;
      const sx = left ? gx + lw + 10 : gx - 26, sy = gy + 8;
      const tx = left ? 560 : 1360, ty = clamp(sy, 236, 694);
      const p = sv('path', { d: `M${sx} ${sy}L${tx} ${ty}`, fill: 'none', stroke: 'rgba(246,249,252,.28)', 'stroke-width': 1, 'stroke-dasharray': '3 5' });
      painlines.appendChild(p); ghostLines[id] = p;
    }
  }

  // ---------- chrome ----------
  $('#chrome').innerHTML = `<div class="l mono"><span class="brand"><i></i>Blueprint</span><span class="off">Start</span><span class="on">Map</span><span class="off">Decide</span><span class="off">Catalog</span></div>
    <div class="r mono"><span style="color:var(--m2)">Untitled project</span><span style="color:var(--m3)">Export YAML · Markdown</span></div><div class="rule"></div>`;

  // ---------- decision panel ----------
  const panel = $('#panel');
  panel.innerHTML = `
    <div class="row c0"><span class="mono" style="color:var(--m2)">08 — Money · Launch</span>
      <span style="position:relative;width:300px;height:16px"><span class="status s-ai" style="position:absolute;right:0"><i></i>AI pick · waiting for you</span><span class="status done s-done" style="position:absolute;right:0"><i></i>Decided · approved by you</span></span></div>
    <h2 class="c1">Taking money</h2>
    <p class="q c2">How will people pay you?</p>
    <div class="rec"><div class="sec acc c3">Recommended</div><div class="nm c4">Stripe Checkout</div><p class="c5">No monthly fee to start. Cards, Apple Pay and Google Pay in one place.</p></div>
    <div class="blk b-opts"><div class="sec">Options</div>
      <div class="opt on o0"><span class="mk"></span><b>Stripe Checkout</b><span class="mono" style="font-size:10.5px;color:var(--acc)">Recommended</span></div>
      <div class="opt o1"><span class="mk"></span><b>Stripe Connect</b><span></span></div>
      <div class="opt o2"><span class="mk"></span><b>Paddle</b><span></span></div>
      <div class="opt o3"><span class="mk"></span><b>Ryft</b><span></span></div>
    </div>
    <div class="blk b-cmp"><div class="sec">Compare</div>
      <div class="cmp">
        <div class="h"></div><div class="h ca" style="color:var(--acc)">Stripe Checkout · pick</div><div class="h cb" style="color:var(--m2)">Paddle · set aside</div>
        <div class="k">What</div><div class="a">Hosted checkout and card payments</div><div class="b cb">Merchant of record: files sales tax and VAT</div>
        <div class="k">Best for</div><div class="a">One seller, one service</div><div class="b cb">Software sold worldwide, tax handled</div>
        <div class="k">Avoid when</div><div class="a">Money moves between users</div><div class="b cb">Physical goods, or lowest fees needed</div>
      </div></div>
    <div class="deps"><div class="sec dh">If this changes</div><ul>${PAY_DEPS.map(id => `<li data-id="${id}"><i></i>${NODES[id].label}</li>`).join('')}</ul></div>
    <div class="acts c6"><span class="btn acc b-approve"><span class="t1">Approve</span><span class="t2 alt">Approved</span></span><span class="btn b-compare">Compare</span></div>`;
  const pc = [...Array(7)].map((_, i) => $('.c' + i, panel));
  const sAi = $('.s-ai', panel), sDone = $('.s-done', panel);
  const bOpts = $('.b-opts', panel), bCmp = $('.b-cmp', panel), cmpB = [...panel.querySelectorAll('.cb')], opts = [...Array(4)].map((_, i) => $('.o' + i, panel));
  const depsH = $('.dh', panel), depsLi = [...panel.querySelectorAll('.deps li')];
  const bApprove = $('.b-approve', panel), bCompare = $('.b-compare', panel), ap1 = $('.t1', bApprove), ap2 = $('.t2', bApprove);

  // ---------- foresight ----------
  const fs = $('#foresight');
  fs.innerHTML = `<div class="k"><i></i>Foresight · from a real project</div>
    <h4>Store rules can change your checkout.</h4>
    <p>App stores set their own rules for selling digital features. Check them when you choose how to take money, not after.</p>
    <div class="on"><span>SHOWS UP ON</span>App-store rules · Taking money · Checkout screen</div>`;
  const fsLine = sv('path', { fill: 'none', stroke: '#FF8A3D', 'stroke-width': 1.2, pathLength: 1, 'stroke-dasharray': '1 1' });
  $('#overlay-lines').appendChild(fsLine);

  // ---------- legend ----------
  const lg = $('#legend');
  lg.innerHTML = `<span class="d l0"></span><span class="l0"><b>Open</b> — not decided yet</span>
    <span class="d ai l1"></span><span class="l1"><b>AI pick</b> — waiting for you</span>
    <span class="d done l2"></span><span class="l2"><b>Decided</b> — you approved it</span>`;
  const lgRows = [0, 1, 2].map(i => [...lg.querySelectorAll('.l' + i)]);

  // ---------- tools / MCP ----------
  const tools = $('#tools');
  const TOOLS = ['Claude Code', 'Cursor', 'Codex'];
  tools.innerHTML = TOOLS.map((n, i) => `<div class="tool t${i}" style="top:${414 + i * 92}px">${n}</div>`).join('') +
    `<div class="mcp"><div class="k">Local MCP server</div><div class="n"><i></i>blueprint</div></div>
    <div class="pane"><div class="tabs"><span class="tb0 on">Terminal</span><span class="tb1">Export YAML</span><span class="tb2">Markdown</span></div><div class="uline"></div>
    <pre class="term">${[
      '<span class="c">›</span> <span class="v">list_topics</span>',
      '  <span class="m">every decision, in dependency order</span>',
      '<span class="c">›</span> <span class="v">draft_project_map</span>',
      '  payments   ai_pick  <span class="v">stripe-checkout</span>',
      '             status   <span class="v">open</span> <span class="m">· owner decides</span>',
      '<span class="c">›</span> <span class="v">get_comparison</span> payments',
      '  <span class="m">pick, alternatives, why</span>',
    ].map(l => `<div>${l}</div>`).join('')}</pre>
    <pre class="yaml">${[
      '<span class="m"># project-map.yaml</span>',
      'choices:',
      '  - topic: <span class="v">payments</span>',
      '    status: <span class="c">decided</span>',
      '    ai_pick: <span class="v">pay.stripe-checkout</span>',
      '    pick: <span class="v">pay.stripe-checkout</span>',
      '    decided_by: <span class="c">human</span>',
      '    rejected:',
      '      - option: <span class="v">pay.paddle</span>',
      '        why: <span class="v">physical goods, or lower fees</span>',
      '    depends_on: <span class="v">[business_setup, auth]</span>',
    ].map(l => `<div>${l}</div>`).join('')}</pre></div>`;
  const toolEls = TOOLS.map((_, i) => $('.t' + i, tools)), mcp = $('.mcp', tools), pane = $('.pane', tools);
  const termLines = [...tools.querySelectorAll('.term div')], yamlLines = [...tools.querySelectorAll('.yaml div')], term = $('.term', tools), yamlPre = $('.yaml', tools);
  const tabs = [0, 1, 2].map(i => $('.tb' + i, tools)), uline = $('.uline', tools);
  const ol = $('#overlay-lines');
  const toolPaths = TOOLS.map((_, i) => { const y = 414 + i * 92 + 33; const p = sv('path', { d: `M420 ${y}C540 ${y} 520 532 640 532`, fill: 'none', stroke: 'rgba(246,249,252,.4)', 'stroke-width': 1, pathLength: 1, 'stroke-dasharray': '1 1' }); ol.appendChild(p); return p; });
  const mcpPath = sv('path', { d: 'M1040 532C1140 532 1140 536 1240 536', fill: 'none', stroke: 'rgba(246,249,252,.4)', 'stroke-width': 1, pathLength: 1, 'stroke-dasharray': '1 1' }); ol.appendChild(mcpPath);
  const pulses = [...toolPaths, mcpPath].map(() => { const c = sv('circle', { r: 3.2, fill: '#FF8A3D' }); ol.appendChild(c); return c; });

  // ---------- end card ----------
  const endc = $('#endcard');
  endc.innerHTML = `<div class="mark"><i></i><span>Blueprint</span></div>
    <div class="join">Join the early prototype <span aria-hidden="true">→</span></div>
    <div class="llc">CREATIVITY IS EVERYWHERE, LLC</div>`;
  const mark = $('.mark', endc), join = $('.join', endc), llc = $('.llc', endc);

  // ---------- cursor ----------
  const cur = $('#cursor');
  cur.innerHTML = `<div class="ring"></div><svg width="26" height="30" viewBox="0 0 26 30"><path d="M3 2L3 24L9 18.5L13 27.5L16.6 26L12.7 17.2L21 17.2Z" fill="#F6F9FC" stroke="#0A1A2B" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
  const ring = $('.ring', cur);
  const TAPS = [31.0, 34.45, 42.15, 61.85];

  // positions of panel buttons relative to the stage (panel at rest)
  const offs = el => { let x = 0, y = 0, e = el; while (e && e !== stage) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; } return [x + el.offsetWidth / 2, y + el.offsetHeight / 2]; };
  let BTN = null;
  const nodeScreen = (id, t) => { const n = NODES[id]; return toScreen(cam(t), n.x + 5, n.y); };
  // cursor path: [time, position-fn]
  const CUR = [
    [30.0, t => [470, 860]],
    [30.85, t => nodeScreen('payments', t).map((v, i) => v + (i ? 2 : 1))],
    [33.4, t => nodeScreen('payments', t).map((v, i) => v + (i ? 40 : 60))],
    [34.3, () => BTN.compare],
    [40.9, () => [BTN.compare[0] + 30, BTN.compare[1] - 60]],
    [41.95, () => BTN.approve],
    [43.6, () => [BTN.approve[0] - 40, BTN.approve[1] + 30]],
    [48.2, t => [760, 880]],
    [49.0, t => nodeScreen('data', t).map((v, i) => v + (i ? 2 : 1))],
    [53.6, t => nodeScreen('data', t).map((v, i) => v + (i ? 2 : 1))],
    [60.2, t => [1100, 900]],
    [61.6, t => { const [x, y] = nodeScreen('errors', t); return [x + 16 + 34 * 1.55, y + 30 * 1.55]; }],
    [63.0, t => { const [x, y] = nodeScreen('errors', t); return [x + 16 + 34 * 1.55, y + 30 * 1.55]; }],
  ];
  const CUR_VIS = [[30.0, 43.8], [48.2, 53.5], [60.2, 62.7]];
  function cursorAt(t) {
    let i = 0; while (i < CUR.length - 1 && CUR[i + 1][0] <= t) i++;
    if (i === CUR.length - 1 || t < CUR[0][0]) return CUR[i][1](t);
    const [t0, f0] = CUR[i], [t1, f1] = CUR[i + 1];
    // hold at f0 until shortly before the next key, then glide
    const glide = Math.min(0.9, t1 - t0), k = E.inOut(clamp((t - (t1 - glide)) / glide));
    const a = f0(t), b = f1(t); return [L(a[0], b[0], k), L(a[1], b[1], k)];
  }

  // ---------- node state ----------
  function nodeState(id, t) {
    if (id === 'payments') return t >= T_APPROVE ? 'done' : 'ai';
    if (id === 'errors' && t >= T_OPS_APPROVE) return 'done';
    if (id in OPS_FLIP) return t >= OPS_FLIP[id] ? 'ai' : 'open';
    return AI_START.has(id) ? 'ai' : 'open';
  }

  // ---------- seek ----------
  let laidOut = false;
  function seek(t) {
    if (!laidOut) { BTN = { approve: offs(bApprove), compare: offs(bCompare) }; buildGhostLines(); laidOut = true; }
    const c = cam(t);
    world.style.transform = `translate(${(960 - c.cx * c.s).toFixed(2)}px,${(540 - c.cy * c.s).toFixed(2)}px) scale(${c.s.toFixed(5)})`;
    // world opacity: full map → dimmed behind the tools shot → dots-and-lines constellation behind the end card
    const worldOut = 1 - P(t, 84.9, 86, E.inOut);
    const wo = t < 62.7 ? 1 : t < 71.4 ? L(1, 0.1, P(t, 62.7, 63.6)) : L(0.1, 0.42, P(t, 71.4, 73.6));
    world.style.opacity = (wo * worldOut).toFixed(4);
    const labelFade = 1 - P(t, 71.4, 72.8);

    // ---- focus modes (dims) ----
    const depsOn = W(t, 37.5, 44.6, 0.6, 0.9);              // panel "if this changes"
    const ripple = W(t, 48.9, 53.7, 0.5, 0.7);              // data ripple
    const fsOn = W(t, 54.6, 58.8, 0.6, 0.6);                // foresight
    // ---- headers ----
    for (const col of COLS) {
      let o, dx = 0, dy = 0, gd = 0;
      const ixo = P(t, 16.9 + col.i * 0.03, 17.7 + col.i * 0.03);
      if (col.id in GHOST) {
        const gi = GHOST_ORDER.indexOf(col.id), g0 = 7.8 + gi * 0.42;
        const ghostIn = P(t, g0, g0 + 0.7, E.out), move = P(t, 15.25, 16.75, E.inOutQuint);
        const [gx, gy] = GHOST[col.id];
        dx = (gx - col.x) * (1 - move); dy = (gy - HEADY) * (1 - move) + (1 - ghostIn) * 6 * (1 - move);
        o = ghostIn * L(0.62, 1, move) * (1 - P(t, 13.9, 14.4) * 0.35 * (1 - move));
        gd = ghostIn * (1 - P(t, 15.3, 15.9));
      } else {
        const d = Math.abs(col.i - 5) * 0.07;
        o = P(t, 16.55 + d, 17.25 + d, E.out); dy = (1 - o) * 8;
      }
      if (col.id === 'a11y') { o = P(t, 45.9, 46.6, E.out); dx = (1 - o) * 30; dy = 0; }
      fade(col.el, o * labelFade, dy, dx);
      col.ix.style.opacity = (col.id === 'a11y' ? o : ixo).toFixed(3);
      col.gd.style.opacity = gd.toFixed(3);
      // spoken sweep + a11y "new" emphasis
      const sw = col.id in SWEEP ? Math.min(P(t, SWEEP[col.id], SWEEP[col.id] + 0.25, E.out), 1 - P(t, SWEEP[col.id] + 0.7, SWEEP[col.id] + 1.2)) : 0;
      const nw = col.id === 'a11y' ? W(t, 46.0, 48.6, 0.6, 0.8) : 0;
      const hi = Math.max(sw, nw);
      col.ul.style.width = (hi * 100).toFixed(1) + '%';
      col.lb.style.color = hi > 0.01 ? `rgba(246,249,252,${L(0.68, 1, hi).toFixed(3)})` : '';
    }
    // ---- nodes ----
    for (const col of COLS) for (const n of col.nodes) {
      let o;
      if (n.id === 'checkout') o = P(t, 15.85, 16.1, E.lin);
      else if (col.id === 'a11y') o = P(t, 46.3 + n.j * 0.12, 46.9 + n.j * 0.12, E.out);
      else { const a = 16.95 + Math.abs(col.i - 5) * 0.1 + n.j * 0.05; o = P(t, a, a + 0.6, E.out); }
      const st = nodeState(n.id, t);
      n.dot.className = 'd' + (st === 'ai' ? ' ai' : st === 'done' ? ' done' : '');
      n.el.classList.toggle('done', st === 'done');
      // dims
      let dim = 1;
      const inPay = n.id === 'payments' || PAY_DEPS.includes(n.id);
      dim = Math.min(dim, L(1, inPay ? 1 : 0.32, depsOn));
      dim = Math.min(dim, L(1, n.id in DEPTH ? 1 : 0.26, ripple));
      dim = Math.min(dim, L(1, ['store', 'payments', 'checkout'].includes(n.id) ? 1 : 0.4, fsOn));
      const pop = n.id in OPS_FLIP ? W(t, OPS_FLIP[n.id], OPS_FLIP[n.id] + 0.7, 0.15, 0.55) : 0;
      n.dot.style.transform = `scale(${(L(0.2, 1, o) * (1 + 0.35 * pop)).toFixed(3)})`;
      n.el.style.opacity = (o * dim).toFixed(4);
      n.el.style.visibility = o * dim < 0.002 ? 'hidden' : '';
      n.tx.style.transform = `translateY(${((1 - o) * 5).toFixed(2)}px)`;
      n.tx.style.opacity = labelFade < 1 ? labelFade.toFixed(3) : '';
      // ripple emphasis on the data chain: label colour
      if (n.id in DEPTH && ripple > 0) { const k = P(t, 49.15 + DEPTH[n.id] * 0.55, 49.6 + DEPTH[n.id] * 0.55, E.out) * ripple; n.b.style.color = k > 0.01 && st !== 'done' ? `rgb(${Math.round(L(246, 255, k))},${Math.round(L(249, 138, k))},${Math.round(L(252, 61, k))})` : ''; }
      else n.b.style.color = '';
      // tags (ops "AI pick", approve chip)
      if (n.id in OPS_FLIP) {
        const ta = P(t, OPS_FLIP[n.id] + 0.1, OPS_FLIP[n.id] + 0.5, E.out) * (1 - P(t, 62.6, 63.3));
        if (n.id === 'errors') {
          const chipIn = W(t, 60.85, 62.25, 0.35, 0.3);
          n.tag.textContent = t >= T_OPS_APPROVE ? 'Decided · by you' : 'AI pick';
          n.tag.className = 'tag' + (t >= T_OPS_APPROVE ? ' acc' : '');
          n.tag.style.opacity = (t >= T_OPS_APPROVE ? P(t, 62.2, 62.5) * (1 - P(t, 62.6, 63.3)) : ta * (1 - P(t, 60.8, 61.0))).toFixed(3);
          n.chip.style.opacity = chipIn.toFixed(3);
          n.chip.style.filter = t > 61.85 && t < 62.05 ? 'brightness(.85)' : '';
        } else { n.tag.textContent = 'AI pick'; n.tag.style.opacity = ta.toFixed(3); }
      } else if (n.tag.textContent) n.tag.textContent = '';
      if (n.flag) n.flag.style.opacity = P(t, 54.7, 55.2, E.out).toFixed(3);
    }
    if (!NODES.errors.chip.style.opacity) NODES.errors.chip.style.opacity = '0';

    // ---- strands ----
    const baseOp = 0.15 * (1 - 0.75 * depsOn) * (1 - 0.8 * ripple) * (1 - 0.6 * fsOn);
    for (const e of EDGES) {
      const dp = P(t, e.t0, e.t0 + (e.grow ? 0.9 : 1.5), E.inOut);
      e.base.style.strokeDashoffset = (1 - dp).toFixed(4);
      let op = baseOp * (e.grow ? 1 + 1.4 * W(t, 46.9, 48.8, 0.4, 0.8) : 1);
      e.base.style.strokeOpacity = (dp > 0 ? op : 0).toFixed(4);
      // hot overlays
      let hot = 0, hp = 0;
      if (e.a.id === 'payments' && PAY_DEPS.includes(e.b.id)) { const s0 = 37.7 + PAY_DEPS.indexOf(e.b.id) * 0.32; hp = P(t, s0, s0 + 0.7, E.inOut); hot = Math.max(hot, depsOn * 0.95); }
      if (e.a.id in DEPTH && e.b.id in DEPTH && DEPTH[e.b.id] === DEPTH[e.a.id] + 1) { const s0 = 49.15 + DEPTH[e.a.id] * 0.55; const k = P(t, s0, s0 + 0.6, E.inOut); if (ripple > 0.001) { hp = Math.max(hp, k); hot = Math.max(hot, ripple * 0.9); } }
      if ((e.a.id === 'payments' && e.b.id === 'store') || (e.a.id === 'store' && e.b.id === 'checkout')) { const s0 = e.a.id === 'payments' ? 55.0 : 55.4; const k = P(t, s0, s0 + 0.7); if (fsOn > 0.001) { hp = Math.max(hp, k); hot = Math.max(hot, fsOn * 0.95); } }
      e.hot.style.strokeDashoffset = (1 - hp).toFixed(4);
      e.hot.style.strokeOpacity = (hot * (hp > 0 ? 1 : 0)).toFixed(4);
      e.hot.style.strokeWidth = '1.5';
    }

    // ---- pain scene ----
    const painVis = 1 - P(t, 15.9, 16.3);
    pain.style.display = painVis <= 0 ? 'none' : '';
    if (painVis > 0) {
      pain.style.transform = `scale(${(1 + 0.02 * P(t, 11.2, 14.0, E.inOut) - 0.02 * P(t, 14.0, 15.0)).toFixed(5)})`;
      // window frame & collapse
      const col = P(t, 15.0, 16.0, E.inOutQuint);
      const w = L(800, 10, col), hgt = L(470, 10, col), cx = L(960, NODES.checkout.x + 5, col), cy = L(465, NODES.checkout.y, col);
      css(win, { left: (cx - w / 2).toFixed(2) + 'px', top: (cy - hgt / 2).toFixed(2) + 'px', width: w.toFixed(2) + 'px', height: hgt.toFixed(2) + 'px', borderRadius: col > 0.85 ? (P(col, 0.85, 1) * 50).toFixed(1) + '%' : '0' });
      win.style.opacity = (P(t, 0, 0.5, E.out) * (1 - P(t, 15.8, 16.05, E.lin))).toFixed(3);
      win.style.borderColor = col > 0 ? `rgba(246,249,252,${L(0.18, 0.68, col).toFixed(3)})` : '';
      win.style.background = `rgba(10,26,43,${L(0.6, 1, col).toFixed(3)})`;
      winFrame.style.opacity = '0';
      winInner.style.opacity = (1 - P(t, 14.8, 15.1)).toFixed(3);
      // prompt typing
      const nch = Math.round(clamp((t - 0.3) / 1.1) * PROMPT.length);
      typed.textContent = PROMPT.slice(0, nch);
      caret.style.opacity = t < 1.5 ? (Math.floor(t * 2.4) % 2 === 0 || (t > 0.3 && t < 1.4) ? 1 : 0) : (Math.floor(t * 1.6) % 2 === 0 ? 0.6 : 0);
      // build / unbuild
      parts.forEach((el, i) => {
        const a = 1.5 + i * 0.13, b = 14.75 - i * 0.07;
        const k = P(t, a, a + 0.6, E.outExpo), u = P(t, b - 0.45, b, E.inOut);
        fade(el, k * (1 - u), (1 - k) * 10 + u * -6);
      });
      // strike + button
      const sk = P(t, 6.85, 7.25, E.out);
      strike.style.transform = `scaleX(${sk.toFixed(3)})`;
      ctaText.style.color = sk > 0 ? `rgba(246,249,252,${L(1, 0.5, sk).toFixed(3)})` : '';
      cta.style.borderColor = sk > 0 ? `rgba(246,249,252,${L(1, 0.4, sk).toFixed(3)})` : '';
      // timeline
      const tlo = P(t, 3.2, 3.8, E.out) * (1 - P(t, 14.9, 15.4));
      fade(tl, tlo, (1 - P(t, 3.2, 3.8, E.out)) * 8);
      const fwd = P(t, 3.7, 6.45, E.inOut), back = P(t, 13.85, 15.0, E.inOutQuint);
      const pos = fwd * (1 - back);
      ph.style.left = (pos * 600).toFixed(2) + 'px';
      run.style.width = (pos * 600).toFixed(2) + 'px';
      const atWk6 = W(t, 6.3, 14.0, 0.3, 0.4);
      ph.style.background = atWk6 > 0.01 ? `rgb(255,${Math.round(L(249, 138, atWk6))},${Math.round(L(252, 61, atWk6))})` : '';
      wks.forEach((el, i) => { const near = 1 - clamp(Math.abs(pos * 5 - i) / 0.8); el.style.color = `rgba(246,249,252,${L(0.26, 0.85, near).toFixed(3)})`; });
      rew.style.left = (pos * 600 - 16).toFixed(1) + 'px';
      rew.style.opacity = W(t, 13.85, 15.0, 0.2, 0.35).toFixed(3);
      // notice + connector
      const no = P(t, 6.4, 7.0, E.outExpo) * (1 - P(t, 13.8, 14.3));
      fade(notice, no, 0, (1 - P(t, 6.4, 7.0, E.outExpo)) * 24);
      conn.style.strokeDashoffset = (1 - P(t, 6.6, 7.1, E.inOut)).toFixed(4);
      conn.style.opacity = (1 - P(t, 13.8, 14.2)).toFixed(3);
      // ghost connectors
      for (const id of GHOST_ORDER) { const gi = GHOST_ORDER.indexOf(id), g0 = 7.8 + gi * 0.42; ghostLines[id].style.opacity = (P(t, g0 + 0.2, g0 + 0.9) * (1 - P(t, 14.3, 15.0))).toFixed(3); }
    }

    // ---- chrome ----
    fade($('#chrome'), W(t, 16.8, 62.9, 0.8, 0.6), 0);

    // ---- decision panel ----
    const pin = P(t, 31.15, 32.1, E.outExpo), pout = P(t, 43.6, 44.4, E.inOut);
    const pk = pin * (1 - pout);
    panel.style.transform = `translateX(${((1 - pk) * 780).toFixed(2)}px)`;
    panel.style.visibility = pk <= 0.0005 ? 'hidden' : 'visible';
    if (pk > 0) {
      pc.forEach((el, i) => { if (i < 6) rise(el, t, 31.55 + i * 0.12, 0.6, 10); });
      rise(pc[6], t, 32.35, 0.6, 10);
      const swap = P(t, 34.5, 34.85);
      opts.forEach((el, i) => rise(el, t, 32.4 + i * 0.08, 0.55, 8));
      bOpts.style.opacity = (P(t, 32.3, 32.6) * (1 - swap)).toFixed(3);
      bCmp.style.opacity = P(t, 34.7, 35.2, E.out).toFixed(3);
      bCmp.style.visibility = t < 34.7 ? 'hidden' : 'visible';
      bOpts.style.visibility = swap >= 1 ? 'hidden' : 'visible';
      cmpB.forEach((el, i) => { const k = P(t, 35.0 + i * 0.1, 35.7 + i * 0.1, E.outExpo); fade(el, k, 0, (1 - k) * 28); });
      // deps
      depsH.style.opacity = P(t, 37.4, 37.8).toFixed(3);
      depsLi.forEach((el, i) => { const s0 = 37.7 + i * 0.32; const k = P(t, s0, s0 + 0.4, E.out); fade(el, k, (1 - k) * 6); el.classList.toggle('hot', t >= s0 + 0.35 && t < 43.0); });
      // status chip
      const flip = P(t, T_APPROVE, T_APPROVE + 0.3);
      sAi.style.opacity = (1 - flip).toFixed(3); sDone.style.opacity = flip.toFixed(3);
      ap1.style.opacity = (1 - flip).toFixed(3); ap2.style.opacity = flip.toFixed(3);
      bApprove.style.filter = t > 42.1 && t < 42.3 ? 'brightness(.86)' : '';
      bCompare.style.borderColor = t >= 34.45 ? 'var(--fg)' : '';
    }

    // ---- foresight card ----
    const fk = W(t, 54.4, 58.9, 0.8, 0.5, E.outExpo);
    fade(fs, fk, 0, (1 - P(t, 54.4, 55.2, E.outExpo)) * 24);
    if (fk > 0) {
      const [nx, ny] = nodeScreen('store', t);
      const sx = nx + (20 + NODES.store.b.offsetWidth + 22) * c.s, x2 = 1080;
      fsLine.setAttribute('d', `M${sx.toFixed(1)} ${ny.toFixed(1)}C${(sx + 60).toFixed(1)} ${ny.toFixed(1)} ${x2 - 60} 360 ${x2} 360`);
      fsLine.style.strokeDashoffset = (1 - P(t, 54.9, 55.5)).toFixed(4);
      fsLine.style.opacity = fk.toFixed(3);
    } else fsLine.style.opacity = '0';

    // ---- legend ----
    fade(lg, W(t, 58.9, 63.0, 0.5, 0.5), 0);
    lgRows.forEach((r, i) => r.forEach(el => (el.style.opacity = P(t, 58.95 + i * 0.12, 59.4 + i * 0.12).toFixed(3))));

    // ---- tools ----
    const tOut = 1 - P(t, 71.3, 72.0);
    const tVis = t > 62.9 && t < 72.1;
    tools.style.visibility = tVis ? 'visible' : 'hidden';
    ol.style.opacity = tVis || fk > 0 ? '1' : '0';
    if (tVis) {
      toolEls.forEach((el, i) => { const k = P(t, 63.1 + i * 0.14, 63.8 + i * 0.14, E.outExpo); fade(el, k * tOut, 0, (1 - k) * -18); });
      { const k = P(t, 63.45, 64.1, E.outExpo); fade(mcp, k * tOut, (1 - k) * 10); }
      { const k = P(t, 63.75, 64.4, E.outExpo); fade(pane, k * tOut, 0, (1 - k) * 24); }
      toolPaths.forEach((p, i) => { p.style.strokeDashoffset = (1 - P(t, 63.7 + i * 0.1, 64.6 + i * 0.1)).toFixed(4); p.style.opacity = tOut.toFixed(3); });
      mcpPath.style.strokeDashoffset = (1 - P(t, 64.2, 64.9)).toFixed(4); mcpPath.style.opacity = tOut.toFixed(3);
      // pulses travel tool → mcp → pane
      [...toolPaths, mcpPath].forEach((p, i) => {
        const period = 1.6, off = i === 3 ? 0.55 : i * 0.22, tt = t - 64.9 - off;
        const c0 = pulses[i];
        if (tt < 0 || t > 71.2) { c0.setAttribute('opacity', 0); return; }
        const ph2 = (tt % period) / period, len = p.getTotalLength(), pt = p.getPointAtLength(E.inOut(clamp(ph2 / 0.7)) * len);
        c0.setAttribute('cx', pt.x.toFixed(2)); c0.setAttribute('cy', pt.y.toFixed(2));
        c0.setAttribute('opacity', (Math.sin(Math.PI * clamp(ph2 / 0.7)) * 0.9 * tOut).toFixed(3));
      });
      // terminal typing
      const TT = [64.5, 64.95, 65.35, 65.85, 66.15, 66.6, 67.0];
      termLines.forEach((el, i) => { const k = P(t, TT[i], TT[i] + 0.35, E.out); fade(el, k, (1 - k) * 4); });
      const sw = P(t, 67.85, 68.4, E.inOut);
      term.style.opacity = (1 - sw).toFixed(3);
      yamlLines.forEach((el, i) => { const k = P(t, 68.3 + i * 0.1, 68.7 + i * 0.1, E.out); fade(el, k, (1 - k) * 4); });
      yamlPre.style.opacity = sw > 0 ? '1' : '0';
      // tab underline
      const t0 = tabs[0], t1 = tabs[1];
      const ux = L(t0.offsetLeft, t1.offsetLeft, sw), uw = L(t0.offsetWidth, t1.offsetWidth, sw);
      css(uline, { left: ux.toFixed(1) + 'px', width: uw.toFixed(1) + 'px', top: '47px' });
      t0.classList.toggle('on', sw < 0.5); t1.classList.toggle('on', sw >= 0.5);
    } else { pulses.forEach(c0 => c0.setAttribute('opacity', 0)); toolPaths.forEach(p => (p.style.opacity = '0')); mcpPath.style.opacity = '0'; }

    // ---- end card ----
    const eOut = 1 - P(t, 84.9, 86.0, E.inOut);
    { const k = P(t, 72.6, 74.0, E.outExpo); fade(mark, k * eOut, (1 - k) * 14); }
    { const k = P(t, 76.2, 77.0, E.outExpo); join.style.opacity = (k * eOut).toFixed(3); join.style.transform = `translate(-50%,${((1 - k) * 10).toFixed(2)}px)`; }
    { const k = P(t, 79.0, 79.9, E.out); llc.style.opacity = (k * eOut).toFixed(3); }
    endc.style.visibility = t > 72.5 ? 'visible' : 'hidden';

    // ---- cursor ----
    let cv = 0; for (const [a, b] of CUR_VIS) cv = Math.max(cv, W(t, a, b, 0.3, 0.35));
    cur.style.visibility = cv > 0.001 ? 'visible' : 'hidden';
    if (cv > 0.001) {
      const [x, y] = cursorAt(t);
      let press = 0, rk = -1; for (const tp of TAPS) { press = Math.max(press, W(t, tp - 0.08, tp + 0.18, 0.08, 0.15)); if (t >= tp && t < tp + 0.55) rk = (t - tp) / 0.55; }
      cur.style.opacity = cv.toFixed(3);
      cur.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px)`;
      $('svg', cur).style.transform = `scale(${(1 - 0.12 * press).toFixed(3)})`;
      if (rk >= 0) { const r = E.out(rk); ring.style.opacity = ((1 - rk) * 0.7).toFixed(3); ring.style.transform = `scale(${L(0.5, 2.6, r).toFixed(3)})`; }
      else ring.style.opacity = '0';
    }
  }

  // ---------- player / capture ----------
  const params = new URLSearchParams(location.search);
  const capture = params.has('capture');
  if (capture) document.body.classList.add('capture');
  const fit = () => { if (capture) { stage.style.transform = ''; return; } const s = Math.min(innerWidth / 1920, innerHeight / 1080); stage.style.transform = `scale(${s})`; };
  addEventListener('resize', fit); fit();

  // reduced motion: show one settled still per narration line instead of continuous motion
  const STILLS = TL.cues.map(c => ({ at: c.start, frame: Math.max(c.start, c.end - 0.15) }));
  const stillFor = t => { let f = 0.6; for (const s of STILLS) if (t >= s.at) f = s.frame; return f; };
  const mq = matchMedia('(prefers-reduced-motion: reduce)');

  window.BP = { seek, ready: false, duration: TL.duration, timeline: TL };
  document.fonts.ready.then(() => {
    seek(0); window.BP.ready = true;
    if (capture) return;
    let playing = true, t = 0, last = performance.now(), shown = -1;
    const pp = $('#pp'), scrub = $('#scrub'), clock = $('#clock'), cc = $('#cc'), cap = $('#caption'), rm = $('#rm');
    let captions = false;
    pp.onclick = () => { playing = !playing; pp.textContent = playing ? 'Pause' : 'Play'; last = performance.now(); };
    scrub.oninput = () => { t = +scrub.value; shown = -1; };
    cc.onclick = () => { captions = !captions; cc.setAttribute('aria-pressed', captions); };
    const loop = now => {
      if (playing) { t += (now - last) / 1000; if (t >= TL.duration) t = 0; }
      last = now;
      const reduce = mq.matches;
      rm.textContent = reduce ? 'Reduced motion: stills' : '';
      const ft = reduce ? stillFor(t) : t;
      if (ft !== shown) { seek(ft); shown = reduce ? ft : -1; }
      scrub.value = t.toFixed(2); clock.textContent = t.toFixed(1).padStart(4, '0');
      const cue = TL.cues.find(c => t >= c.start && t < c.end + 0.25);
      cap.style.display = captions && cue ? 'block' : 'none'; if (cue) cap.textContent = cue.text;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });
})();
