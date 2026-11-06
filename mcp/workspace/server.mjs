// Blueprint local workspace server. Binds 127.0.0.1 only. Serves the browser workspace and a small JSON API.
// Human-only actions (approve / reject / decide / create / import) need the session token, which is handed
// to the page it serves and is never written to disk or exposed through MCP.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import * as store from './store.mjs';
import { loadTopics, downstream } from './topics.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PUB = path.join(HERE, 'public');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };

export function createServer({ home = store.homeDir(), port = 0, env = process.env } = {}) {
  const T = loadTopics(env);
  const token = crypto.randomBytes(24).toString('hex');
  let origin = '';
  const send = (res, code, body, type = 'application/json; charset=utf-8') => { res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', 'referrer-policy': 'no-referrer', 'content-security-policy': "default-src 'self'; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'" }); res.end(typeof body === 'string' ? body : JSON.stringify(body)); };
  const body = req => new Promise((ok, no) => { let b = ''; req.on('data', c => { b += c; if (b.length > 2e6) { no(new store.StoreError('too_large', 'body too large')); req.destroy(); } }); req.on('end', () => { try { ok(b ? JSON.parse(b) : {}); } catch { no(new store.StoreError('bad_json', 'invalid JSON')); } }); });
  const humanOk = req => req.headers['x-bp-token'] === token && [origin, origin.replace('127.0.0.1', 'localhost')].includes(req.headers.origin) && (!req.headers['sec-fetch-site'] || req.headers['sec-fetch-site'] === 'same-origin');

  const view = id => { const s = store.getProject(home, id); return { ...s, proposals: s.proposals.map(p => ({ ...p, affects: downstream(T.topics, p.topic) })) }; };

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://x');
      const host = req.headers.host || '';
      if (!/^(127\.0\.0\.1|localhost|\[::1\]):\d+$/.test(host)) return send(res, 403, { error: 'bad_host' }); // DNS-rebinding guard
      if (url.pathname.startsWith('/api/')) {
        const m = req.method, p = url.pathname;
        if (m === 'GET' && p === '/api/session') return send(res, 200, { token, home: path.basename(home) === '.blueprint' ? '~/.blueprint' : '(custom BLUEPRINT_HOME)' });
        if (m === 'GET' && p === '/api/topics') return send(res, 200, T);
        if (m === 'GET' && p === '/api/projects') return send(res, 200, store.listProjects(home));
        if (m === 'POST' && p === '/api/projects') { if (!humanOk(req)) return send(res, 403, { error: 'human_only' }); const s = store.createProject(home, await body(req)); return send(res, 200, view(s.id)); }
        if (m === 'POST' && p === '/api/import') { if (!humanOk(req)) return send(res, 403, { error: 'human_only' }); const s = store.importProject(home, await body(req)); return send(res, 200, view(s.id)); }
        const r = p.match(/^\/api\/p\/([a-z0-9-]+)(?:\/(decide|choice|export))?$/);
        if (r) {
          const [, id, act] = r;
          if (m === 'GET' && !act) { const since = Number(url.searchParams.get('since')); const s = store.getProject(home, id); if (since && since === s.seq) return send(res, 200, { seq: s.seq, unchanged: true }); return send(res, 200, view(id)); }
          if (m === 'GET' && act === 'export') return send(res, 200, store.exportProject(home, id));
          if (m === 'POST' && (act === 'decide' || act === 'choice')) {
            if (!humanOk(req)) return send(res, 403, { error: 'human_only', message: 'approval must come from the browser session' });
            const b = await body(req);
            if (act === 'decide') store.decide(home, id, b); else store.setChoice(home, id, b, T.topics);
            return send(res, 200, view(id));
          }
        }
        return send(res, 404, { error: 'not_found' });
      }
      const f = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
      const fp = path.join(PUB, f);
      if (!fp.startsWith(PUB + path.sep) || !fs.existsSync(fp)) return send(res, 404, 'not found', 'text/plain');
      return send(res, 200, fs.readFileSync(fp, "utf8"), MIME[path.extname(fp)] || 'application/octet-stream');
    } catch (e) {
      if (e instanceof store.StoreError) return send(res, { not_found: 404, stale: 409, changed: 409, not_pending: 409, locked: 503 }[e.code] || 400, { error: e.code, message: e.message, ...e.extra });
      return send(res, 500, { error: 'internal' });
    }
  });
  return new Promise(ok => server.listen(port, '127.0.0.1', () => {
    const addr = server.address(); origin = `http://127.0.0.1:${addr.port}`;
    ok({ server, port: addr.port, origin, token, close: () => new Promise(r => server.close(r)) });
  }));
}
