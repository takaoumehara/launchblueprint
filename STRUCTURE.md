# Blueprint — structure / 構成

- `QUICKSTART.md` / `QUICKSTART.ja.md` — 5分ではじめる（アプリ・MCP・地図の読み方）/ 5-minute start for people and AI agents.
- `skill/blueprint/` — 新しい Blueprint スキル本体（SKILL.md, reference/, catalog/, elements/, templates/）/ The current Blueprint skill.
- `app/` — ウェブアプリ（始める → 地図 → 決める → カタログ）/ web app. `cd app && npm ci && npm run build`.
- `mcp/` — AI が読む MCP サーバー（本体は読むだけ。書くのは `mcp/inbox/` の提案と地図の下書き）/ MCP server; writes only to `mcp/inbox/` (proposals, project-map drafts). `cd mcp && npm ci && npm run build && npm test`.
- `shared/decide-core.mjs` — 判断の好みで採点し決定の記録を作る共通部品（MCP とアプリ）/ scoring and decision records shared by the MCP and the app.
- `skill/blueprint/preferences/`, `skill/blueprint/project-maps/` — 判断の好みと共有するプロジェクトの地図（アプリの `#/p/<slug>`）/ preference profiles and shared project maps.
- `po-input/` — 驚きの記録（1 件 1 枚、`TEMPLATE-surprise.md` をコピー）。`skill/blueprint/reference/feedback-loop.md` の手順で rule・tactic に戻す / Surprise records that feed back into rules and tactics.
- `drafts/` — v3 設計の下書き（12カテゴリー、GTM・運用、出口・アプリ配布、カタログ、試作画面）/ v3 working drafts.
- `ui/proto-round3/` — 画面の第3案（線と点のマップ）/ UI prototype round 3. Open `ui/proto-round3/index.html`.
- `legacy/launch-blueprint/` — 旧 launch-blueprint の保存版（README-v0.2.md 含む）/ archived previous skill.
- `skills/` — 以前からある launch-blueprint v0.2（履歴保持のため残しています）/ earlier v0.2 kept for history.

- `docs/portfolio.md` / `docs/portfolio.ja.md` — 5 つの実プロダクトの地図（`#/p/<slug>`）と穴の一覧。画面写真は `docs/screens/`、根拠の入力は `mcp/portfolio/`、作り直しは `mcp/scripts/build-portfolio.mjs` / Five real project maps, gap list, screenshots and their evidence inputs.

Screenshots (*.png) and archives (*.zip) are excluded via .gitignore, except `docs/screens/*.png` and `ui/**/*.png`.

© 2026 CREATIVITY IS EVERYWHERE, LLC
