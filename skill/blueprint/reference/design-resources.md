# デザイン資料の置き場（参考サイト・素材・動きの学び）

提供：CREATIVITY IS EVERYWHERE, LLC ／ 確認日 2026-10-29。各サイトの中身・規約は変わるので、使う時に公式で確認する。
使い方：画面を作る前に「何を見るか」をこの表から選び、見たもの（URL）を `project-map` の判断の根拠に残す。真似ではなく、なぜ良いかを言葉にしてから自分のブランドで作る。

## 1. レビューの基準（毎回ここと比べる）
| サイト | 用途 |
|---|---|
| https://mobbin.com/ | 実在アプリの画面・流れ（スマホ／ウェブ） |
| https://refero.design/ | 実在プロダクトの画面を部品・流れで検索 |
| https://styles.refero.design/ | 色・文字・余白などスタイルの見本 |
| https://godly.website/ | 一流のウェブサイト |
| https://www.awwwards.com/ | 審査されたサイト（演出の上限を知る） |
| https://rauno.me/craft | 細部の作り込みの考え方 |
| https://60fps.design/ | スマホの動き |
| https://www.darkmodedesign.com/ | ダークモードの見本 |

## 2. 部分ごとの見本
| サイト | 部分 |
|---|---|
| https://footer.design/ | フッター |
| https://www.landingfolio.com/ ・ https://saaslandingpage.com/ ・ https://www.lapa.ninja/ | SaaS の LP |
| https://onepagelove.com/ | 1ページのサイト |
| https://motionsites.ai/ ・ https://motionin.design/ | 動きのある LP |
| https://reelfolio.io/ | 動画の作品集 |

## 3. 好みを合わせる（ブランドの方向を決める時）
https://minimal.gallery/ ・ https://www.siteinspire.com/ ・ https://land-book.com/ ・ https://recent.design/ ・ https://www.seesaw.website/ ・ https://refs.gallery/ ・ https://area17.com/culture

## 4. 優先度低（時間がある時）
https://inspora.design/ ・ https://deadsimplesites.com/ ・ https://designspells.com/ ・ https://httpster.net/ ・ https://landdding.com/ ・ https://wonderlist.design/

## 5. 素材（商用利用の条件を1つずつ確認してから使う）
| サイト | 中身 | 確認すること |
|---|---|---|
| https://spline.design/community | 3D 素材 | 作者ごとの再利用条件 |
| https://backgrounds.supply/ | 背景画像 | 有料・無料の区別と商用可否 |
| https://www.lummi.ai/ | AI 生成写真 | 無料／有料ライセンスの範囲 |
| https://kaboompics.com/ | 写真 | 商用可・帰属表示の要否 |
| https://www.pexels.com/@burst/ | 写真 | Pexels ライセンス（人物の扱い） |
| https://iconly.design/ | アイコン | 有料かどうか |
| https://fontinlogo.com/ | ブランドの書体を調べる | 書体そのものは別途ライセンス |

## 6. 動きと細部を学ぶ
https://animations.dev/ ・ https://devouringdetails.com/ ・ https://rauno.me/craft
- 外部の「1行で入れる」スクリプト（`curl … | bash`）は中身を読んでから。そのまま実行しない。

## 7. 部品集の使い分け（`elements/stack_comparisons.yaml` の ui_library と同じ）
- アプリ画面：Base UI／React Aria ＋ shadcn/ui。スマホ編集は vaul・dnd-kit。
- 小さな動き：transitions.dev・Magic UI を見本に。動きを減らす設定（prefers-reduced-motion）を必ず守る。
- Aceternity UI・SmoothUI・React Bits・21st.dev は LP のファーストビューだけ。アプリの作業画面には入れない。

## チェック（はい／いいえ）
- 画面ごとに、基準サイト（1.）のどれと比べたか言えるか
- 使った素材すべてに、商用可の確認日が残っているか
- 演出系の部品がアプリの作業画面に入っていないか
