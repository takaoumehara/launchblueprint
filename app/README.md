# Blueprint web app（round 5）
ノンエンジニア向けの4画面：1 始める → 2 地図（上に段ごとの進み具合） → 3 決める → 4 カタログ（全42分野）。既定は黒い画面（右上で LIGHT / DARK、JA / EN を切替）。スマホでは段ごとの一覧の左に同じ依存の線を引く。データは `skill/blueprint/catalog/*.yaml` と `skill/blueprint/elements/`。
- `npm ci && npm run build` → `dist/`（静的。`/data.json` と `/llms.txt` も出る）
- 地図の線は `tactics.yaml` の `depends_on` だけから引く。段の帯は `tactics.yaml` の `stage` と `stages[]` から数える
- `data.json` にはカタログ全項目（`items`）と分野の一覧（`catalog`）が入る。歩き方は `../skill/blueprint/reference/walkthrough-non-engineer.md`
- 決めた内容はブラウザの localStorage。`project-map.template.yaml` と同じ形の YAML／Markdown で書き出せる
- Vercel：Root Directory を `app/` にすると親フォルダの YAML が読めないので、ローカルで build して `dist/` を出すか、Root を repo 直下にして `cd app && npm ci && npm run build` を Build Command にする
- 決める画面の「おすすめ」は、始める画面の答えと `tactics.yaml` の `pick_when` / `ai_pick` から出る決まりベース（AI ではない、と画面にも明記）。本物の AI に聞く機能は旗で切替：ビルド時 `VITE_BP_AI_PICK=on`、ホスト側 `BP_AI_PICK=on` と `ANTHROPIC_API_KEY`（サーバーだけ。`api/ai-pick.js` が Anthropic SDK で `claude-opus-5-5` に JSON で聞く。鍵はリポジトリに置かない）。既定は off。`.env.example` 参照。AI の答えは選択肢の id 以外を受け付けず、未確認の料金を含む時はその旨を出す
- `npm test`：`test/data.test.mjs`（5 段・依存の循環なし・全 tactic に日英ラベル・tech の choose に比較がある）と `test/ai-pick.test.mjs`（AI 呼び出しをモック）
