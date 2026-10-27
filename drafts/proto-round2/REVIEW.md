# Round 2 — ui-review (emil:ui-review) / 2026-10-26
Route (ask-emil): Undecided → emil:prototype (+get-creative framing) → emil:ui-review. prep-for-prod deferred until a direction is picked.
Harness: proto-round2/index.html (self-contained; bp-data + bp-data-compare embedded; links ../data/*.json and ../llms.txt). Production files untouched; backups in backups/round2-pre/.
Picker = verbatim PICKER.md chrome (dark pill) — hidden in screenshots (?shot=1); never ships.

## Common (all 3) — Approve with changes
- Should fix: canvas doesn't refit when the detail panel opens → right column hidden behind panel (fit() ignores `selected` at open time).
- Should fix: node hit area is 44px tall but sub-labels are 10–10.5px mono; fine for meta, too small for phone → needs mobile layout (list view) before prod.
- Should fix: SVG nodes are role=button with tabindex — keyboard order follows DOM (column order), OK; no arrow-key graph nav yet.
- Nit: trace mode dims non-trace labels to .42; in light A it reads slightly washed. Consider .5 for labels, keep wires at .06.
- Pass: radius 0 everywhere, only squares/circles; no gradients/glass in design; reduced-motion kills flow dashes (verified: animationName=none); no transition:all; theme toggle 44px target; 0 console errors.
## A Editorial — Approve with changes
- Should fix: 48px JP headline on compare wraps to 3 lines at 1600px; cap measure ~22字 or 40px.
## B Instrument — Approve with changes
- Should fix: out-port squares at column right edge add noise when not connected; render only for nodes with outgoing edges.
## C Line art — Approve with changes
- Should fix: trace dashes over 3-strand bundle read as "hatched cable"; use a single solid accent strand + dashes on top only.
- Should fix: label sits on top of wires passing through the dot column; needs a bg-colored text halo (paint-order stroke).
