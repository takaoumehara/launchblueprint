# UI/UX learnings (v1)

Generic rules learned while iterating on a mobile-first page editor (Oct 2026). Each rule maps to an entry in `catalog/ui_ux.yaml`; use the yes/no `check` in requirements, design and QA gates.

## Emphasis and hierarchy

- **primary-action-color**: Reserve the strongest colour (solid black or brand fill) for the single primary action on a screen. *Why:* Users' eyes were pulled between the main action and selected options, so the main action stopped standing out.
- **selected-state-tint**: Show selected states with a light accent tint plus a thin ring, not a solid fill. *Why:* A solid selected option looked like a second primary action.
- **borders-only-on-pressables**: Use boxes and borders only for pressable buttons; use plain text links elsewhere. *Why:* Too many framed boxes made the header feel busy and hid what was actually tappable.
- **plain-screen-labels**: Screen-name labels are plain text, and mode toggles state what they switch between. *Why:* A heavy preview banner looked ugly and an unclear toggle confused users.
- **never-red-for-success**: Never use red for a success state. *Why:* A success state in red read as an error.
- **icon-only-secondary-on-narrow**: On narrow screens, collapse secondary header actions to labelled icons (accessible name, 44px target) before squeezing the title. *Why:* Short titles wrapped needlessly because secondary buttons took the space. *Check:* At 390px, does a short title fit on one line, and do icon-only buttons keep an accessible name and a 44px target?
- **selected-vs-primary-color**: Keep selected states visibly lighter than the primary action, and draw focus rings in the brand colour at 3:1 or more. *Why:* Selected options were mistaken for buttons, and old-accent rings looked like a different product. *Check:* Are selected states a tint, the primary action a fill, and focus rings brand-coloured at 3:1 or more?

## Copy and terminology

- **short-scannable-copy**: Keep UI copy extremely short and scannable. *Why:* Long labels were truncated or skipped, and users missed the point.
- **plain-localized-terms**: Use plain, recognizable terms, localized to each locale's natural word. *Why:* An invented label was not recognized; the standard term ('Table of contents') was.
- **no-ellipsis-truncation**: Never truncate text with an ellipsis; wrap, shorten copy or resize. *Why:* Cut-off labels hid meaning and looked broken.
- **header-title-wraps-to-own-row**: Let a header title wrap (a few lines at most) or move to its own full-width row; never cut it off. *Why:* People could not tell which page they were editing, and truncated titles looked broken. *Check:* At the narrowest supported width, is the full title readable in the header without an ellipsis?

## Guidance and discovery

- **hints-on-demand**: Keep hints off the main surface; put them behind an (i) or a one-time dismissible tip. *Why:* Permanent helper text cluttered the header and was ignored after the first visit.
- **announce-new-features-once**: Announce a new feature to all users, existing ones included, once, then never again. *Why:* Existing users never discovered a new gesture because only new sign-ups saw guidance.
- **distinct-coachmarks**: Make tour coachmarks visually distinct from the highlighted UI (dark bubble plus accent outline) with Back, swipe and progress dots. *Why:* Users confused the tour bubble with the real control and could not go back.
- **scoped-help-assistant**: An in-product help assistant answers only from the help content, cites the source page, links to screens instead of acting, and politely declines off-topic questions. *Why:* Off-topic answers and unsourced replies erode trust.

## Lists and editing

- **undoable-delete**: Delete immediately with an Undo toast, and offer Hide as a non-destructive alternative. *Why:* Users feared deleting and asked why it could not be undone and whether they could just hide it.
- **handle-only-reorder**: Use a drag handle alone for reorder; put Move up/down in the overflow menu. *Why:* Rows with three reorder affordances looked cluttered and redundant.
- **no-overlapping-inserters**: Do not put between-item inserter buttons where they overlap content; use one Add button and 'Add below' in the overflow. *Why:* The between-item '+' overlapped neighbouring items and kept drawing complaints.
- **tap-row-to-open**: Tapping a list row opens it; the row shows only its name and an overflow menu. *Why:* Per-row Edit buttons added noise without adding capability.
- **preserve-scroll-highlight**: After closing an editor, return to the same scroll position and briefly highlight the edited item. *Why:* Users lost their place after every edit.
- **full-focus-edit-mode**: Item edit mode is full focus; define a show/hide matrix of controls per mode. *Why:* Mixed global and local controls made editing mode feel unclear.
- **separate-preview-from-edit**: Separate an inline preview clearly from the edit list (Edit/Preview switch, framed and labelled preview). *Why:* Users saw the same images twice and could not tell preview from editor.
- **collapse-long-nav**: Long in-page navigation collapses ('Contents ▾', '+N more') instead of growing without limit. *Why:* Long tables of contents pushed content below the fold.

## Saving, settings and input

