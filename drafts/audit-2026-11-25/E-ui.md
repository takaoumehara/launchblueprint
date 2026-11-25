# E-ui: catalog audit (content / UI). Topics: cms, editor_ui, ui_library, idea_validation

Auditor: subagent E. Date: 2026-11-23. Repo files read only (not edited).
Files: `skill/blueprint/catalog/{cms,editor_ui,ui_libraries,validation}.yaml`, `skill/blueprint/elements/stack_comparisons.yaml` (topics cms L630-695, editor_ui L696-750, ui_library L751-866, idea_validation L868-929), `skill/blueprint/elements/tactics.yaml` (cms L505-531, editor_ui L532-552, ui_library L553-582, idea_validation L602-620).

**Network limitation (read this first).** From this sandbox, most vendor hosts did not resolve (DNS blocked by the session's network policy). Blocked: microcms.io, sanity.io, storyblok.com, tina.io, sheetdb.io, developers.google.com, developers.notion.com, notion.so, tiptap.dev, blocknotejs.org, puckeditor.com, dndkit.com, vaul.emilkowal.ski, base-ui.com, react-spectrum.adobe.com, heroui.com, heroui.pro, untitledui.com, coss.com, daisyui.com, tremor.so, pro.magicui.design, reactbits.dev, pro.reactbits.dev, kibo-ui.com, carrd.co/.com, framer.com, tally.so, typeform.com, workspace.google.com, docs.google.com.
Reachable and read directly: ui.shadcn.com, magicui.design, ui.aceternity.com, smoothui.dev, transitions.dev, 21st.dev, vercel.com, github.com (HTML), raw.githubusercontent.com, registry.npmjs.org.
For blocked vendors I used WebSearch result text that quotes the vendor's own pages. Those rows are marked "(search snippet of official page)" and their confidence is capped at med. GitHub REST API (`gh api`) was also blocked, so repository status comes from the GitHub HTML pages, raw files and the npm registry.

---

## 1. Per-option findings

### cms.microcms
unchanged (checked). Search snippet of microcms.io/en/pricing: "Team: For small team projects ¥4,900+ / mo". The GB figures were not shown in the snippet. Not re-verified, so the 2026-11-02 values stand.

### cms.sanity
unchanged (checked). Search snippet of sanity.io/pricing: Growth "$15 per seat / month", up to 50 seats; Free 20 seats; API 250k/月 on both plans. This matches the catalog. Confidence med (host blocked).

### cms.storyblok
unchanged (checked). Search snippet of storyblok.com/pricing: Starter free (1 seat, up to 2), 100k API, 100GB; Growth $99.00. Confidence med.

### cms.tina
unchanged (checked). Search snippet of tina.io/pricing: "Team … $24/ project / month, $290 billed annually (save $58)". $290+$58 = $348/yr = $29/月 when billed monthly, which matches "Team $29/月（年払い $24）". "3人〜" was not visible in the snippet. Confidence med.

### cms.sheets
| id | field (file:key) | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| cms.sheets | cms.yaml:limits (new key) | (none) | SheetDB's pricing page warns that a free account cannot be upgraded later. A beginner who starts on Free has to rebuild under a new account. | `SheetDB の無料アカウントは後から有料に切り替えられない（有料にするなら最初から有料で作る）` | sheetdb.io/pricing (search snippet of official page): "Free accounts can't switch to a paid plan later" | med |
| cms.sheets | stack_comparisons.yaml:cms.services[cms.sheets].free_tier | `Sheets API 無料（読み書き各 300回/分/プロジェクト）／SheetDB Free：月500回` | Consistency. The catalog notes that Google plans to charge for over-quota use in 2026, but the comparison omits it. | `Sheets API 無料（読み書き各 300回/分/プロジェクト。超過分は 2026 年中に課金開始予定）／SheetDB Free：2シート・月500回` | developers.google.com/workspace/sheets/api/limits (search snippet): "Exceeding the quota request limits is planned to incur charges to your Google Cloud billing account later in 2026" | med |

Everything else is unchanged: 300/min per project, 60/min per user, SheetDB $29.99 (annual $25.49), 10,000 requests/月, and Free with 2 sheets and 500 requests/月 all match the snippet.

### cms.notion
unchanged (could not re-verify). The official request-limits page could not be read. Search snippets disagree. One quotes the official wording as "Per connection — an average of three requests per second … Per workspace — … scaled to the workspace's plan". Others give "180/min, 600/min on Business/Enterprise (from 2026-09-09)". 180/min equals 3 req/s, so the catalog is not contradicted. Keep the 2026-11-02 values and re-check when the host is reachable.

### edit.vaul
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| edit.vaul | editor_ui.yaml:avoid_when | `パソコン中心。保守停止のため、新規なら Base UI 等の Drawer も比べる` | Outdated. shadcn/ui's default Drawer (Base UI variant) no longer uses vaul, and Base UI became shadcn's default in 2026-07. "Base UI 等も比べる" is too soft. | `新しく作る時（shadcn の Drawer は Base UI 製に移行済み）。vaul は 2025-10 から保守停止` | ui.shadcn.com/docs/components/base/drawer: "The drawer component now uses Base UI instead of Vaul." / "- npm install vaul + npm install @base-ui/react"; github.com/emilkowalski/vaul README: "This repo is unmaintained. I might come back to it at some point, but not in the near future." Last commit "Explain maintenance" on Oct 3, 2025 | high |
| edit.vaul | editor_ui.yaml:source.note | `リポジトリ README に「unmaintained（保守停止）」の記載あり（2026-11-02）` | Add the date and npm status. | `README に「unmaintained」（2025-10-03 の commit）。npm 最終版 1.1.2（2024-12-14）。shadcn の Radix 版 Drawer だけがまだ vaul を使う` | registry.npmjs.org/vaul: latest 1.1.2, 2024-12-14; ui.shadcn.com/docs/components/radix/drawer: "Drawer is built on top of Vaul" | high |
| edit.vaul | stack_comparisons.yaml:editor_ui.recommendation.reason | `スマホ編集の核は「タップ→下から入力パネル」。vaul を土台に、並べ替えは dnd-kit（＋上下ボタン）、文字は Tiptap を足す。全部無料。` | The pick is an unmaintained library that shadcn itself has dropped. The "tap → bottom sheet" core now ships in shadcn's default Drawer (Base UI). | `スマホ編集の核は「タップ→下から入力パネル」。shadcn の Drawer（Base UI 製）を使い、並べ替えは dnd-kit（＋上下ボタン）、文字は Tiptap。全部無料。vaul は保守停止で、Radix 版の既存コードだけ。` (Structural: either change `pick`/`ai_pick` to `ui.base-ui`, or add an option such as `edit.base-drawer`. The editor_ui options have no Base UI Drawer entry today.) | same as above | high (fact) / decision needed |
| edit.vaul | tactics.yaml:editor_ui.ai_reason_ja | `タップ→下から入力パネルがスマホ編集の核。並べ替えと文字は足す。` | Same reason as above. The library that delivers the panel is no longer vaul for new projects. | `タップ→下から入力パネルが核。新規は shadcn の Drawer（Base UI 製）で、vaul は保守停止。` | same | high |
| edit.vaul | stack_comparisons.yaml:editor_ui.combine.combined | `vaul（下からの入力パネル）＋ dnd-kit（並べ替え）＋ Tiptap（文字）を自分で組むと、スマホの操作感を細かく作れる。どれも無料。` | Same reason as above. | `shadcn の Drawer（Base UI 製の下からの入力パネル）＋ dnd-kit（並べ替え）＋ Tiptap（文字）を自分で組むと、スマホの操作感を細かく作れる。どれも無料。` | same | high |

### edit.dnd-kit
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| edit.dnd-kit | editor_ui.yaml:source.note (new) | (none) | Maintenance split a beginner and an AI will trip on. The classic `@dnd-kit/core` has had no release since 2024-12. Active work is in the new 0.x packages (`@dnd-kit/react`), which are still before 1.0. Tutorials and AI code mostly use the old API. | `旧 @dnd-kit/core は 6.3.1（2024-12-05）が最後。新しい @dnd-kit/react は 0.5.3（2026-10-31、1.0 前）。どちらで書くか最初に決める` | registry.npmjs.org: @dnd-kit/core latest 6.3.1 @ 2024-12-05; @dnd-kit/react 0.5.3 @ 2026-10-31. github.com/clauderic/dnd-kit README now lists `@dnd-kit/react`, `@dnd-kit/dom` | high |
License MIT is unchanged (npm). The repo is not archived.

### edit.puck
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| edit.puck | editor_ui.yaml:source.note (new) | (none) | The npm package was renamed. `@measured/puck` is deprecated, so AI-written install lines will warn. | `npm は @puckeditor/core（旧 @measured/puck は非推奨）。MIT は商用可` | registry.npmjs.org/@measured/puck: "DEPRECATED: Puck has moved. Please use @puckeditor/core instead"; github.com/puckeditor/puck README: "Puck's MIT license permits internal and commercial use." | high |
| edit.puck | editor_ui.yaml:pricing_bands.usd100 | `—` | There is now a paid hosted add-on (Puck Cloud: Pages, Auth, AI). The README says it "is free to start". Prices could not be read (host blocked). | `Puck Cloud（ページ保存・認証・AI の有料ホスト。無料で開始可・金額は未確認）` | github.com/puckeditor/puck README: "Puck Cloud … our modular, hosted backend for Puck … is free to start"; puckeditor.com/pricing not readable | low (price) |

### edit.tiptap
unchanged (checked). Search snippets of tiptap.dev/pricing and third parties agree: Start $49/月 billed annually, $59/月 billed monthly. Confidence med.

### edit.blocknote
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| edit.blocknote | editor_ui.yaml:pricing_bands.usd100 | `Business $195/月（年払い $2,340。xl パッケージの商用ライセンス込み・1アプリ）` | Wrong framing. $195 is the annual price divided by 12. Billed monthly, Business is **$390/月**. | `Business $390/月（年払い $2,340＝$195/月相当。xl パッケージの商用ライセンス込み）` | BlockNote's own pricing page source (github TypeCellOS/BlockNote main, docs/app/pricing/page.tsx): `price: { month: 390, year: 2340 }`; tiers.tsx shows yearly as `${Math.round(tier.price.year / 12)}/month … billed yearly`. Search snippet of blocknotejs.org/pricing: "Business $390 / month" | high |
| edit.blocknote | stack_comparisons.yaml:editor_ui.services[edit.blocknote].paid_entry | `Business $195/月（年払い $2,340。xl の商用ライセンス込み）` | Same issue as above (consistency). | `Business $390/月（年払い $2,340＝$195/月相当。xl の商用ライセンス込み）` | same | high |
| edit.blocknote | editor_ui.yaml:pricing_bands.free | `本体 MPL-2.0・無料。@blocknote/xl-* は GPL-3.0（OSS なら無料）か商用ライセンス` | Correct. Optionally name what the xl packages are, so the reader knows what is behind the paywall. | `本体 MPL-2.0・無料。AI・PDF/Word 書き出し・段組み（@blocknote/xl-*）は GPL-3.0（OSS なら無料）か商用` | page.tsx Business features: "AI integration / Multi-column layouts / Export to PDF, Docx, ODT, Email"; npm @blocknote/xl-ai license "GPL-3.0 OR PROPRIETARY" | high |
| edit.blocknote | stack_comparisons.yaml:editor_ui.recommendation.rejected[edit.blocknote].why | `Notion 風がすぐ出るが見た目の自由度が低い。長文を書かせる時の候補。` | Vague. It omits the decisive axis: AI, export and columns need GPL or $390/月 in a closed-source app. | `Notion 風がすぐ出るが見た目の自由度が低く、AI・書き出しを非公開アプリで使うと $390/月。長文を書かせる時の候補。` | same | high |

### ui.shadcn
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| ui.shadcn | ui_libraries.yaml:best_for | `アプリ全体の土台。AIが一番書き慣れている` | Add the 2026-07 change so readers know the default layer. The catalog's combine text already assumes it. | `アプリ全体の土台。2026-07 から新規は Base UI が標準（Radix・React Aria 版も選べる）` | ui.shadcn.com/docs/changelog/2026-07-base-ui-default: "New projects now use Base UI by default." … "Radix is not being deprecated" … `shadcn init -b radix`; component pages offer "Base UI," "React Aria," and "Radix UI" tabs | high |
License MIT (npm `shadcn` 4.23.0) is unchanged.

### ui.base-ui
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| ui.base-ui | ui_libraries.yaml:source.note (new) | (none) | The package was renamed. `@base-ui-components/react` is deprecated and the current package is `@base-ui/react` (1.9.0). It now includes the Drawer that replaces vaul. | `npm は @base-ui/react（旧 @base-ui-components/react は非推奨）。v1.9.0（2026-10）。Drawer（スワイプで閉じる下パネル）あり` | registry.npmjs.org: @base-ui-components/react "DEPRECATED: Package was renamed to @base-ui/react"; @base-ui/react 1.9.0 @ 2026-10-09 MIT; base-ui.com/react/components/drawer (search snippet) "swipe-to-dismiss" | high |

### ui.react-aria
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| ui.react-aria | stack_comparisons.yaml:ui_library.recommendation.rejected[ui.react-aria].why | `アクセシビリティ最重視の時は Base UI の代わりに。` | shadcn now ships React Aria variants of its components. Give the concrete action. | `読み上げ最重視なら shadcn の React Aria 版を選ぶ（見た目は同じ）。` | ui.shadcn.com/docs/components/base/accordion: tabs "Base UI," "React Aria," "Radix UI"; changelog 2026-10: "available for Base UI, React Aria and Radix across all eight styles" | high |
License Apache-2.0 (react-aria-components 1.22.1, 2026-10-09) is unchanged.

### ui.heroui
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| ui.heroui | ui_libraries.yaml:source.note | `ライセンスは Apache-2.0（LICENSE で確認）。有料の HeroUI Pro は https://heroui.pro/pricing に金額なし（2026-11-03）` | Partly true. The npm license changed MIT → Apache-2.0 only at v3.2.7 (2026-10-28). v2 and earlier v3 are MIT, and the `main`/`v2` branch LICENSE is still MIT. A user on v2 is on MIT, not Apache. | `v3.2.7（2026-10-28）以降は Apache-2.0、それ以前の v3 と v2 は MIT。HeroUI Pro は買い切り（公式の金額は未確認）` | registry.npmjs.org/@heroui/react: versions up to 3.2.6 "MIT", 3.2.7 (2026-10-28) "Apache-2.0"; raw LICENSE: branch `master`/`v3` = Apache, `main`/`v2` = MIT | high |
HeroUI Pro price: still unverified. Third-party listings give Solo $249 one-time, but heroui.pro is blocked. Keep "金額未確認".

### ui.untitled
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| ui.untitled | stack_comparisons.yaml:ui_library.recommendation.rejected[ui.untitled].why | `Figma 連携は最強だが有料で人数課金。デザイナーがいる時の候補。` | Misleading. "人数課金" reads as a monthly per-seat subscription. These are one-time licences with seat tiers, and there is a free React tier that allows commercial use. | `無料の React 版（商用可）もある。Figma とそろえる PRO は買い切り $129〜（人数で段階）。デザイナーがいる時の候補。` | Polar checkout (vendor's checkout): "Figma PRO SOLO (1 user only) $129" one-time; untitledui.com/pricing snippet: "pay once, use forever"; React PRO BUSINESS $2,499 / ENTERPRISE $8,999. React PRO SOLO $349 not visible in the snippets | med |
| ui.untitled | stack_comparisons.yaml:ui_library.switch_points[1].upgrade_to | `Untitled UI（Figma $129〜／React $349〜、人数で上がる）` | OK, but add "買い切り" for consistency. | `Untitled UI（買い切り：Figma $129〜／React $349〜、人数で上がる）` | same | med |

### ui.coss
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| ui.coss | ui_libraries.yaml:what | `shadcn 系のコピー部品集` | coss ui is built on **Base UI** by Cal.com and is actively developed. Only the legacy Origin UI snapshot (Radix-based) is in limited maintenance. | `Base UI ベースのコピー部品集（Cal.com 製。shadcn と同じ使い方）` | github.com/origin-space/originui (= coss repo) README: "coss ui … Built on top of Base UI and styled with Tailwind CSS … copy, paste, and own." "This is the component library we'll be progressively adopting for cal.com." | high |
| ui.coss | ui_libraries.yaml:pricing_bands.free | `MIT・無料（旧 Origin UI。保守は限定的と公式に記載）` | Misleading. The "limited maintenance" note applies to the old Origin UI components, not to coss ui. | `MIT・無料（保守が限定的なのは旧 Origin UI の部品だけ。coss ui 本体は開発中）` | same README: "Origin UI was a pre-acquisition collection of Radix-based, shadcn-style components that remains available for use, but with limited support and maintenance. Active development now focuses on the new Particles components built on the coss ui primitives." / "This entire repository is licensed under the MIT License." LICENSE: "MIT License Copyright (c) 2025 coss.com and Origin UI" | high |
| ui.coss | ui_libraries.yaml:best_for | `部品の種類を増やす` | Give a concrete decision axis. | `Base UI 版 shadcn に部品を足す（同じ土台で揃う）` | same | med |
Note: some third-party pages and forks say the repo is AGPL with only `apps/origin` under MIT. The current README and root LICENSE say the whole repository is MIT. Keep MIT.

### ui.daisyui
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| ui.daisyui | stack_comparisons.yaml:ui_library.recommendation.rejected[ui.daisyui].why | `React 以外でも使えるが細かい動きが弱い。` | Vague, and a misleading dichotomy. daisyUI is CSS classes only, so the decisive trade-off is that behaviour (open/close, focus, keyboard) is not included. | `CSS のクラスだけで React 以外でも使える。開閉・キーボード操作は自分で書く。` | github.com/saadeghi/daisyui README (daisyUI = Tailwind CSS plugin / component classes); npm daisyui 5.8.2 MIT (2026-11-20) | med |
| ui.daisyui | ui_libraries.yaml:avoid_when | `細かい動き` | Same as above. | `開閉やキーボード操作まで部品に任せたい時（CSS だけで動きは無い）` | same | med |

### ui.tremor
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| ui.tremor | ui_libraries.yaml:pricing_bands.free | `Apache-2.0・無料（一部の部品は MIT）` | "一部の部品は MIT" is not supported. The README and LICENSE say Apache-2.0 only. The ownership change is missing: Vercel acquired Tremor in 2025-01 and made all products (including the formerly paid Blocks) free. | `Apache-2.0・無料（2025-01 に Vercel が買収し、有料だった Blocks も無料化）` | vercel.com/blog/vercel-acquires-tremor (search snippet, 2025-01-22): "all Tremor products, including Tremor Blocks, are now free and open source"; raw README: "License: Apache License 2.0" | high (license) / med (blog via snippet) |
| ui.tremor | ui_libraries.yaml:avoid_when | `—` | Maintenance. The last commit to tremorlabs/tremor was 2025-10-10, and before that 2025-04. The npm package @tremor/react was last released 2025-01-13. | `長く更新される前提が要る時（2025-10 以降リポジトリ更新なし）` | github.com/tremorlabs/tremor/commits/main: most recent "Oct 10, 2025 Delete chromatic.yml"; registry.npmjs.org/@tremor/react 3.18.7 @ 2025-01-13 | high |

### ui.magicui
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| ui.magicui | stack_comparisons.yaml:ui_library.switch_points[0].upgrade_to | `Magic UI Pro $49（買い切り）` | **Inconsistent.** The catalog and the comparison service both say Pro $199. $49 appears nowhere on the vendor pages found. | `Magic UI Pro $199（買い切り）` | catalog ui_libraries.yaml ui.magicui usd5 "Pro $199（買い切り…）" (checked 2026-11-03). pro.magicui.design blocked here; snippets: "one-time price", third parties $199 | high (inconsistency) / med (price) |
| ui.magicui | stack_comparisons.yaml:ui_library.switch_points[0].why | `安く、商用可。自作より早い。` | "安く" no longer fits at $199. | `商用可の買い切り。LP を何本も出すなら自作より早い。` | — | med |
License: MIT (raw LICENSE.md "MIT License Copyright (c) Magic UI"). Unchanged.

### ui.aceternity
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| ui.aceternity | ui_libraries.yaml:pricing_bands.usd5/usd10/usd100 | `1年 $169／チーム10人 $1,590（買い切り）` | Missing the Lifetime plan, the "Most popular" tier at $199 (1年 is only $30 cheaper). "（買い切り）" placed at the end reads as applying only to Team. | `1年 $169／永久 $199／チーム10人 $1,590（どれも1回払い。1年は更新任意）` | ui.aceternity.com/pricing: "1-Year License: $169 … One-time payment, 1-year license"; "Lifetime Access: $199 … One-time payment, lifetime access" (Most popular); "Team: $1,590 … 10 team members included" | high |
| ui.aceternity | ui_libraries.yaml:pricing_bands.free | `無料部品あり` | Give the number and the commercial rule. | `無料部品 100 以上（商用可・部品そのものの再配布は不可）` | pricing: "Access to all 100+ free components"; ui.aceternity.com/licence: "create unlimited end products … may be sold" / "can't sell or distribute the Item or derivative works on any marketplace" | high |
| ui.aceternity | stack_comparisons.yaml:ui_library.services[ui.aceternity].paid_entry | `1年 $169／チーム10人 $1,590` | Consistency. | `1年 $169／永久 $199／チーム10人 $1,590（1回払い）` | same | high |

### ui.smoothui
unchanged (checked). raw LICENSE: "MIT License Copyright (c) 2024 Eduardo Calvo". smoothui.dev shows no paid tier and is now an official shadcn registry (`shadcn add @smoothui/...`).

### ui.transitions
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| ui.transitions | ui_libraries.yaml:pricing_bands.free | `Free $0（MIT のコア部品と無料スキル）` | Add the commercial rule. The free AI "Motion Agent" is personal-use only. The MIT core is fine for commercial use. | `Free $0（MIT のコア部品と無料スキル。AI の Motion Agent 無料枠は個人利用のみ）` | transitions.dev/pro.html: "Free Motion Agent for personal use." / "MIT core transitions" | high |
Pro $12/月, Business $59/月 (5 seats, +$12/seat) and Lifetime $149 are unchanged (same page).

### ui.reactbits
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| ui.reactbits | ui_libraries.yaml:pricing_bands.usd100 | `Pro 買い切り $129／$249／$349（Starter／Pro／Ultimate。開発者1人あたり、プロジェクト数無制限）` | Still correct. Pro now also lists yearly plans, which a reader may compare against. | `Pro 買い切り $129／$249／$349（Starter／Pro／Ultimate。開発者1人・プロジェクト無制限）。年払い $79／$149／$199 もあり` | pro.reactbits.dev/about and /llms.txt (search snippets): "Starter $129, Pro $249, Ultimate $349 … one-time"; "Annual plans … $79, $149, and $199 per year" | low (annual) |
Free-tier license: raw LICENSE.md is still MIT + Commons Clause ("You may use this Software, including for any commercial purpose, so long as you do not sell, sublicense, or redistribute the components themselves"). The current text is correct. The licence now also covers React Bits tools and sounds, which does not affect the catalog.

### ui.21st
unchanged (checked). 21st.dev/pricing: Free (Hobby) $0 with 2 free copies/day; Builder "$6/mo billed yearly, $8/mo billed quarterly"; Builder + AI 500 credits "$15" yearly; Team Builder "$7.50/mo". All match.
Optional: free tier `Free（Hobby）$0` → `Free（Hobby）$0：コピーは1日2回まで` (high; same page: "2 free copies per day").

### ui.kibo
unchanged (checked). raw license.md is MIT ("Copyright (c) 2023 — Present shadcnblocks"). GitHub About says "Free and open source, forever." It was acquired by shadcnblocks (2025-10-28 per shadcnblocks.com blog snippet), which the current source URL already reflects.

### val.lp-own
unchanged (checked for Pro). vercel.com/pricing: Pro "$20/mo", "Pro plans have a $20 included credit". The Hobby "個人・非商用" restriction is **not on vercel.com/pricing any more**, and the fair-use page's example sections did not render. That claim was not re-verified here; leave it to the hosting auditor.

### val.carrd
unchanged (could not verify; host blocked). Snippets of carrd.co/docs/pro/plans agree on Pro Lite $9/年, Pro Standard $19/年 and Pro Plus $49/年. Note: snippets show both `carrd.co` and `carrd.com`, and the catalog uses `carrd.com`. Check which one is canonical.

### val.framer
unchanged (checked via snippets). framer.com/pricing: Free (1 GB), Basic $10/月 (50 GB), Pro $30/月 (100 GB). No custom domain on Free. Confidence med.

### val.tally
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| val.tally | validation.yaml:pricing_bands.usd100 | `Pro $24/月（年払いは 2 か月分割引）／Business $74/月` | **Wrong framing.** $24 and $74 are the annual-billing monthly equivalents. Billed monthly, Pro is $29/月 and Business is $89/月. The current text implies a further discount on top of $24. | `Pro $29/月（年払い $290＝$24/月）／Business $89/月（年払い $890＝$74/月）` | tally.so/help/tally-pro (search snippet of official help page): "$29/month or $290/year (get 2 months free)"; tally.so/help/tally-business: "$89/month or $890/year (get 2 months free)" | med-high (official help page via snippet) |
| val.tally | stack_comparisons.yaml:idea_validation.services[val.tally].paid_entry | `Pro $24/月（年払いは 2 か月分割引）` | Same issue (consistency). | `Pro $29/月（年払い $290＝$24/月）` | same | med-high |

### val.typeform
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| val.typeform | stack_comparisons.yaml:idea_validation.recommendation.rejected[val.typeform].why | `無料の回答数が少なく金額非表示。分岐が要る時だけ。` | Inaccurate. Paid prices are shown ($39/月〜). Only the free tier's response number is missing from the pricing page. | `無料は回答数が少ない（料金ページに数値なし）。有料は $39/月〜。分岐が要る時だけ。` | catalog's own note + typeform.com/pricing snippets: Basic $39 (annual $28) | high |
Prices are unchanged. Snippets agree on Basic $39/$28, Plus $79/$56 and Business $129/$91, and say free is 10 responses/月 (third-party only). Keep "未確認".

### val.google-forms
unchanged (checked via snippet). support.google.com/a/answer/15400543 (snippet): Business Starter "$7 USD per user" on the annual plan, "$8.40" flexible.
Optional: `Business Starter $7/ユーザー/月（年契約。月契約は $8.40）` (med).

---

## 2. Other consistency / framing flags (no single option)

| file:key | current text | issue | proposed text | conf |
|---|---|---|---|---|
| stack_comparisons.yaml:ui_library.services | (7 options missing) | tactics.yaml ui_library.options lists 15 ids, but stack_comparisons services/rejected cover only 8. Missing: ui.coss, ui.tremor, ui.smoothui, ui.transitions, ui.reactbits, ui.21st, ui.kibo. Users who see these in tactics get no comparison or rejection reason. | Add services rows copied from the catalog, plus rejected lines: coss `Base UI 版 shadcn に部品を足す時だけ。土台ではない。`; tremor `グラフ・ダッシュボード専用。2025-10 以降更新なし。`; smoothui `LP の演出専用。アプリ画面には入れない。`; transitions `動きの見本。AI 機能の無料枠は個人利用のみ。`; reactbits `LP 演出専用。部品そのものの再配布・販売は不可（Commons Clause）。`; 21st `足りない部品を探す場所。作者ごとに品質とライセンスを確認。無料は1日2回コピー。`; kibo `ガント・カンバン等の複雑な部品を足す時だけ。土台ではない。` | high |
| stack_comparisons.yaml:ui_library.combine.single | `shadcn/ui（土台は Base UI）1つなら見た目のルールが1つで、AI も一番書き慣れている。` | Now officially correct (default since 2026-07). No change needed. | — | high |
| stack_comparisons.yaml:editor_ui.combine.risks | `…vaul は 2026-11 時点でリポジトリが「保守停止」と明記（安定して動くが、不具合は自分で直す前提）。` | The date is off. Maintenance stopped on 2025-10-03. | `…vaul は 2025-10 からリポジトリが「保守停止」と明記（shadcn の標準 Drawer も Base UI 製に移行済み）。` | high |

---

## 3. pick_when rejected (rules in my group)

### cms: `if: {country: global}` → pick **cms.sanity**
Reason text OK (`海外の編集者や複雑なデータに強い。`). Rejected list when Sanity wins:
- cms.microcms: `円建て・日本向けの管理画面とサポート。海外の編集者には英語の Sanity が渡しやすい。`
- cms.storyblok: `見たまま編集は強いが無料は実質1人、有料は $99/月。見たまま編集が必須で予算がある時。`
- cms.tina: `Git で管理する文章サイト向け。編集者に Git の流れが漏れやすい。`
- cms.sheets: `少量の表（お知らせ・価格表）だけなら最安。下書き・権限・画像が弱い。`
- cms.notion: `社内がすでに Notion の時だけ。回数制限と画像URLの期限切れがある。`

### idea_validation: `if: {audience: self}` → pick **val.google-forms**
The reason `自分や知り合い向けなら、最小の調査で十分。` is a bit vague. Proposed: `自分・知り合い向けなら Google アカウントだけで無料、回答はそのままシートに入る。`
Rejected list when Google Forms wins:
- val.tally: `無料で強いが別アカウントが要る。知らない人に公開する時の第一候補。`
- val.lp-own: `自分向けに紹介ページを作るのは手間に見合わない。`
- val.carrd: `紹介ページは知らない人に見せる時だけ要る。自分向けには不要。`
- val.framer: `見た目を作り込む必要がない。無料は独自ドメインも不可。`
- val.typeform: `無料の回答数が少なく、有料は $39/月〜。自分向けには過剰。`

(editor_ui and ui_library have no pick_when rules.)

---

## 4. urls

"200" = fetched OK from this sandbox. "blocked" = host not resolvable from this sandbox; URL taken from the vendor's own README, links or search results. Recheck these.

| id | site_url | start_url | check |
|---|---|---|---|
| cms.microcms | https://microcms.io/ | https://app.microcms.io/signup | blocked |
| cms.sanity | https://www.sanity.io/ | https://www.sanity.io/get-started | blocked |
| cms.storyblok | https://www.storyblok.com/ | https://app.storyblok.com/#/signup | blocked |
| cms.tina | https://tina.io/ | https://tina.io/docs | blocked |
| cms.sheets | https://developers.google.com/workspace/sheets/api | https://developers.google.com/workspace/sheets/api/quickstart/js (SheetDB: https://sheetdb.io/ → https://app.sheetdb.io/) | blocked (quickstart URL confirmed in search results) |
| cms.notion | https://developers.notion.com/ | https://www.notion.so/profile/integrations | blocked |
| edit.vaul | https://vaul.emilkowal.ski/ | https://vaul.emilkowal.ski/getting-started | blocked (start URL linked from ui.shadcn.com radix/drawer page) |
| edit.dnd-kit | https://dndkit.com/ | https://dndkit.com/ (README: "Visit dndkit.com for full documentation") | blocked |
| edit.puck | https://puckeditor.com/ | https://puckeditor.com/docs | blocked (both linked from README) |
| edit.tiptap | https://tiptap.dev/ | https://tiptap.dev/docs/editor/getting-started/overview | blocked |
| edit.blocknote | https://www.blocknotejs.org/ | https://www.blocknotejs.org/docs/getting-started | blocked (both linked from README) |
| ui.shadcn | https://ui.shadcn.com/ | https://ui.shadcn.com/docs/installation | 200 / 200 |
| ui.base-ui | https://base-ui.com/ | https://base-ui.com/react/overview/quick-start | blocked |
| ui.react-aria | https://react-spectrum.adobe.com/react-aria/ | https://react-spectrum.adobe.com/react-aria/getting-started.html | blocked |
| ui.heroui | https://www.heroui.com/ | https://heroui.com/docs/react/getting-started/quick-start | blocked (start URL in search results) |
| ui.untitled | https://www.untitledui.com/ | https://www.untitledui.com/react | blocked |
| ui.coss | https://coss.com/ui | https://coss.com/ui/docs | blocked (site linked from repo About; docs URL in search results) |
| ui.daisyui | https://daisyui.com/ | https://daisyui.com/docs/install/ | blocked (both linked from README) |
| ui.tremor | https://tremor.so/ | https://tremor.so/docs/getting-started/installation | blocked (both linked from README) |
| ui.magicui | https://magicui.design/ | https://magicui.design/docs/installation | 200 / 200 |
| ui.aceternity | https://ui.aceternity.com/ | https://ui.aceternity.com/components | 200 / 200 |
| ui.smoothui | https://smoothui.dev/ | https://smoothui.dev/docs/guides/getting-started | 200 / 200 |
| ui.transitions | https://transitions.dev/ | https://transitions.dev/skill.html#installation | 200 (home and pro.html; footer "Installation" link points to /skill.html#installation) |
| ui.reactbits | https://reactbits.dev/ | https://reactbits.dev/get-started/installation | blocked (both linked from README) |
| ui.21st | https://21st.dev/ | https://21st.dev/community/components | 200 / 200 |
| ui.kibo | https://www.kibo-ui.com/ | https://www.kibo-ui.com/docs/setup | blocked (in search results) |
| val.lp-own | https://vercel.com/ | https://vercel.com/signup | 200 / 200 |
| val.carrd | https://carrd.co/ | https://carrd.co/ (Sign Up on top page) | blocked; .co vs .com unresolved |
| val.framer | https://www.framer.com/ | https://www.framer.com/signup/ | blocked |
| val.tally | https://tally.so/ | https://tally.so/signup | blocked |
| val.typeform | https://www.typeform.com/ | https://admin.typeform.com/signup | blocked |
| val.google-forms | https://workspace.google.com/products/forms/ | https://docs.google.com/forms/ | blocked |

---

## 5. Could not verify

- **Hosts blocked from this sandbox:** every official page for microCMS, Sanity, Storyblok, Tina, SheetDB, Google Sheets limits, Notion limits, Tiptap, BlockNote site, Puck, HeroUI Pro, Untitled UI, coss.com, Tremor, Magic UI Pro, React Bits Pro, Kibo, Carrd, Framer, Tally, Typeform and Google Workspace. Values above for these come from search-result text of the official pages (med confidence at most). Entries changed on that basis should stay `verified: false` until someone reads the page.
- **Notion API rate limit:** 180/600 per minute vs "avg 3 req/s per connection + per-workspace limit". Sources conflict.
- **Magic UI Pro price ($199)** was not readable on pro.magicui.design. The $49 in switch_points is wrong either way.
- **HeroUI Pro price:** still not on an official page I could read. Third parties say $249 Solo.
- **Untitled UI React PRO SOLO $349** was not visible in snippets. Figma PRO SOLO $129 was confirmed via the vendor's checkout.
- **Puck Cloud prices** are unknown.
- **Typeform free responses/月 (10)** comes from third parties only.
- **Carrd** prices (snippets only) and the canonical domain (carrd.co vs carrd.com).
- **Vercel Hobby non-commercial rule** (val.lp-own) is no longer stated on vercel.com/pricing, and the fair-use examples did not render. Defer to the hosting auditor.
- **Tina "3人〜"** is not visible in snippets.
