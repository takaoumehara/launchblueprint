// Test helper: a D1-shaped adapter over node:sqlite, with the hub's migrations applied.
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import type { D1Like, D1Stmt } from "../src/store.ts";

export function memoryD1(): D1Like & { raw: DatabaseSync } {
  const raw = new DatabaseSync(":memory:");
  const dir = path.resolve(import.meta.dirname, "../migrations");
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith(".sql")).sort()) raw.exec(fs.readFileSync(path.join(dir, f), "utf8"));
  const stmt = (sql: string, vals: unknown[] = []): D1Stmt => ({
    bind: (...v: unknown[]) => stmt(sql, v),
    first: async <T>() => (raw.prepare(sql).get(...(vals as any[])) as T) ?? null,
    all: async <T>() => ({ results: raw.prepare(sql).all(...(vals as any[])) as T[] }),
    run: async () => raw.prepare(sql).run(...(vals as any[])),
  });
  return {
    raw,
    prepare: (sql: string) => stmt(sql),
    batch: async (stmts: D1Stmt[]) => { raw.exec("BEGIN"); try { const r = []; for (const s of stmts) r.push(await s.run()); raw.exec("COMMIT"); return r; } catch (e) { raw.exec("ROLLBACK"); throw e; } },
  };
}