- **sticky-save-bar-when-dirty**: Manual-save screens use a sticky bottom Cancel/Save bar that appears only when there are changes, the same on every manual-save screen. *Why:* An always-on header Save made three heavy boxes and gave no sense of unsaved changes.
- **consistent-save-model**: Make the save model explicit per surface (auto-saved to draft vs live at once vs manual) and show a consistent indicator. *Why:* An audit found mixed save behaviours that users could not predict.
- **prevent-invalid-input**: Prevent invalid input by auto-adjusting (e.g. accent contrast) with Undo instead of showing an error. *Why:* Users hit a contrast error with no idea how to fix it.
- **separate-concepts**: Keep separate concepts in separate controls (publish status vs audience/visibility). *Why:* Users could not tell 'private' from 'not published'.
- **celebrate-publish**: Show publish success in clear green with a live message, Copy/Share actions and a small first-time celebration. *Why:* Users were unsure whether their page had gone live.
- **toast-never-covers-controls**: Show transient messages in their own reserved space (above a bottom bar, clear of the safe area), never on top of tappable controls. *Why:* A toast covered a button users were about to tap, so taps were missed or hit the toast. *Check:* While a toast is visible, is every control on screen still fully visible and tappable?

## Visual system, media and motion

- **design-system-fonts-everywhere**: Every dialog, sheet and toast uses design-system fonts. *Why:* A confirm sheet showed an unfamiliar font and users doubted the design system.
- **real-media-thumbnails**: Media embeds show the real thumbnail with a play overlay. *Why:* Placeholder embeds made pages look broken and unfamiliar.
- **distinct-motion-styles**: Offer motion styles only if each is visibly distinct, with a live mini preview per style. *Why:* Near-identical presets were rejected; users wanted clearly different reveal styles.
- **motion-accessibility**: Reduced-motion users get no motion; long body text uses only a soft fade; any input finishes the reveal; animate only transform, opacity, clip-path and filter. *Why:* Effects on long text hurt readability and performance.
- **decorative-motion-once**: Play decorative motion (a sheen, a shimmer) once on load and once per press, never on a loop, and not at all under reduced motion. *Why:* Looping decoration distracted from content and ignored people who asked for less motion. *Check:* Does every decorative animation have a finite iteration count and a prefers-reduced-motion off switch?
- **clean-build-before-deploy**: Clear the build cache before a production build when design tokens or global CSS changed, then verify the deployed CSS. *Why:* A stale cache shipped old colours even though the source had changed. *Check:* Was the build cache cleared, and does the deployed CSS contain the new token values?

## Flows, payments, privacy and engineering

