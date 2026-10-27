# UI/UX learnings (v1)

Generic rules learned while iterating on a mobile-first page editor (Oct 2026). Each rule maps to an entry in `catalog/ui_ux.yaml`; use the yes/no `check` in requirements, design and QA gates.

## Emphasis and hierarchy

- **primary-action-color**: Reserve the strongest colour (solid black or brand fill) for the single primary action on a screen. *Why:* Users' eyes were pulled between the main action and selected options, so the main action stopped standing out.
- **selected-state-tint**: Show selected states with a light accent tint plus a thin ring, not a solid fill. *Why:* A solid selected option looked like a second primary action.
- **borders-only-on-pressables**: Use boxes and borders only for pressable buttons; use plain text links elsewhere. *Why:* Too many framed boxes made the header feel busy and hid what was actually tappable.
- **plain-screen-labels**: Screen-name labels are plain text, and mode toggles state what they switch between. *Why:* A heavy preview banner looked ugly and an unclear toggle confused users.
- **never-red-for-success**: Never use red for a success state. *Why:* A success state in red read as an error.

## Copy and terminology

- **short-scannable-copy**: Keep UI copy extremely short and scannable. *Why:* Long labels were truncated or skipped, and users missed the point.
- **plain-localized-terms**: Use plain, recognizable terms, localized to each locale's natural word. *Why:* An invented label was not recognized; the standard term ('Table of contents') was.
- **no-ellipsis-truncation**: Never truncate text with an ellipsis; wrap, shorten copy or resize. *Why:* Cut-off labels hid meaning and looked broken.

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

## Visual system, media and motion

- **design-system-fonts-everywhere**: Every dialog, sheet and toast uses design-system fonts. *Why:* A confirm sheet showed an unfamiliar font and users doubted the design system.
- **real-media-thumbnails**: Media embeds show the real thumbnail with a play overlay. *Why:* Placeholder embeds made pages look broken and unfamiliar.
- **distinct-motion-styles**: Offer motion styles only if each is visibly distinct, with a live mini preview per style. *Why:* Near-identical presets were rejected; users wanted clearly different reveal styles.
- **motion-accessibility**: Reduced-motion users get no motion; long body text uses only a soft fade; any input finishes the reveal; animate only transform, opacity, clip-path and filter. *Why:* Effects on long text hurt readability and performance.
