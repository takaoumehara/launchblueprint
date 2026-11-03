# 驚きの記録（surprise）— 1件1ファイル

提供：CREATIVITY IS EVERYWHERE, LLC ／ 置き場：`po-input/YYYY-MM-DD-<slug>.md`（このテンプレートをコピー）
目的：「計画になかったのに起きたこと」を、固有名詞を外して 1 枚に書く。ここから `catalog/lifecycle.yaml` の known_surprises・revisit_triggers、`catalog/*.yaml` の lessons、`elements/tactics.yaml` の tactic に昇格させる（手順：`reference/feedback-loop.md`）。
書き方：事実と推測を分ける。製品名・人名・プロジェクト名は書かない（サービス名は可）。数字は出典と確認日つき。

---

```yaml
# 機械が読む見出し（必須）
id: sp.<slug>                 # 例 sp.free-plan-flipped-at-first-sale
date: YYYY-MM-DD
stage: launch                 # idea / launch / operate / scale / exit（macro）
fine_stage: pricing           # lifecycle.yaml の stages[].id（discover … exit）
severity: loss                # near_miss（未遂）/ delay（遅れ）/ loss（損失・事故）
cost: "estimate: 2 日の遅れ・$0"   # 時間とお金。推計なら estimate と書く
generic: true                 # 固有名詞を外し、2 つ以上のプロジェクトで起きうる形にしたか
```

## 1. 何が起きたか（事実だけ）
- いつ・どの段階で・何が起きたか。1〜3 行。
- 気づいた経路（請求メール／ユーザー報告／監視の通知／偶然）。

## 2. 何を前提にしていたか（推測だった部分）
- 「〜だと思っていた」を 1 行ずつ。どの文書・会話・記憶に基づく前提だったか。
- その前提は catalog・tactics・lifecycle のどこに書かれていた（いなかった）か。

## 3. いつ・何を確かめていれば防げたか
- もっと早い段階（idea / launch / operate / scale / exit）のどこで、何を見れば分かったか。
- その確認にかかる時間と費用（estimate 可）。

## 4. どの段階・どの要素に属するか
- macro stage：
- fine stage（lifecycle.yaml stages[].id）：
- element（el.product / el.business / el.maintenance …）と topic（tactics.yaml）：
- 既存の lesson / rule / tactic で近いもの（id）：

## 5. 提案（1 つ以上。空欄なしで書く）
### 5a. ルール案（lesson）
```yaml
id: <domain>.<slug>
principle: "〜する（1 文。何を・いつ）"
anti_pattern: "避ける形（具体的に）"
why: "なぜ（起きた損失・事故で説明）"
check: "はい／いいえで答えられる確認の問い"
see_also: []
verified: false
```
### 5b. lifecycle への追加（どちらか、または両方）
- known_surprises（この段で毎回起きること）に足す 1 行：
- revisit_triggers（Blueprint を再実行する合図）に足す 1 行：

### 5c. tactic への反映（あれば）
- topic：　kind（choose / checklist）：　足す option（catalog id）：　pick の変更が要るか（要るなら理由。R-030 の比較を添える）：

## 6. 出典・確認
- 公式ページ・規約・請求書など（URL、確認日 YYYY-MM-DD、verified: true/false）：

## 7. 判定（オーナーが書く）
- [ ] 採用（lesson として catalog へ） [ ] lifecycle のみ [ ] tactic へ [ ] 保留（理由：） [ ] 却下（理由：）
- 反映先の PR：
