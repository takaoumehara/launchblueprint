# Elements（v0.1 下書き）
3層で考える。
1. **elements.yaml** — 変わりにくい原則7つ（体験・プロダクト・事業・マーケ・ブランド・保守・セキュリティ）。12カテゴリーへの対応つき。
2. **tactics.yaml** — 要素ごとの選択肢。`catalog/*.yaml` の id を指すだけ。`last_checked` と `check_cadence`（`daily_new_options`＝新顔だけ毎日／`deep_when_used`＝使う物だけ料金・規約を深く確認）。
3. **project-map.template.yaml** — 全要素を最初に一度に見せ、ゴールに合わせて埋める。各選択は options / ai_pick / reason / rejected（理由つき）を必ず持つ。人が判断力を学べるように。