- **external-setup-roundtrip**: Before sending users to an external setup step mid-flow (e.g. payment onboarding), auto-save, deep-link straight to the setup screen, and return them to the exact item they left. *Avoid:* Leaving through a generic settings/profile page and showing 'Leave without saving?' after the work was already saved. *Why:* A saved draft plus a detour and a false unsaved-changes warning made the flow feel broken. *Check:* After finishing external setup, is the user back on the same item with no unsaved warning? *See also:* consistent-save-model, preserve-scroll-highlight
- **single-status-location**: Show each status (progress, sync, error) in exactly one place on a screen. *Avoid:* The same upload progress rendered in a row and again in a banner or toast. *Why:* Duplicate progress indicators confused users about whether two uploads were running. *Check:* Is any state shown twice on the same screen?
- **migration-numbers-by-merge-order**: When several branches add database migrations in parallel, assign migration numbers by planned merge order before review ends, and ship each migration to every environment's database. *Avoid:* Each branch picking the next free number on its own and assuming production migrates itself. *Why:* Three changes claimed the same migration number, and one never got its production migration. *Check:* Is there a merge-order table with unique numbers, and a migration applied for every database? *See also:* clean-build-before-deploy
- **offline-payment-holds-expire**: Seats or stock held for manual/offline payment need an expiry, an organizer cancel action, and a per-buyer cap. *Avoid:* Unpaid holds that count against capacity indefinitely. *Why:* Unpaid holds blocked capacity forever and real buyers were turned away. *Check:* Do holds have an expiry, an organizer cancel, and a per-buyer cap? *See also:* catalog/payments.yaml
- **money-summary-integrity**: Money summaries subtract refunds once, exclude cancelled/expired orders from gross, store the processor's real fees, and label anything estimated. *Avoid:* Subtracting a refund from gross and again from net, or computing fees from a formula and showing them as fact. *Why:* A fully refunded order showed a negative net amount. *Check:* Does a fully refunded order show exactly $0 net, with estimates labelled? *See also:* catalog/payments.yaml
- **public-support-address-not-home**: A public-facing support/business address must never default to the user's home address; warn that it is public and suggest a virtual or business address. *Avoid:* Prefilling the account's personal address into a field buyers can see. *Why:* Onboarding exposed a home address to buyers without the user realising. *Check:* Does onboarding warn that the support address is public and offer alternatives? *See also:* catalog/payments.yaml
- **agreement-snapshot-and-retention**: For agreements accepted at checkout, snapshot the exact text plus a hash per order, collect the minimum personal data (no IP unless required), scrub personal data when the stated retention ends, and update the privacy policy in the same change. *Avoid:* Linking to a live, editable agreement, logging IPs by default, and keeping data past the stated retention. *Why:* Personal data was kept beyond the retention period the policy promised. *Check:* Is data cleared at expiry, and does the privacy policy match what is collected and kept? *See also:* catalog/cross_border.yaml
- **time-inputs-for-novices**: Date/time inputs offer a 12h/24h toggle, prefill End from Start, label optional fields consistently, and explain inline when blank means unlimited. *Avoid:* Bare time fields where End starts empty, optional markers vary, and blank's meaning is undocumented. *Why:* First-time users had to guess formats and what an empty field meant. *Check:* Can a first-time user fill every time field without guessing? *See also:* prevent-invalid-input
- **statement-descriptor-preflight**: Ask for the trading (DBA) name first and explain that the card statement descriptor must match the legal name or website before the processor validates it. *Avoid:* Letting users type any descriptor and surfacing the processor's rejection mid-setup. *Why:* Setup failed with an unexplained processor rejection error. *Check:* Does setup explain the descriptor rule before any error can occur? *See also:* catalog/payments.yaml
- **server-auth-redirect**: Redirect signed-out visitors from protected pages on the server with an HTTP 302 before any HTML is sent; the client check is only a fallback that shows nothing protected. *Avoid:* Serving the page, then checking the session in client script and redirecting. *Why:* The protected layout flashed before the redirect, which looked broken and briefly exposed private UI. *Check:* With no session, does a protected URL return a 302 to sign-in (safe same-origin return path) before any content loads? *See also:* single-status-location
- **one-toast-region**: Every global status message goes through one shared toast in one fixed place; only field-level errors stay next to their field. *Avoid:* Each screen writing its own status text into its own inline spot. *Why:* Messages appeared in many places, so people missed them and screen readers announced them inconsistently. *See also:* single-status-location, toast-never-covers-controls
  - *Check:* Is there exactly one toast component for global status messages?
  - *Check:* Do success and info messages use a polite live region?
  - *Check:* Do errors use an assertive live region?
  - *Check:* Can every error toast be dismissed with a labelled button?
  - *Check:* Is there no toast motion under prefers-reduced-motion?
  - *Check:* Errors are never pushed out by the cap; they merge with a count.

## Internationalization (i18n)

- **i18n-message-keys-day-one**: Products that may go multilingual must put all UI text behind message keys from day one and ban hardcoded strings via lint/CI. *Avoid:* Writing English UI strings directly in components and planning to 'translate later'. *Why:* Retrofitting hardcoded strings into translation files later is a large, error-prone sweep across every screen. *Check:* Does lint/CI fail on a hardcoded UI string, and is every visible string read from a message key? *See also:* elements/stack_comparisons.yaml (i18n), first phase gate `gate.i18n_keys`
- **i18n-icu-plurals**: Plurals, gender and selects live in ICU MessageFormat, not if/else in code. *Why:* Many languages have more than two plural forms. *Check:* Is every count-dependent string an ICU plural?
- **i18n-intl-formatting**: Dates, numbers, currency and relative times go through Intl with the active locale. *Why:* Order, separators and currency position differ per locale. *Check:* Is anything formatted by hand?
- **i18n-no-concatenation**: One message with named placeholders, never concatenated fragments. *Why:* Word order differs by language. *Check:* Is any sentence built from several pieces?
- **i18n-text-expansion**: Layouts tolerate ~30-40% longer text (short labels more) and wrapping. *Why:* Translations are often 30%+ longer and break fixed widths. *Check:* Does every screen survive a 40%-longer pseudo-locale?
- **i18n-cjk-fonts-line-breaking**: Per-locale CJK font stacks, `lang` attribute, and line-break rules; check by eye. *Why:* Wrong regional glyphs and bad breaks before punctuation. *Check:* Has each CJK locale been checked by eye?
- **i18n-locale-fallback**: A fallback chain and default locale; never show raw keys. *Why:* Keys ship before translations. *Check:* Does a missing translation show the fallback language?
- **i18n-key-naming**: Keys by feature and meaning (`checkout.payButton`), with translator descriptions. *Why:* Text-as-key breaks on copy edits; shared keys force one translation. *Check:* Are keys namespaced, unique in meaning and described?
- **i18n-ci-completeness**: CI fails on missing keys, unused keys or invalid ICU in shipped locales. *Why:* Only automation keeps locales in sync. *Check:* Does CI block a release with a missing key?
- **i18n-pseudo-localization**: A pseudo-locale (accented, longer, bracketed) in dev/QA from day one. *Why:* Finds hardcoded strings, concatenation and overflow at zero cost. *Check:* Has every screen been viewed in the pseudo-locale?
