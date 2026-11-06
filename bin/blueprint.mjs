#!/usr/bin/env node
// Blueprint CLI: one entry point that survives a fresh checkout (no node_modules, no mcp/dist).
//   node bin/blueprint.mjs bootstrap | mcp | serve | init <name> | projects | export <id> [file] | import <file> | connect <claude|cursor|vscode> | doctor
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync, spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MCP = path.join(ROOT, 'mcp');
const DIST = path.join(MCP, 'dist', 'index.js');
const log = (...a) => console.error('[blueprint]', ...a);   // stderr only: stdout belongs to the MCP protocol
const srcHash = () => crypto.createHash('sha256').update(fs.readFileSync(path.join(MCP, 'src', 'index.ts'))).digest('hex').slice(0, 16);
const run = (cmd, args, cwd) => { const r = spawnSync(cmd, args, { cwd, stdio: ['ignore', 2, 2], shell: process.platform === 'win32' }); if (r.status !== 0) { log(`failed: ${cmd} ${args.join(' ')}`); process.exit(1); } };

export function bootstrap() {
  const major = Number(process.versions.node.split('.')[0]);
  if (major < 20) { log(`Node 20+ required (found ${process.versions.node})`); process.exit(1); }
  if (!fs.existsSync(path.join(MCP, 'node_modules', '@modelcontextprotocol'))) {
    log('installing dependencies (first run only)...');
    run('npm', [fs.existsSync(path.join(MCP, 'package-lock.json')) ? 'ci' : 'install', '--no-audit', '--no-fund'], MCP);
  }
  const stamp = path.join(MCP, 'dist', '.src-sha');
  const cur = srcHash();
  if (!fs.existsSync(DIST) || !fs.existsSync(stamp) || fs.readFileSync(stamp, 'utf8') !== cur) {
    log('building mcp/dist (missing or out of date)...');
    run(process.execPath, [path.join(MCP, 'node_modules', 'typescript', 'bin', 'tsc')], MCP);
    fs.writeFileSync(stamp, cur);
  }
}
const argv = process.argv.slice(2);
const flag = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 ? argv[i + 1] : d; };
const cmd = argv[0];
const wsmod = async f => import(pathToFileURL(path.join(MCP, 'workspace', f)).href);

const CONFIGS = {
  claude: () => `claude mcp add blueprint -- node ${path.join(ROOT, 'bin', 'blueprint.mjs')} mcp`,
  cursor: () => JSON.stringify({ mcpServers: { blueprint: { command: 'node', args: [path.join(ROOT, 'bin', 'blueprint.mjs'), 'mcp'] } } }, null, 2),
  vscode: () => JSON.stringify({ servers: { blueprint: { type: 'stdio', command: 'node', args: [path.join(ROOT, 'bin', 'blueprint.mjs'), 'mcp'] } } }, null, 2),
};

if (!cmd || cmd === 'help' || cmd === '--help') {
  console.log(`blueprint <command>
  bootstrap            install dependencies and build mcp/dist if missing
  mcp                  run the MCP server over stdio (bootstraps first)
  serve [--port N]     open the browser workspace on 127.0.0.1 (default port 4173)
  init <name>          create a project in your workspace
  projects             list projects
  export <id> [file]   write a project export (no pending proposals, no secrets)
  import <file>        import an export as a NEW project
  connect <claude|cursor|vscode>   print the config for your editor
  doctor               check Node, deps, build, workspace folder
Workspace folder: $BLUEPRINT_HOME or ~/.blueprint (each folder is fully independent)`);
} else if (cmd === 'bootstrap') { bootstrap(); log('ok'); }
else if (cmd === 'mcp') { bootstrap(); const c = spawn(process.execPath, [DIST], { stdio: 'inherit' }); c.on('exit', code => process.exit(code ?? 0)); }
else if (cmd === 'connect') { const f = CONFIGS[argv[1]]; if (!f) { log('usage: connect <claude|cursor|vscode>'); process.exit(1); } console.log(f()); }
else if (cmd === 'doctor') {
  const ok = (n, v, h = '') => console.log(`${v ? 'ok  ' : 'FAIL'} ${n}${v ? '' : ' — ' + h}`);
  ok('node >= 20', Number(process.versions.node.split('.')[0]) >= 20, 'install Node 20+');
  ok('dependencies installed', fs.existsSync(path.join(MCP, 'node_modules', '@modelcontextprotocol')), 'run: node bin/blueprint.mjs bootstrap');
  ok('mcp/dist built and current', fs.existsSync(DIST) && fs.existsSync(path.join(MCP, 'dist', '.src-sha')) && fs.readFileSync(path.join(MCP, 'dist', '.src-sha'), 'utf8') === srcHash(), 'run: node bin/blueprint.mjs bootstrap');
  const { homeDir } = await wsmod('store.mjs').catch(() => ({ homeDir: () => '?' }));
  console.log('workspace folder:', homeDir());
} else {
  bootstrap();
  const store = await wsmod('store.mjs'); const home = store.homeDir();
  try {
    if (cmd === 'init') { const s = store.createProject(home, { name: argv.slice(1).join(' ') }); console.log(`created ${s.id} in ${home}`); }
    else if (cmd === 'projects') console.table(store.listProjects(home));
    else if (cmd === 'export') { const b = JSON.stringify(store.exportProject(home, argv[1]), null, 2); if (argv[2]) { fs.writeFileSync(argv[2], b); console.log('wrote', argv[2]); } else console.log(b); }
    else if (cmd === 'import') { const s = store.importProject(home, JSON.parse(fs.readFileSync(argv[1], 'utf8'))); console.log(`imported as ${s.id} (no approvals or pending proposals carried over)`); }
    else if (cmd === 'serve') {
      const { createServer } = await wsmod('server.mjs');
      const s = await createServer({ home, port: Number(flag('port', 4173)) });
      console.log(`Blueprint workspace: ${s.origin}/   (folder: ${home})\nPress Ctrl+C to stop. Pending proposals are saved on disk and wait for you.`);
    } else { log('unknown command: ' + cmd); process.exit(1); }
  } catch (e) { log(e.message); process.exit(1); }
}
