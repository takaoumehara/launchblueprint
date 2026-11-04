# フィードバックループ：驚きを rule・tactic に戻す（2026-11-02）

提供：CREATIVITY IS EVERYWHERE, LLC ／ 対象：`po-input/*.md`（驚きの記録）→ `catalog/lifecycle.yaml`・`catalog/*.yaml` の lessons・`elements/tactics.yaml`
原則：**計画は変わる前提で作る。** 各段階の「毎回起きること」（known_surprises）と「再実行の合図」（revisit_triggers）を lifecycle に持ち、新しい驚きはこの手順で本体に戻す。SKILL.md §8「学びを戻す（膨らませない）」の実行手順。

## 1. どこに何を書くか
| 種類 | 置き場 | 形 |
|---|---|---|
| 起きたことの記録（1 件 1 枚） | `po-input/YYYY-MM-DD-<slug>.md` | `po-input/TEMPLATE-surprise.md` |
| 段階ごとの「毎回起きること」「再実行の合図」 | `catalog/lifecycle.yaml` の `macro_stages[]` / `stages[]` | `known_surprises[]`, `revisit_triggers[]`（1 行ずつ） |
| 守ること（原則・避ける形・なぜ・確認） | `catalog/<domain>.yaml` の `lessons[]` | id, principle, anti_pattern, why, check, see_also, verified |
| 決めること（選択肢とおすすめ） | `elements/tactics.yaml` の `tactics[]` ＋ `elements/stack_comparisons.yaml` | topic, options, ai_pick, ai_reason_ja, pick_when, stage。技術なら R-030 の比較を必ず添える |
| 絶対・既定のルール | `catalog/rules.yaml` | id, type, text, strength, status, review_due |
| AI からの提案（下書き） | `mcp/inbox/learnings.jsonl`（MCP `propose_learning`） | `blueprint.learning/v2`：4 層＝layers.principle（principle / anti_pattern / why / check）・layers.claims（確かめる事実。常に verified:false で入る）・layers.context（stage・stack_type・product_type・severity・cost。固有名詞なし）・layers.occurrence（count=1 から、fingerprint で束ねる）。`text` だけの旧形式は needs_structuring:true |

## 2. 流れ（1 件につき）
1. **記録する（その場で）**：各段階のゲート（地図が次の段へ進む前）に AI が「計画になかったのに起きたことは？」「先に知っていれば助かったことは？」と聞き、答えを 4 層（原則・確かめる事実・文脈・件数）で `propose_learning` に送る。まとめての振り返りは待たない。人が書くときはテンプレートをコピーし、層 1〜3 を埋める。固有名詞を外す。数字は層 2（claims）に置き、推計は cost_is_estimate: true。
2. **置き場を決める（§4）**：macro stage と fine stage、element と topic、近い既存 id を書く。近い lesson があるなら**新規ではなく既存に足す／直す**。
3. **提案を書く（§5）**：lesson 案は principle・anti_pattern・why・check の 4 つを空欄なしで。check は はい／いいえ で答えられる問いにする。lifecycle に足すなら known_surprises か revisit_triggers のどちらかを 1 行。
4. **昇格の判定（オーナー）**：次を全部満たす時だけ本体へ。
   - 2 つ以上のプロジェクトで効く、または事故・却下・損失を防ぐ
   - 既存の項目に足す・直すで済む（新しい章・新しいファイルは最後の手段）。足すなら同じ量を削れないか先に見る
   - 固有名詞・個人名・プロジェクト名が無い。出典 URL と確認日がある。未確認は `verified: false`
   - 数字は catalog（YAML）へ、手順は SKILL.md へ、説明は reference へ
5. **反映する（PR）**：
   - lesson → 該当ドメインの `lessons[]`。checklist の tactic があればその `options` に id を足す
   - lifecycle → `macro_stages[]` と、当てはまる `stages[]` の両方に 1 行（長い説明は書かない）
   - 選択肢の追加 → catalog の entry（price・limits・source 必須）＋ tactics の options ＋ stack_comparisons の services。**pick を変えるなら** PR 本文の「Recommendation changes」に理由と比較を書く（R-030）
   - `reference/coverage.md` の該当行を更新（status が thin → covered になったら evidence を書き換える）
   - `po-input/` の元ファイル §7 に判定と PR を書く。採用されなかった記録も消さない（却下理由が次の判断材料）
6. **確かめる**：`cd app && npm run build`（catalog id の参照切れは警告で出る）、`cd mcp && npm test`。MCP の `lifecycle_stages` と `get_catalog(format: items)` で新しい項目が見えること。

## 3. 再実行の合図（revisit_triggers）の使い方
- プロジェクト YAML の `profile`・`selections` が変わった時、または lifecycle の `revisit_triggers` のどれかに当たった時、SKILL.md §7（見直し）を回す。
- 合図は「数字で判定できる」ものだけ書く（例：請求が前月の 2 倍、復元テスト 30 日超、公開 14 日前）。感覚語（「不安になったら」）は書かない。
- AI は会話の冒頭で、今の stage の `known_surprises` を 1 行ずつ「これは起きていないか」と確認し、`revisit_triggers` に当たるものがあれば先に出す（MCP `lifecycle_stages`）。

## 4. 書かないもの
- 1 回きりの事故で、他のプロジェクトで起きようがないもの（プロジェクト YAML の `learnings` に 1 行で十分）
- 感想・評価（「〜は良い」）。原則は「何を・いつ・どう確かめるか」の形だけ
- 製品名・個人名・社内のプロジェクト名。サービス名（ベンダー）は可
- 確認していない価格・上限。書くなら `verified: false` と確認すべき URL

## 5. 例（一般化済み）
- 驚き：初めての売上の日に、ホストの無料プランが非商用限定だと分かり、同じ週に有料化を迫られた。
- 置き場：stage=launch / fine=pricing / el.maintenance / topic=cost_rules
- lesson：`cc.commercial-terms-before-first-sale`（principle・anti_pattern・why・check は `catalog/cost_control.yaml`）
- lifecycle：launch.known_surprises「無料プランは『非商用』条件で、初めての売上の日に有料プランへ強制される」／launch.revisit_triggers「初めての有料ユーザー」
- tactic：`cost_rules`（checklist）の options に追加
