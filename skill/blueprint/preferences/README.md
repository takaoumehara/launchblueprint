# Preference profiles / 判断の好み

A project picks one **preference profile**. `decide` (MCP) and the app's AI picks score every realistic option under it, so the same project gets different picks under `lean-fast-full` and `all-in`.
プロジェクトは「判断の好み」を 1 つ持ちます。MCP の `decide` とアプリの AI のおすすめは、選択肢をすべてこの重みで採点します。好みを変えると、おすすめも変わります。

This is a separate layer from the intake profile (`audience / platform / money / country`), which still applies `pick_when` rules as a bonus.
「始める」画面の 4 つの答え（intake profile）とは別の層です。intake の `pick_when` は加点として残ります。

## Files / ファイル
| File | What |
|---|---|
| `criteria.yaml` | the 7 criteria and where each score comes from / 7 つの基準と、点数の出どころ |
| `lean-fast-full.yaml` | default: spend little, build fast, still try everything / 既定 |
| `all-in.yaml` | spend for speed, quality and scale / お金をかけて質と伸びしろ |
| your own | org-defined profiles (below) / 組織の好み |

## Shape / 形
```yaml
schema: blueprint.preference-profile/v1
id: my-org-compliance-first     # [a-z0-9-], unique
scope: org                       # default | org
extends: all-in                  # optional: start from another profile's weights
label_en: / label_ja: / summary_en: / summary_ja:
weights: {cost: 0-5, speed: 0-5, breadth: 0-5, lock_in: 0-5, scale: 0-5, compliance: 0-5, ecosystem: 0-5}
tie_break: [criterion, ...]      # optional
```
Org profiles: put the file in this folder, or point `BLUEPRINT_PREFERENCES_EXTRA` at a folder of them (the MCP reads both). The app shows profiles found here at build time.
組織の好みは、このフォルダに置くか、`BLUEPRINT_PREFERENCES_EXTRA` でフォルダを指定します。

## Scoring / 採点
`total = Σ weight × score / Σ weight` over the 7 criteria; `+0.10` when the intake answers match a `pick_when` rule; `+0.02` for the catalog's default pick (tie-break only).
A criterion with no evidence is a **gap**: it scores 0.5, is listed in `gaps`, and shows as a flag on the map. Prices are never invented — `verified:false` stays visible in the record.
根拠のない基準は「穴（gap）」として 0.5 点にし、記録と地図に出します。料金を推測で書くことはしません。
