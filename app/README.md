# Blueprint web app（round 5）
ノンエンジニア向けの3画面：1 始める → 2 地図 → 3 決める。データは `skill/blueprint/catalog/*.yaml` と `skill/blueprint/elements/`。
- `npm ci && npm run build` → `dist/`（静的。`/data.json` と `/llms.txt` も出る）
- 地図の線は `tactics.yaml` の `depends_on` だけから引く
- 決めた内容はブラウザの localStorage。`project-map.template.yaml` と同じ形の YAML／Markdown で書き出せる
- Vercel：Root Directory を `app/` にすると親フォルダの YAML が読めないので、ローカルで build して `dist/` を出すか、Root を repo 直下にして `cd app && npm ci && npm run build` を Build Command にする
