-- Blueprint hub, phase 1 (internal bots). (c) CREATIVITY IS EVERYWHERE, LLC
-- api_keys: per-bot keys, SHA-256 hex of the key only (the plaintext is never stored).
CREATE TABLE IF NOT EXISTS api_keys (
  key_hash   TEXT PRIMARY KEY CHECK (length(key_hash) = 64),
  bot_name   TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'bot' CHECK (role IN ('bot', 'reviewer')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  revoked    INTEGER NOT NULL DEFAULT 0 CHECK (revoked IN (0, 1))
);
CREATE INDEX IF NOT EXISTS api_keys_bot ON api_keys (bot_name);

-- submissions: one propose_learning call that passed the screen, in four layers.
--   layer 1 principle_json, layer 2 claims_json (every claim status "unverified", verified false),
--   layer 3 context_json (no names), layer 4 occurrences table (count per merge target).
-- Rejected calls (PII, secrets, schema) are not stored.
CREATE TABLE IF NOT EXISTS submissions (
  id                TEXT PRIMARY KEY,
  bot_name          TEXT NOT NULL,
  created_at        TEXT NOT NULL,
  schema            TEXT NOT NULL DEFAULT 'blueprint.learning/v2',
  kind              TEXT NOT NULL CHECK (kind IN ('rule', 'component_map_update')),
  category          TEXT NOT NULL,
  principle_json    TEXT,
  claims_json       TEXT NOT NULL DEFAULT '[]',
  context_json      TEXT,
  text              TEXT,
  match_text        TEXT NOT NULL,
  fingerprint       TEXT NOT NULL,
  merge_target      TEXT,              -- catalog id or root submission id suggested by the duplicate check
  needs_structuring INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS submissions_fingerprint ON submissions (fingerprint);
CREATE INDEX IF NOT EXISTS submissions_merge_target ON submissions (merge_target);

-- review_queue: every stored submission waits here. Nothing reaches the catalog without a reviewer.
CREATE TABLE IF NOT EXISTS review_queue (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id TEXT NOT NULL UNIQUE REFERENCES submissions (id),
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  flags         TEXT NOT NULL DEFAULT '[]',   -- JSON array, e.g. ["duplicate_of:val.pay-signal", "contradicts:R-004"]
  check_results TEXT NOT NULL,                -- JSON of the auto-check pipeline (src/checks.ts CheckResult)
  created_at    TEXT NOT NULL,
  reviewed_at   TEXT,
  reviewer      TEXT,
  note          TEXT
);
CREATE INDEX IF NOT EXISTS review_queue_status ON review_queue (status, created_at);

-- occurrences: layer 4. One row per cluster key (a catalog id, or the root submission of a new learning).
CREATE TABLE IF NOT EXISTS occurrences (
  target_id   TEXT PRIMARY KEY,
  target_type TEXT NOT NULL CHECK (target_type IN ('catalog', 'submission')),
  count       INTEGER NOT NULL DEFAULT 1,
  bots        TEXT NOT NULL DEFAULT '[]',    -- JSON array of distinct bot names (distinct_submitters for the merge gate)
  first_seen  TEXT NOT NULL,
  last_seen   TEXT NOT NULL
);
