# Decide: AI picks under a preference profile, reviewed later / AI が好みで選び、あとで見直す

提供：CREATIVITY IS EVERYWHERE, LLC

## なぜ / Why
オーナーが全部の決めごとを細かく承認しなくても、AI が自分でよい選択をして先へ進めるようにする。そのかわり、AI は**選ぶ前に**現実的な選択肢を全部並べて採点し、勝った理由・落とした理由・つながりの理由を記録する。人はあとで地図（アプリの `#/p/<slug>`）で見直す。
An agent should be able to choose well on its own, without the owner approving every node. In exchange it must list the realistic field, score it under the project's preference profile, and record why the pick won, why each alternative lost, and how it links to parts already chosen. People review later on the project map.

## 状態 / Statuses
| status | 意味 / meaning | 誰が / who |
|---|---|---|
| `open` | まだ何もない / nothing yet | — |
| `ai_selected` | AI が好みで選んだ。先へ進んでよいが、オーナーの見直し待ち / agent pick, proceed, owner reviews later | agent |
| `decided` | オーナーが「はい」と言った。`owner_confirmed: true` と `decided_by` が必須 / the owner said yes | owner only |
| `observed` | リポジトリで確かめた事実。`evidence`（ファイル・設定・依存）が必須 / a fact read from a real repo | agent, with evidence |
| `gap` | 根拠がない・確かめられていない。`gap_note` 必須。地図に旗で出る / missing evidence, flagged on the map | anyone |
| `deferred` | 見送り（理由つき）/ not now, with a reason | anyone |

AI は `decided` を書けない。MCP の `update_project_map` は `owner_confirmed: true` のない `decided` を拒否し、何も書かない。
The MCP refuses `decided` without `owner_confirmed: true`, and writes nothing.

## 判断の好み / Preference profiles
`preferences/*.yaml`。7 基準（`cost` 費用・無料枠、`speed` 作る速さ、`breadth` 試せる幅、`lock_in` 乗り換えやすさ、`scale` 伸びしろ、`compliance` 認証、`ecosystem` 選んだ部品との相性）に 0〜5 の重み。
- `lean-fast-full`（既定）：お金はできるだけ使わず、とても速く、でも全部作って試す / spend little, build fast, still try everything
- `all-in`：速さ・質・伸びしろのためにお金を使う / spend for speed, quality and scale
- 組織の好み：同じ形で `scope: org`、`extends:` で既存の重みを引き継げる。`BLUEPRINT_PREFERENCES_EXTRA` でフォルダを指定してもよい。

Scores come only from evidence: catalog fields (free band, lock_in, liability_compliance, wording in best_for / avoid_when, comparison reasons), the vendor of each option (official site of its source URL), and the parts this project already has. No evidence = **gap** (scored 0.5, listed, flagged). Prices are never written by `decide`; unverified sources stay `verified:false`.
点数は根拠からだけ出す。根拠がなければ「穴」として 0.5 点にし、記録と地図に出す。料金は書かない。

## エージェントの手順 / How an agent calls it
```text
1. list_profiles                                  # どの好みがあるか
2. update_project_map {slug, name, goal, intake, preference_profile}   # 地図を作る（下書き：mcp/inbox/project-maps/）
3. 実在のリポジトリなら、見つけた事実を observed で記録（evidence 必須）、見つからないものは gap + gap_note
   update_project_map {slug, records:[{topic:"hosting", status:"observed", pick:"host.vercel", evidence:[{kind:"config", path:"vercel.json", note:"…"}]}]}
4. decide {topic, project: slug}                  # 選択肢全部・基準ごとの点と根拠・勝った理由・落とした理由・つながり
   - 自分で調べた事実は evidence:[{option, criterion, score, note, url}] で足す（unverified のまま残る）
   - カタログにない候補は extra_options で足す（根拠が付くまで全部 gap）
   - also_under:["all-in"] で別の好みでの結果も見る
5. update_project_map {slug, records:[{topic, status:"ai_selected"}]}   # pick を省くと decide の結果がそのまま入る
   または decide_topics:["all"] で未決・穴・ai_selected を全部採点
6. 返ってきた link（#/p/<slug>）をオーナーに渡す。大きな決定だけオーナーに聞き、
   「はい」をもらったら {status:"decided", pick, owner_confirmed:true, decided_by:"owner"}
7. 好みを変える：rescore_project_map {slug, profile} で差分を見て、update_project_map {slug, preference_profile}
   で適用。ai_selected は全部採点し直し、decided / observed は残して profile_drift を付ける
   例外：source が catalog 以外の ai_selected（PRD・PO のメモなど出典つきの提案。records に pick と source を付けて記録）も残して profile_drift を付ける
8. 本番かどうか：update_project_map {slug, production:{state:"not_in_production"|"live"|"unknown", note, verified:false}} で地図の上に帯を出す
```

Sourced proposals (EN): an `ai_selected` record whose `source` does not start with `catalog` (a PRD section, a PO's design notes) is a recommendation from that source. It is never `decided`, but a profile change keeps its `ai_pick` and marks `profile_drift` instead of replacing it. `production` (`live` / `not_in_production` / `unknown`, a note, `verified`) is shown as a banner on the map. Worked examples: the five maps in `docs/portfolio.md`, inputs in `mcp/portfolio/`.

## 決定の記録 / Decision record (one `choices[]` entry)
保存はコンパクト：`considered`・`field_size`・`gaps`・`gap_notes` はファイルに書かず、読む時に作る（MCP `get_project_map(slug, topic)`、アプリの詳細）。observed・decided・deferred でも、比べた選択肢全部と落とした理由が出る。status・pick は変えない。
Stored compact: the scored field is rebuilt on read for every status (observed, decided and deferred included) without touching status or pick. Stored per record: pick, ai_pick, rejected, linkages, `overrides` (agent scores), `extra_options`, and for observed/decided/deferred `scored_pick`, `scored_under`, `profile_drift`.

`topic, element, stage, lane, kind, status, options, considered[{option, rank, total, scores{criterion:{score, basis, evidence}}, gaps, verified, checked, url, from}], ai_pick, pick, reason, reason_ja, rejected[{option, why}], linkages[{kind, with_topic, with_option, why, verified?}], profile, source, verified, checked, date, gaps, gap_notes, gap_note?, evidence?, observed_as?, owner_confirmed?, decided_by, confirmed_at?, profile_drift?`
`linkages.kind`: `same_vendor`, `shared_free_tier`（無料枠が共有か別々かは要確認・verified:false）, `pairs_well_with`, `named_in_best_for`, `conflict`.

## あとで見直す / Review later (owner)
アプリの `#/p/<slug>`：64 の決めごとを 6 列 × 5 段で全部表示。上の帯で 01〜12（＋海外展開）を 1 つずつ開ける（`#/p/<slug>/c/01`）。点をクリックすると、選んだもの・比べた選択肢と点数・理由・つながり・好み・確認日・穴が出る。「決定する」を押すのはオーナーだけ（ブラウザに残る。共有は YAML を書き出して PR）。`#/p/<slug>/arch` はフロント ↔ バック ↔ データ ↔ ログイン・お金 ↔ 外部サービスのつながりを、根拠のある実装（実線）と提案（点線）に分けて描く。
