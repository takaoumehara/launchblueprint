// Blueprint local workspace store. Zero dependencies. One folder per workspace (BLUEPRINT_HOME),
// one state.json per project. Agents (MCP) may only call the "agent" exports; the "human" exports
// are used by the local web server behind a same-origin session token.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';

export const homeDir = (env = process.env) => path.resolve(env.BLUEPRINT_HOME || path.join(os.homedir(), '.blueprint'));
const projectsDir = home => path.join(home, 'projects');
const slug = s => (String(s).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'project').slice(0, 40);
const now = () => new Date().toISOString();
const rid = p => p + '_' + crypto.randomBytes(5).toString('hex');
export class StoreError extends Error { constructor(code, message, extra = {}) { super(message); this.code = code; this.extra = extra; } }
const fail = (code, msg, extra) => { throw new StoreError(code, msg, extra); };

// Fields an agent must never be able to set. They are rejected (not silently dropped) so a prompt-injected
// "ownerApproved: true" is visible as an error instead of looking like it worked.
const FORBIDDEN = ['ownerApproved', 'owner_approved', 'approved', 'status', 'state', 'decidedBy', 'decided_by', 'by', 'decision', 'human', 'rev', 'baseRev', 'version'];

const dirOf = (home, id) => {
  if (!/^[a-z0-9][a-z0-9-]{0,40}$/.test(String(id))) fail('bad_id', 'invalid project id');
  return path.join(projectsDir(home), id);
};
const fileOf = (home, id) => path.join(dirOf(home, id), 'state.json');

function withLock(home, id, fn) {
  const lock = path.join(dirOf(home, id), '.lock');
  const t0 = Date.now();
  for (;;) {
    try { fs.mkdirSync(lock); break; }
    catch (e) {
      if (e.code !== 'EEXIST') throw e;
      try { if (Date.now() - fs.statSync(lock).mtimeMs > 10000) fs.rmSync(lock, { recursive: true }); } catch {}
      if (Date.now() - t0 > 5000) fail('locked', 'project is locked by another process');
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 20);
    }
  }
  try { return fn(); } finally { try { fs.rmdirSync(lock); } catch {} }
}
function readState(home, id) {
  const f = fileOf(home, id); let raw; try { raw = fs.readFileSync(f, 'utf8'); } catch { fail('not_found', `project "${id}" not found`); }
  return JSON.parse(raw);
}
function writeState(home, id, s) {
  const f = fileOf(home, id), tmp = f + '.' + process.pid + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(s, null, 2), { mode: 0o600 });
  fs.renameSync(tmp, f);
}
const mutate = (home, id, fn) => withLock(home, id, () => { const s = readState(home, id); const out = fn(s); writeState(home, id, s); return out; });
const event = (s, type, data) => { s.seq += 1; s.history.push({ seq: s.seq, ts: now(), type, ...data }); };

// ---------- projects ----------
export function listProjects(home) {
  const d = projectsDir(home); if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter(n => fs.existsSync(path.join(d, n, 'state.json'))).map(id => {
    const s = readState(home, id);
    return { id, name: s.name, goal: s.goal, seq: s.seq, decided: Object.keys(s.choices).length, pending: s.proposals.filter(p => p.state === 'proposed').length, updated: s.updated };
  }).sort((a, b) => String(b.updated).localeCompare(String(a.updated)));
}
export function createProject(home, { name, goal = '', profile = {} }) {
  name = String(name || '').trim(); if (!name) fail('bad_input', 'name is required');
  fs.mkdirSync(projectsDir(home), { recursive: true, mode: 0o700 });
  let id = slug(name), n = 1; while (fs.existsSync(path.join(projectsDir(home), id))) id = slug(name) + '-' + (++n);
  fs.mkdirSync(dirOf(home, id));
  const s = { schema: 1, id, name, goal: String(goal), profile, created: now(), updated: now(), seq: 0, choices: {}, proposals: [], history: [] };
  event(s, 'created', { actor: 'human' });
  writeState(home, id, s); return s;
}
export const getProject = (home, id) => readState(home, id);

// ---------- agent surface (what the MCP server exposes) ----------
export function propose(home, id, input, topics) {
  for (const k of FORBIDDEN) if (k in input) fail('forbidden_field', `"${k}" cannot be set by an agent; only the owner decides in the browser`);
  const { topic, pick, reason = '', alternatives = [], author = 'agent' } = input;
  const t = topics[topic]; if (!t) fail('unknown_topic', `unknown topic "${topic}"`);
  const optionIds = t.options.map(o => o.id);
  if (!optionIds.includes(pick)) fail('bad_option', `"${pick}" is not an option of ${topic}`, { options: optionIds });
  const alts = alternatives.map(a => ({ option: String(a.option), why: String(a.why || '').slice(0, 300) })).filter(a => optionIds.includes(a.option) && a.option !== pick);
  return mutate(home, id, s => {
    const base = s.choices[topic]?.rev || 0;
    let p = s.proposals.find(x => x.topic === topic && x.state === 'proposed' && x.author === author);
    if (p) { // amend: bump the version so a browser showing the old one cannot approve it blindly
      p.versions.push({ version: p.version, pick: p.pick, reason: p.reason, at: p.updatedAt });
      Object.assign(p, { pick, reason: String(reason).slice(0, 600), alternatives: alts, version: p.version + 1, baseRev: base, updatedAt: now() });
      event(s, 'amended', { actor: author, proposalId: p.id, topic, version: p.version });
    } else {
      p = { id: rid('prop'), topic, pick, reason: String(reason).slice(0, 600), alternatives: alts, baseRev: base, version: 1, versions: [], state: 'proposed', author, createdAt: now(), updatedAt: now(), decision: null };
      s.proposals.push(p); event(s, 'proposed', { actor: author, proposalId: p.id, topic, pick });
    }
    s.updated = now(); return p;
  });
}
export const withdraw = (home, id, proposalId, author = 'agent') => mutate(home, id, s => {
  const p = s.proposals.find(x => x.id === proposalId); if (!p) fail('not_found', 'proposal not found');
  if (p.state !== 'proposed') fail('not_pending', `proposal is ${p.state}`);
  p.state = 'withdrawn'; p.decision = { by: author, at: now(), note: '' }; event(s, 'withdrawn', { actor: author, proposalId, topic: p.topic }); s.updated = now(); return p;
});
// What an agent may read: everything, including how its earlier proposals ended.
export const agentView = (home, id) => { const s = readState(home, id); return { ...s, history: s.history.slice(-30) }; };

