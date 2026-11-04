# Blueprint — structure / 構成

- `QUICKSTART.md` / `QUICKSTART.ja.md` — 5分ではじめる（アプリ・MCP・地図の読み方）/ 5-minute start for people and AI agents.
- `skill/blueprint/` — 新しい Blueprint スキル本体（SKILL.md, reference/, catalog/, elements/, templates/）/ The current Blueprint skill.
- `app/` — ウェブアプリ（始める → 地図 → 決める → カタログ）/ web app. `cd app && npm ci && npm run build`.
- `mcp/` — AI が読む MCP サーバー（読むだけ）/ read-only MCP server. `cd mcp && npm ci && npm run build && npm test`.
- `po-input/` — 驚きの記録（1 件 1 枚、`TEMPLATE-surprise.md` をコピー）。`skill/blueprint/reference/feedback-loop.md` の手順で rule・tactic に戻す / Surprise records that feed back into rules and tactics.
- `docs/hub/` — ホスト型 MCP サーバー（Blueprint Hub）の設計書（DESIGN.md、project-map.yaml、stack-comparison.yaml、TERMS-draft.md＝法務レビュー前の下書き）/ design of the hosted, growing MCP server. Docs only; nothing deployed.
- `drafts/` — v3 設計の下書き（12カテゴリー、GTM・運用、出口・アプリ配布、カタログ、試作画面）/ v3 working drafts.
- `ui/proto-round3/` — 画面の第3案（線と点のマップ）/ UI prototype round 3. Open `ui/proto-round3/index.html`.
- `legacy/launch-blueprint/` — 旧 launch-blueprint の保存版（README-v0.2.md 含む）/ archived previous skill.
- `skills/` — 以前からある launch-blueprint v0.2（履歴保持のため残しています）/ earlier v0.2 kept for history.

Screenshots (*.png) and archives (*.zip) are excluded via .gitignore.

© 2026 CREATIVITY IS EVERYWHERE, LLC
