# 驚きの記録（surprise）— 1件1ファイル・4 層

提供：CREATIVITY IS EVERYWHERE, LLC ／ 置き場：`po-input/YYYY-MM-DD-<slug>.md`（このテンプレートをコピー）／ 版：2026-11-04（4 層形式）
目的：「計画になかったのに起きたこと」を、固有名詞を外して 1 枚に書く。ここから `catalog/lifecycle.yaml` の known_surprises・revisit_triggers、`catalog/*.yaml` の lessons、`elements/tactics.yaml` の tactic に昇格させる（手順：`reference/feedback-loop.md`）。
いつ書くか：**その場で。** 各段階のゲート（地図が次の段へ進む前）に AI が「計画になかったのに起きたことは？」「先に知っていれば助かったことは？」と聞くので、その答えをこの形で残す。まとめての振り返りは待たない（まとめて頼むと 1 回しか集まらなかった）。
MCP からは `propose_learning(category, principle, claims, context)` で同じ 4 層を送れる（記録の形 `blueprint.learning/v2`）。

書き方：事実と推測を分ける。製品名・人名・プロジェクト名・社名（自社以外）は書かない（サービス名＝ベンダー名は可）。数字は出典 URL と確認日つき。確認していない数字は「確かめる事実」に置き、原則の中に書かない。
残さないもの：そのプロジェクトだけの好み・判断（「〜の方が好き」「うちでは〜にした」）。

---

```yaml
# 機械が読む見出し（必須）
id: sp.<slug>                 # 例 sp.free-plan-flipped-at-first-sale
date: YYYY-MM-DD
schema: blueprint.learning/v2
category: cost_control        # catalog のドメイン（lessons を足す先）
generic: true                 # 固有名詞を外し、2 つ以上のプロジェクトで起きうる形にしたか
```

## 層 1. 原則（principle）— 残るのはここだけ
この 4 つを空欄なしで。`check` は はい／いいえ で答えられる問いにする。固有名詞・数字は入れない（数字は層 2 へ）。
```yaml
principle:
  principle: "〜する（1 文。何を・いつ）"
  anti_pattern: "避ける形（具体的に）"
  why: "なぜ（起きた損失・事故で 1 行）"
  check: "はい／いいえで答えられる確認の問い"
```

## 層 2. 確かめる事実（claims）— 捨てない。ただし「確認済み」とは書かない
具体的な数字・条件・規約の文言。1 行 1 件。出典 URL と確認日があれば書く。**ここに書いた時点では全部 `verified: false`。** 一次情報（公式ページ・規約・請求書）で確かめた人が catalog に入れる時に `verified: true` にする。確かめられないものは「未確認」のまま残し、同じ主張が何人から出たか（層 4）で優先順位を付ける。
```yaml
claims:
  - claim: "〜は〜である（例：Hobby プランは非商用のみ）"
    source_url: https://…        # 任意。公式ページ・規約・請求書
    checked: YYYY-MM-DD          # 任意。見た日
    verified: false              # ここでは常に false
  - claim: ""
```

## 層 3. 文脈（context）— 名前を外して、同じ状況の人が見つけられる粒度で
```yaml
context:
  stage: launch                 # idea / launch / operate / scale / exit（macro）
  fine_stage: pricing           # lifecycle.yaml の stages[].id（discover … exit）
  stack_type: "nextjs+serverless"   # 技術の型（例：nextjs+serverless / expo+firebase / static+workers）
  product_type: "saas"          # 製品の型（例：saas / marketplace / content / internal-tool）
  severity: loss                # near_miss（未遂）/ delay（遅れ）/ loss（損失・事故）
  cost_days: 2                  # 時間（日）
  cost_money_usd: 0             # お金（USD）
  cost_is_estimate: true        # 推計なら true
```
- 起きたことの 1〜3 行（事実だけ。いつ・どの段階で・気づいた経路＝請求メール／ユーザー報告／監視／偶然）：
- 前提にしていたこと（「〜だと思っていた」を 1 行ずつ。どの文書・会話に基づく前提か。catalog・tactics・lifecycle のどこに書かれていた／いなかったか）：
- いつ・何を確かめていれば防げたか（どの段階で・何を見れば・何分かかるか）：

## 層 4. 件数（occurrence）— 書く人は 1 と書く。足し上げはハブ・オーナーがする
```yaml
occurrence:
  count: 1                      # 書いた人は 1。同じ原則が別の提出者から来るたびに +1
  similar_ids: []               # 既存の lesson / rule / surprise で近いもの（id）。あれば新規ではなく既存に足す
```

## 5. 置き場と提案（昇格先。空欄なしで）
- element（el.product / el.business / el.maintenance …）と topic（tactics.yaml）：
- lifecycle への追加（どちらか、または両方。長い説明は書かない）：
  - known_surprises（この段で毎回起きること）に足す 1 行：
  - revisit_triggers（Blueprint を再実行する合図。**数字で判定できるものだけ**）に足す 1 行：
- tactic への反映（あれば）：topic／kind（choose / checklist）／足す option（catalog id）／pick の変更が要るか（要るなら理由と R-030 の比較）：

## 6. 判定（オーナーが書く）
門（全部そろって本体へ）：
- [ ] 層 1 の 4 つが埋まり、check が はい／いいえ で答えられる
- [ ] 層 2 の claims を一次情報で確かめた（確かめられないものは `verified: false` のまま。消さない）
- [ ] 層 3 に製品名・人名・プロジェクト名がない
- [ ] 2 人以上（2 プロジェクト以上）から同じ原則が出た、または単独でも事故・損失・法務を防ぐ（単独の高リスク項目はオーナー判断）
- [ ] 既存の lesson / rule / lifecycle と矛盾しない（矛盾するなら、どちらを直すかを書く）
- [ ] 宣伝・スパムでない
- [ ] 採用（lesson として catalog へ） [ ] lifecycle のみ [ ] tactic へ [ ] 保留（理由：） [ ] 却下（理由：）
- 反映先の PR：
