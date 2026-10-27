# Blueprint v3 追補：エグジット／アプリ配布／国別GTM（2026-10-26）
提供：CREATIVITY IS EVERYWHERE, LLC ／ 公開前ドラフト

## 12 エグジット・サンセット
カテゴリー12を「サンセット・終了」から「エグジット・サンセット」に広げた。売却も終了も、同じ準備（権利・契約・データ・数字）で決まるため。
- チェックリストと AI が確かめられる合格条件：`catalog/exit_dd.yaml`（dd.ip / contracts / privacy / code / infra / metrics / billing_sources / sunset）
- 事例の学び（リンクインバイオ分野）：買収は機能かチーム目当てが多く、金額は非公開、サービスは統合後に終わることが多い。書類がそろった売り手は技術調査が約8週間で済んだ。
- KPI の目安は事例から逆算した推定とし、市場基準として扱わない。

## 08 アプリ配布パック
`catalog/app_distribution.yaml`。PWA → TWA → Capacitor → Expo → ネイティブの比較と、ストア規則（2026-10-26 公式確認）。
依存：IAPの有無 → 課金アーキテクチャ → ストア審査リスク → 手取り率 → DDでの売上の突き合わせ。
注意：Apple 3.1.3(b) では、ウェブで買ったサブスクをアプリで使えるのは、同じものをIAPでも買える場合に限られる。そのため「ウェブ課金のみ」を選ぶなら、米国外ではアプリ内に購入導線を出さない設計にする必要がある。Play も同じで、アプリ内から他の決済へ誘導できない。

## 09 国別GTM
`catalog/cross_border.yaml` と各プロジェクトの `projects/<id>/*.axes.yaml` に、国の波・言語・決済・プライバシー法・チャネルを並べる。

## プロジェクト軸の書き方
open_decisions は Blueprint が決めない。選択肢を並べ、affects と dependencies を書く。例：`templates/project.axes.yaml`。
