# ブランドコンテキストファイル（テンプレート）
提供：CREATIVITY IS EVERYWHERE, LLC ／ 元データ：`brand.yaml`（Part 2）。この節は**生成物**です。手で直さず、brand.yaml を直して再生成してください。
置き場所：CLAUDE.md / AGENTS.md / .cursor/rules/brand.mdc に同じ内容を入れる。**60行以内**（ルールの過積載を防ぐ）。詳細は参照リンクにする。

```markdown
<!-- brand:begin version={{brand.version}} generated={{date}} source=brand.yaml -->
## Brand（AIへの指示）
- 誰に・何を：{{brand.core.one_liner}}
- 声：{{brand.voice.adjectives | join(", ")}}。言語別：ja={{brand.voice.ja}} / en={{brand.voice.en}}
- 言わないこと：{{brand.never | join(" / ")}}

### 見た目（トークン以外は使わない）
- 色：`var(--ac)` などトークンだけ。#hex の直書き、Tailwind の既定色（bg-blue-500 等）、shadcn の既定テーマは使わない
- 字体：{{brand.type.families}}。大きさは {{brand.type.scale}} の段階だけ
- 形：{{brand.shape}}（例：角丸0、四角と真円のみ）
- 動き：{{brand.motion.durations}}、{{brand.motion.easing}}。`prefers-reduced-motion` で止める

### 文言（マイクロコピー）
- ボタンは動詞で始める。例：正「保存する」誤「OK」
- エラーは「何が起きたか＋次にやること」。謝りすぎない
- 正と誤の例：{{brand.copy.examples}}（3組まで）

### AIペルソナ（AI機能がある場合）
- 名前・口調：{{brand.ai_persona.name}} / {{brand.ai_persona.voice}}
- 答えない話題・人に回す条件：{{brand.ai_persona.escalate_when}}

詳細：brand/brand.yaml、DESIGN.md
<!-- brand:end -->
```

## 合格条件（AIが確かめる）
- ルールファイルに `brand:begin` と `brand:end` があり、`version` が brand.yaml と一致する
- 節が60行以内
- コード中のトークン外の色が0件：`rg -n '#[0-9a-fA-F]{3,6}\b|bg-(blue|indigo|slate)-[0-9]{3}' src/`（tokens ファイルは除く）
- 新しい画面の文言が `never` の語を含まない（grep）

## brand.yaml に足すキー
`version`、`core.one_liner`、`voice.{adjectives,ja,en}`、`never[]`、`type.{families,scale}`、`shape`、`motion.{durations,easing}`、`copy.examples[]`、`ai_persona.{name,voice,never,escalate_when}`
