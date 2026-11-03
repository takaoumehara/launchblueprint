# Component map (template)

Copy this file into your product repo (e.g. `docs/component-map.md`) and reference it from `AGENTS.md`:

> UI work must use only the tokens and components listed in `docs/component-map.md`. If something is missing, add it to the map in the same PR.

Rule: `ui_ux.component-map-only`. Review fixes flow back here (`ui_ux.learn-from-rejection`).

## Tokens

| Token | File path | Value (web / iOS / Android) | Usage example | Use when | Do not use when | Drift check (same value on all platforms?) |
|---|---|---|---|---|---|---|
| `color.primary` | `src/styles/tokens.css` | `#…` / `#…` / `#…` | `bg-[var(--color-primary)]` on the main CTA | The single primary action | Selected states, decoration | yes / no |
| `space.4` | | | | | | |

## Components

### `<ComponentName>`

- **File path:** `src/components/…`
- **Usage example:**
  ```tsx
  <Button variant="primary">Save</Button>
  ```
- **Use when:** …
- **Do not use when:** … (name the mapped alternative)
- **Required states:**
  - [ ] empty
  - [ ] loading
  - [ ] error
  - [ ] dark theme
  - [ ] disabled / focus (if interactive)
- **Platform drift:** same props, spacing and colours on web / iOS / Android? yes / no — note differences.
- **Allowed in generated UI?** yes / no (used by the schema for `ui_ux.generative-ui-within-schema`)

## Change log

| Date | Change | Trigger (review comment / rule) |
|---|---|---|
