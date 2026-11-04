# Capsule (feature handoff, one page)

Fill every section, then hand it to an agent. The agent replies with a **draft PR** only. Rule: `ui_ux.capsule-handoff`.

1. **User goal** — who, what they want to achieve, why (one or two sentences).
2. **Scope** — in scope / explicitly out of scope.
3. **Acceptance criteria** — yes/no statements.
   - [ ] …
4. **Components and tokens** — chosen from the component map only. New ones must be added to the map in the same PR.
5. **States to verify** (via the preview state switcher)
   - [ ] device: narrow mobile / desktop
   - [ ] theme: light / dark
   - [ ] signed in / signed out
   - [ ] role: …
   - [ ] empty / loading / error
6. **Relevant ui_ux_checklist items** — ids from `ui_ux_checklist` (MCP) for this phase.
7. **Out of bounds for the agent** — no merge, no production deploy, no new raw values.
