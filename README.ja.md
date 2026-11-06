# Blueprint

**ローカルワークスペース（AI が提案、ブラウザで承認）:** [docs/install.ja.md](docs/install.ja.md) · English [docs/install.md](docs/install.md)

English: [README.md](README.md) · 5分ではじめる：[QUICKSTART.ja.md](QUICKSTART.ja.md)

**Blueprint は「作り方の作り方」です。** プロダクトを作り始める前に、構想から公開・運用・拡大・終了までに決めることを全部並べ、それぞれに選択肢、理由つきのおすすめ1つ、無料枠と上限、誰が責任を負うか、先に決めることを付けます。人はウェブアプリの地図で読み、AI エージェントは同じファイルを MCP サーバーで読みます。人が承認した計画と、AI が作る計画が同じものになります。

## 手に入るもの

- **6つの段・6つの列に並んだ41の決めること**。段は 構想・作る・出す・回す・増やす・終える、列は ブランド・体験・画面・しくみ・お金と法律・守ること。地図の線は本当の依存関係だけ。
- **34分野・407項目のカタログ**。サービス・決まり・教訓に出典と確認日。確かめていない数字は推測で埋めず `verified: false` と印を付ける。
- **しくみの決めことには必ずスタック比較**（ルール R-030）。似たサービスと無料枠、1社でそろえるか組み合わせるか、安い有料プランに切り替える境目、おすすめと選ばなかった理由。
- **あなたのプロジェクトの地図**。アプリは決まった形の YAML で書き出し、AI は `draft_project_map` で同じ形を作れる。オーナー抜きで決定にはならない。

## 3つの使い方

| あなたは | 使うもの | はじめかた |
|---|---|---|
| コードを書かないオーナー・創業者 | `app/` のウェブアプリ | [QUICKSTART.ja.md §A](QUICKSTART.ja.md) |
| AI エージェント（Claude Code / Cursor / Claude Desktop） | `mcp/` の MCP サーバー | [QUICKSTART.ja.md §B](QUICKSTART.ja.md) |
| Claude Code で手順をスキルとして使いたい人 | `skill/blueprint/SKILL.md` | `skill/blueprint` を `.claude/skills/` にコピー |

## 地図の読み方

上の帯は段ごとに、細い大きな数字（決めた数）と全部の数、決めること1件ずつの四角（枠＝未決、白＝AI のおすすめ待ち、オレンジ＝決定）。下は6列の点。線は `depends_on` だけ。決めた点と線はオレンジ、右下の数字は決めたステップの数。カタログ画面に全分野・全項目。詳しくは [QUICKSTART.ja.md §C](QUICKSTART.ja.md)。

## リポジトリ

```
QUICKSTART.md, QUICKSTART.ja.md   まずここ
skill/blueprint/                  スキル本体：SKILL.md, catalog/*.yaml, elements/, reference/, templates/
  catalog/schema.md               全ファイルの書式
  reference/dry-run-sample.md     見本プロジェクトを MCP だけで構想→終了まで通した記録と、見つかった穴
  reference/walkthrough-non-engineer.md   画面ごとの歩き方（エンジニアでない人向け）
app/                              ウェブアプリ（Vite）：npm ci && npm run build → dist/（data.json, llms.txt も）
mcp/                              MCP サーバー：npm ci && npm run build && npm test
legacy/, skills/, drafts/, ui/    以前の版（v0.2 の説明は legacy/launch-blueprint/README-v0.2.md）、下書き、試作
```

## 守ること

- 決めるのはオーナー。Blueprint は選択肢・おすすめ・影響を出すだけで、`open` を勝手に `decided` にしない。
- 料金・規約・ストアの決まりを記憶で断定しない。すべて `source.checked` と `verified` を持ち、`stale_items` で古いものが分かる。
- 一般化したものだけ。カタログ・教訓・提案に、利用者のプロダクト名や個人名を入れない。比較の中のサービス名は可。
- ルール・教訓は必ず「原則・避けること・なぜ・はい/いいえの確認」を持つ。

法律・税務の助言ではありません。法規・しきい値・サービスの上限は一次情報で確かめてください。

ライセンス：MIT © 2026 CREATIVITY IS EVERYWHERE, LLC · クレジット：`CREDITS.md`
