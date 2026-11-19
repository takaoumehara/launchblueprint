# Catalog refresh: keep prices and limits current / 料金・上限を定期的に確かめ直す

提供：CREATIVITY IS EVERYWHERE, LLC

The master catalog (`catalog/*.yaml`) is human-reviewed. Agents never edit it; they propose. Unverified numbers never enter the master as verified.
本体のカタログは人が確認して直す。AI は提案箱に入れるだけ。未確認の数字を「確認済み」として本体に入れない。

## Recurring run / 定期実行（例：月 1 回、または selected の項目を使う直前）
```text
1. stale_items {days: 90, refresh_plan: true, used_only: true, limit: 30}
   → 古い・未確認・確認日なしの項目。地図で使われているものが先。各項目に公式 URL・今の料金/上限の文・使っている決めごと
2. 各項目の公式ページ（url）だけを読む。ブログ・まとめ・記憶は使わない。
   公式 URL がない項目は、まず公式の料金・上限ページを探す。見つかるまで verified:false のまま
3. propose_catalog_refresh {id, url, checked: "YYYY-MM-DD", verified, changes:[{field: "pricing_bands.free", new_text: "ページの文のまま"}], note}
   - verified:true は「今日、その公式 URL で読んだ」時だけ（url 必須）
   - 変わっていなければ changes に同じ文を入れる → unchanged として確認日だけ更新の提案になる
   → mcp/inbox/catalog-refresh.jsonl に {id, source:{url, checked, verified}, diff:[{field, old, new, changed}]} が 1 行
4. 人が inbox を見て catalog/*.yaml を直し、source.checked / verified を更新して PR。マージしたら inbox の行を消す
```
Fields compared: `pricing_bands.*`, `limits`, `free_tier`, `paid_entry`, `cost`, `fee`, `price`, `lock_in`.
Scheduling: any scheduler that can start an agent session with the MCP server attached (a cron job, a CI schedule, or a scheduled agent task) can run steps 1–3; step 4 is always a person.
新しい選択肢が出た（`check_cadence: daily_new_options`）時は `propose_learning` で提案する。カタログ外の候補を `decide` に入れる時は `extra_options`（全部 gap のまま採点）。
