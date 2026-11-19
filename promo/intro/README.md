# Blueprint intro (86 s, English)

A silent 1920×1080, 30 fps intro film that explains Blueprint end to end: the pain, what it is, how you use it, what it does, and an invitation. Narration is left to be recorded; everything needed to lay it in is here.

| File | What it is |
|---|---|
| `intro-silent.mp4` | The rendered film. H.264, 1920×1080, 30 fps, 86 s, no audio track. No subtitles or narration text are burned in. |
| `script.md` | Narration script, five beats, 181 words, with delivery and pronunciation notes. |
| `captions.en.vtt` | English subtitles, a separate file. Same lines and times as the script. |
| `timing.json` | Beat start/end, when the voice should start and stop in each beat, and every line with its time and the shot it covers. |
| `stills/` | Eight key frames (PNG) across the beats. |
| `src/` | The animation: `index.html`, `intro.css`, `intro.js`, `timeline.js` (the one source of timing), fonts (Inter, Geist Mono; SIL OFL, licences included). |
| `render/` | `render.cjs` (headless Chromium + ffmpeg) and `gen-meta.cjs` (writes `timing.json` and `captions.en.vtt` from `src/timeline.js`). |

## Timing

| # | Beat | Picture | Voice | Lines |
|---|---|---|---|---|
| 1 | Pain | 0:00–0:16 | 0.6–15.6 s | AI builds one screen fast; at week 6 a store rule strikes the checkout; the hidden categories (brand, money, rules, tech, ethics, launch) fade in around it; the timeline rewinds — a redo. |
| 2 | What Blueprint is | 0:16–0:29 | 16.4–28.6 s | The screen collapses into one node, the hidden categories become columns, and the whole map appears at once. Each column lights as it is named. |
| 3 | How it works | 0:29–0:45 | 29.2–43.4 s | Tap *Taking money* → options, recommended pick and reason → tap Compare (the set-aside option slides in) → what changes if you switch (dependents light up) → tap Approve (the node turns orange). |
| 4 | Features | 0:45–1:12 | 45.4–71.4 s | A new column is added · a dependency ripple from *Where data lives* · a foresight note on *App-store rules* · AI picks (white) vs your approval (orange) · Claude Code, Cursor and Codex → local MCP server → terminal calls and the exported `project-map.yaml`. |
| 5 | Close | 1:12–1:26 | 72.6–81.8 s | The map settles into a quiet constellation; Blueprint mark, "Join the early prototype" button, company name. Fade at 84.9–86.0 s. |

Line-by-line times are in `timing.json` (`beats[].lines[]`) and `captions.en.vtt`.

### Laying in the narration

Record each line to start at its `start` time (it can run a little long into the gap before the next line). Then:

```bash
ffmpeg -i intro-silent.mp4 -i narration.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest intro.mp4
```

To ship subtitles as a soft track instead of a side file:

```bash
ffmpeg -i intro.mp4 -i captions.en.vtt -map 0 -map 1 -c copy -c:s mov_text -metadata:s:s:0 language=eng intro-captioned.mp4
```

## Rebuild

Needs Node 18+, Playwright with Chromium (resolvable by `require('playwright')`), and ffmpeg.

```bash
cd promo/intro
node render/gen-meta.cjs                 # timing.json + captions.en.vtt from src/timeline.js
node render/render.cjs                   # intro-silent.mp4 (about 5–8 minutes)
node render/render.cjs --stills 11.6,27.5,36.6,42.9,51.5,57.0,66.8,81.0
node render/render.cjs --from 29 --to 45 --out /tmp/how.mp4   # one beat, for review
```

If Playwright is installed globally, prefix with `NODE_PATH=$(npm root -g)`.

Every frame is a pure function of time (`BP.seek(t)` in `src/intro.js`), so renders are repeatable. To change timing, edit `src/timeline.js` (narration cues and beats) and the times in `src/intro.js`, then run both scripts again.

### Watching it in a browser

Open `src/index.html` directly. It plays in a loop and scales to the window, with pause, a scrubber and an optional captions toggle (the captions are the player's overlay, never part of the video). With **prefers-reduced-motion: reduce**, the player does not animate: it shows one settled still per narration line, in time with the script.

## Design notes

- The look is the real map app (`app/`): hairline dependency strands, dot nodes in category columns (hollow = open, white = AI pick waiting, orange = decided), mono column labels, a top bar with Start / Map / Decide / Catalog, *Export YAML · Markdown*. Colours are the brief's: ocean-blue gradient `#0A1A2B → #0F2338`, light `#F6F9FC`, accent `#FF8A3D`, with a faint static grain to stop gradient banding.
- The columns follow the brief (brand, visuals, interactions, animation, experience, screens, tech stack, money, rules & legal, ethics, operations, launch, plus accessibility added on screen to show categories growing). The app today groups the same decisions into six lanes; the film shows the broader column set the brief describes.
- The decision panel uses the catalog's real content for *Taking money*: options Stripe Checkout / Stripe Connect / Paddle / Ryft, the recommendation and its reason, and the compare rows taken from each item's *what / best for / avoid when*. Prices are left out so the film does not go stale.
- The terminal shows real MCP tool names (`list_topics`, `draft_project_map`, `get_comparison`); the YAML follows the app's export shape (`status`, `ai_pick`, `pick`, `decided_by: human`, `rejected[].why` from the alternative's *avoid when*, `depends_on`).
- On-screen text is limited to UI labels. The closing line "See the whole project before you build." is spoken only; the end card shows the mark, a "Join the early prototype" button and the company name. No URL, no numbers presented as stats, no personal names.
