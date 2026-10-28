# Tech Catalog の書式（schema）

1ドメイン1ファイル（`frontend.yaml` など15個）。人は `catalog-concept.html` で見て、AIはこのYAMLを読む。

## ファイルの先頭
| キー | 意味 |
|---|---|
| `domain` | frontend / backend / database / auth / security / hosting / payments / storage_media / email_notifications / analytics / ai_llm / search / realtime / ci_cd / monitoring |
| （追加 2026-10-26） | data_protection（2026-10-28、lessons[]） / gtm_channels / support / cross_border / app_distribution / exit_dd / scale_readiness / dd_dashboard / business_setup（2026-10-27、`lessons[]`＝id, jurisdiction, principle, anti_pattern, why, check, see_also, verified）。工程の網羅表は `lifecycle.yaml`（stage, domain, item, status, evidence, proposed_addition, priority） |
| `updated` | 最後に直した日 |
| `stale_after_days` | この日数を過ぎた `source.checked` は「古い」扱い（既定90） |

## エントリ（`entries[]`）
| キー | 必須 | 書くこと |
|---|---|---|
| `id` | ◎ | `ドメイン略.名前`（例 `db.supabase`）。プロジェクトからはこのIDで参照する。変えない |
| `name` / `what` | ◎ | 名前と、何者かを1文 |
| `best_for` / `avoid_when` | ◎ | **いつ使うか／使わないか**。選ぶ理由はここに書く |
| `pricing_bands` | ◎ | `free / usd5 / usd10 / usd100`。帯が存在しなければ「—」と書き、空欄にしない |
| `limits` | ◎ | 無料枠の上限と、超えた時の挙動 |
| `lock_in` | ◎ | 低／中／高／変更不可 ＋ 理由（移行で何が重いか） |
| `liability_compliance` | ◎ | 誰が責任を負うか、認証（SOC2 等）、規約上の注意 |
| `security` | ◎ | 最低限やる設定 |
| `pairs_well_with` | ○ | 相性のよい他エントリのID |
| `source` | ◎ | `{url, checked, verified}`。公式ページで確かめたら `verified: true` と日付。記憶なら `false` |

## auth だけの形
`auth.methods`（Google / Apple / メール＋パスワード / マジックリンク / 電話SMS / 匿名 / パスキー / SSO）と `auth.providers[]`。各プロバイダの `support` に方式ごとの対応（yes / no / paid / plugin / 要確認）を書く。人の画面では「方式×プロバイダ」の表になる。

## プロジェクト側（`project.blueprint.yaml`）
`selections[]` に `{domain, catalog_id, status, reason, rules, budget_band}`。
- `status`：`selected`（明るく表示）／`candidate`（普通）／`rejected`（暗く、理由つき）
- `rules`：効いているルール台帳のID（§10）
- 理由のない `selected` と `rejected` は書かない

## 鮮度と関連ファイル（2026-10-26 追加）
- 各ドメイン YAML の `stale_after_days`（90）は**料金の既定値**。フィールド別の期限は `freshness.yaml`。
- ルール本文は `rules.yaml`（id, type, text, strength, status, review_due）。`project.blueprint.yaml` の `rules: [...]` はこの id を指す。
- 作る／API／全部入りの比較は `build_vs_buy.yaml`（tco_fields, formula, default_assumptions, answer_rules）。

## 生成物（v3）
- `data/{catalog,canvas,compare-stripe,rules,build-vs-buy,index}.json`：`catalog/_build_screens.py` が YAML から作る。手で直さない。共通の `meta`：schema, generated, publisher, sources, how_to_read。
- `catalog/canvas.yaml`：nodes（id, field, label, state=done|open|lock, note, rule?, catalog?, compare?, flag?）、edges `[a, b, decided|candidate]`、trace（選んだ道筋）。サンプル。

## 追加ドメインの形（2026-10-26）
- `cross_border.yaml`：海外展開。6軸（言語・決済・法務/プライバシー・税・チャネル・サポート）と入り方3案。プロジェクト側は `cross_border: {waves[], excluded[], entry_strategy, open_decisions[]}`。
- `app_distribution.yaml`：ストア配信の型（ウェブのみ／TWA／ネイティブ殻／書き直し）と審査ルール。
- `exit_dd.yaml`：売却準備の `checklist[]`（id, item, acceptance）。
- `scale_readiness.yaml`：`tiers[]`（id, users, add/must, trigger_next, effort, cost, acceptance）。金額・工数は estimate。
- `dd_dashboard.yaml`：`groups[]`（id, metrics, source_of_truth）。1日目から記録。
- `ui_ux.yaml`：UI/UX の原則。`rules[]`（id, principle, anti_pattern, why, check, source, date）。`check` は はい／いいえ で判定でき、要件・設計・品質の確認で使う。固有名詞・プロダクト名は入れない。

## Elements 層（2026-10-28 追加、`elements/`）
- `elements.yaml`：`elements[]`＝id, name, principle, categories（12カテゴリー番号）, tactics_file
- `tactics.yaml`：`lanes[]`（地図の列 BRAND/UX/UI/TECH/BIZ・LEGAL/RULES）と `tactics[]`＝element, topic, lane, label_ja, question_ja, kind（choose / checklist）, options（catalog の id）, ai_pick, ai_reason_ja, pick_when[{if, pick, reason_ja}], depends_on（先に決める topic。地図の線はこれだけ）, last_checked, check_cadence（daily_new_options / deep_when_used）
- `project-map.template.yaml`：`choices[]`＝element, topic, status, options, ai_pick, reason, rejected[{option, why}], decided_by, pick, last_checked。先頭に name, goal, profile。理由のない ai_pick・rejected は書かない
- `elements.yaml` には name_ja / principle_ja もある。Web アプリは `app/`（`npm run build` で `/data.json` と `/llms.txt` を出す）
- `glossary.yaml`：`terms[]`＝term, plain, one_line。アプリは専門用語を「plain（term）」に置き換え、説明を横に出す
- MCP：`get_catalog` は elements/ のファイルも読める。`format: items` で lesson 形式も含めた一覧を返す。`search` は `items` も返す
