# Tech Catalog の書式（schema）

1ドメイン1ファイル（`frontend.yaml` など15個）。人は `catalog-concept.html` で見て、AIはこのYAMLを読む。

## ファイルの先頭
| キー | 意味 |
|---|---|
| `domain` | frontend / backend / database / auth / security / hosting / payments / storage_media / email_notifications / analytics / ai_llm / search / realtime / ci_cd / monitoring |
| （追加 2026-10-26） | data_protection（2026-10-28、lessons[]） / gtm_channels / support / cross_border / app_distribution / exit_dd / scale_readiness / dd_dashboard / business_setup（2026-10-27、`lessons[]`＝id, jurisdiction, principle, anti_pattern, why, check, see_also, verified）。工程の網羅表は `lifecycle.yaml`（stage, domain, item, status, evidence, proposed_addition, priority） |
| （追加 2026-11-02） | validation / pricing / legal_terms / backup_dr / cost_control / ops_handoff / exit_tools。どれも `entries[]`（通常の形）＋ `lessons[]`（id, principle, anti_pattern, why, check, see_also, verified）。gtm_channels・monitoring にも entries/lessons を追加。人向けの網羅表は `reference/coverage.md` |
| （追加 2026-11-03） | foresight（先読み）。entries は無く、`lessons[]`（id `fs.L01`〜、principle, anti_pattern, why, check, trigger＝いつ確かめるか, stage＝idea/launch/operate/scale/exit, see_also, verified, source）＋ `procedures[]`（id `fs.A`〜`fs.F`、name_ja, trigger, stage, also_stages[], what, check, reference＝`reference/foresight.md#proc-x`）＋ `cross_rules[]`（id `fs.X1`〜、lessons と同じ形）。`stale_after_days: 365`（料金を持たない） |
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

## lifecycle.yaml の段階（2026-11-02 追加、schema `blueprint.lifecycle/v3`）
- `macro_stages[]`：`{id, name_ja, stages[], known_surprises[], revisit_triggers[]}`。id は idea / launch / operate / scale / exit の 5 つ（この順）。`stages` は下の fine stage の id。
- `stages[]`：`{id, macro, name_ja, known_surprises[], revisit_triggers[]}`。14 の fine stage（discover … exit）。`items[].stage` はこの id を指す（`12cat` の項目は `category` で段に割り当てる）。
- `known_surprises`：その段で「計画になかったのに毎回起きること」。1 行ずつ、固有名詞なし。`revisit_triggers`：Blueprint を再実行する合図。**数字で判定できるものだけ**（例：請求が前月の 2 倍、復元テスト 30 日超）。
- 新しい驚きは `po-input/TEMPLATE-surprise.md` に記録し、`reference/feedback-loop.md` の手順で lessons / lifecycle / tactics に昇格させる。
- MCP：`lifecycle_stages`（stage で macro か fine を絞る。`include_items: true` で当該段の items も返す）。`get_catalog(lifecycle, format: items)` でも stage 行が `stage`・`known_surprises`・`revisit_triggers` 付きで出る。

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
- `ui_ux.yaml`：UI/UX の原則。`rules[]`（id, category, phase[], principle, anti_pattern, why, check, see_also?, source?, date）。4つ（原則・避ける形・理由・確認）は必須。`check` は はい／いいえ で判定でき、要件・設計・品質の確認で使う。`category` は emphasis / copy / guidance / lists / saving / forms / states / accessibility / mobile / theming / motion / visual / performance / flows / feedback / payments / onboarding / privacy / engineering / i18n、`phase` は requirements / design / qa（MCP `ui_ux_checklist` の絞り込み）。固有名詞・プロダクト名は入れない。（2026-11-02 追加）`phase_gate_checks[]`＝id, lifecycle（idea / launch / operate / scale / exit。5段階すべてに1つ以上）, phase（場面の説明）, check（はい／いいえ）, why, rules[]（束ねる rule の id）。`reference/ui-ux.md` は rules と同じ id で全件を載せる（`mcp/test/ui_ux.test.mjs` が照合）。

## Elements 層（2026-10-28 追加、`elements/`）
- `elements.yaml`：`elements[]`＝id, name, principle, categories（12カテゴリー番号）, tactics_file
- `tactics.yaml`：`lanes[]`（地図の列 BRAND/UX/UI/TECH/BIZ・LEGAL/RULES）、`stages[]`（ライフサイクルの5段 idea / launch / operate / scale / exit＝id, label, ja, what_ja。`catalog/lifecycle.yaml` の macro_stages と同じ id。2026-11-02 追加）と `tactics[]`＝element, topic, **stage**（どの段の決定か。地図の進み具合はこれで数える。5 段すべてに choose と checklist が 1 つ以上あること：`reference/coverage.md`）, lane, label_ja, question_ja, kind（choose / checklist）, options（catalog の id）, ai_pick, ai_reason_ja, pick_when[{if, pick, reason_ja}], depends_on（先に決める topic。地図の線はこれだけ）, last_checked, check_cadence（daily_new_options / deep_when_used）。`lane: tech` の choose は必ず `stack_comparisons.yaml` に同じ topic を持つ（MCP の coverage テストで検査）
- `project-map.template.yaml`：`choices[]`＝element, topic, status, options, ai_pick, reason, rejected[{option, why}], decided_by, pick, last_checked。先頭に name, goal, profile。理由のない ai_pick・rejected は書かない
- `elements.yaml` には name_ja / principle_ja もある。Web アプリは `app/`（`npm run build` で `/data.json` と `/llms.txt` を出す）
- `glossary.yaml`：`terms[]`＝term, plain, one_line。アプリは専門用語を「plain（term）」に置き換え、説明を横に出す。カタログ・参照・アプリに出る専門用語は全部ここで定義する（英語表記とカタカナ表記は別行）。他の語の一部になる短いカタカナ（ログ・シート・フォーム）は入れない
- MCP（`mcp/`）：`list_domains`（全ファイルと件数）/ `get_catalog(domain, format)`（elements/ も読める。`items` は lesson・rule・tier・group も1つの形に正規化）/ `get_item(id)`（catalog の id 1件）/ `list_topics(stage?)`（決めること一覧）/ `get_comparison(topic)`（スタック比較）/ `get_template(name)` / `draft_project_map(profile, decided?)`（始める画面の答えから地図を作り、次に決めることと段ごとの進み具合を返す。決定はしない）/ `search` / `stale_items(days)` / `ui_ux_checklist(phase?, lifecycle?)`（段階ゲートも返す）/ `lifecycle_stages(stage?)` / `propose_learning(text, category, kind?)`。正規化した item の形：id, domain, kind, name, summary, best_for, avoid, why, check, cost, verified, checked, url（＋tactics は stage, lane, options, depends_on）
- 評価の記録：`reference/dry-run-sample.md`（見本プロジェクトを MCP だけで最初から最後まで通した記録と見つかった穴）、`reference/walkthrough-non-engineer.md`（アプリを使う人向けの手順）
- `stack_comparisons.yaml`（R-030）：`comparisons[]`＝topic, services[{id, name?, free_tier, paid_entry, url, checked, verified}], combine{single, combined, risks}, switch_points[{when, upgrade_to, why}], recommendation{pick, reason, rejected[{option, why}]}。技術の topic は全部これを持つ（まず payments / database / auth / email / hosting）