// ---------- human surface (local web server only; never imported by the MCP tools) ----------
export function decide(home, id, { proposalId, decision, seenVersion, note = '' }) {
  if (!['approve', 'reject'].includes(decision)) fail('bad_input', 'decision must be approve or reject');
  return mutate(home, id, s => {
    const p = s.proposals.find(x => x.id === proposalId); if (!p) fail('not_found', 'proposal not found');
    if (p.state !== 'proposed' && p.state !== 'stale') fail('not_pending', `proposal is already ${p.state}`, { state: p.state });
    if (seenVersion !== p.version) fail('changed', 'the proposal changed after you opened it; review it again', { version: p.version });
    const cur = s.choices[p.topic]?.rev || 0;
    if (decision === 'reject') {
      p.state = 'rejected'; p.decision = { by: 'human', at: now(), note: String(note).slice(0, 300) };
      event(s, 'rejected', { actor: 'human', proposalId: p.id, topic: p.topic, pick: p.pick }); s.updated = now(); return p;
    }
    if (p.state === 'stale' || p.baseRev !== cur) { // a newer decision exists: never overwrite it
      p.state = 'stale'; event(s, 'stale', { actor: 'system', proposalId: p.id, topic: p.topic, baseRev: p.baseRev, currentRev: cur });
      s.updated = now(); writeState(home, id, s);
      fail('stale', 'a newer decision exists for this topic; this proposal was not applied. Reject it or ask the agent to propose again.', { baseRev: p.baseRev, currentRev: cur });
    }
    s.choices[p.topic] = { pick: p.pick, reason: p.reason, rev: cur + 1, decidedBy: 'human', proposalId: p.id, at: now() };
    p.state = 'approved'; p.decision = { by: 'human', at: now(), note: String(note).slice(0, 300) };
    event(s, 'approved', { actor: 'human', proposalId: p.id, topic: p.topic, pick: p.pick });
    markStale(s, p.topic, p.id); s.updated = now(); return p;
  });
}
function markStale(s, topic, exceptId) {
  for (const q of s.proposals) if (q.topic === topic && q.state === 'proposed' && q.id !== exceptId) { q.state = 'stale'; event(s, 'stale', { actor: 'system', proposalId: q.id, topic, reason: 'newer decision' }); }
}
// The owner picks an option directly in the browser (no proposal). Pending proposals on the topic become stale.
export function setChoice(home, id, { topic, pick, reason = '' }, topics) {
  const t = topics[topic]; if (!t) fail('unknown_topic', `unknown topic "${topic}"`);
  if (!t.options.some(o => o.id === pick)) fail('bad_option', `"${pick}" is not an option of ${topic}`);
  return mutate(home, id, s => {
    const rev = (s.choices[topic]?.rev || 0) + 1;
    s.choices[topic] = { pick, reason: String(reason).slice(0, 600), rev, decidedBy: 'human', proposalId: null, at: now() };
    event(s, 'decided', { actor: 'human', topic, pick }); markStale(s, topic, null); s.updated = now(); return s.choices[topic];
  });
}

// ---------- explicit export / import (the only way a project moves between workspaces) ----------
const sha = o => crypto.createHash('sha256').update(JSON.stringify(o)).digest('hex');
export function exportProject(home, id) {
  const s = readState(home, id);
  const payload = { name: s.name, goal: s.goal, profile: s.profile, choices: s.choices,
    history: s.history.filter(e => ['approved', 'rejected', 'decided', 'created'].includes(e.type)).map(({ seq, ts, type, topic, pick }) => ({ seq, ts, type, topic, pick })) };
  return { format: 'blueprint-project-export', schema: 1, exportedAt: now(), note: 'Pending/stale proposals and approvals are never exported. Checksum detects corruption, not authorship.', payload, sha256: sha(payload) };
}
export function importProject(home, bundle) {
  if (bundle?.format !== 'blueprint-project-export' || bundle.schema !== 1) fail('bad_input', 'not a Blueprint export');
  if (sha(bundle.payload) !== bundle.sha256) fail('bad_checksum', 'export file was modified or damaged');
  const { name, goal, profile, choices, history } = bundle.payload;
  const s = createProject(home, { name: name + ' (imported)', goal, profile });
  return mutate(home, s.id, st => {
    st.choices = Object.fromEntries(Object.entries(choices || {}).map(([k, v]) => [k, { ...v, decidedBy: 'human', imported: true }]));
    event(st, 'imported', { actor: 'human', decisions: Object.keys(st.choices).length, originalHistory: history?.length || 0 }); return st;
  });
}
