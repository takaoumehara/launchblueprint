# Annotation-to-fix (optional example)

Convert review annotations into structured JSON before passing them to an agent. Rule: `ui_ux.annotation-to-fix`.

```json
{
  "global_direction": "Quieter header; only one strong fill per screen.",
  "annotations": [
    {
      "location": { "file": "src/components/Header.tsx", "component": "Header" },
      "instruction": "Change the secondary 'Share' button from solid fill to icon-only with an accessible name.",
      "rule_ids": ["primary-action-color", "icon-only-secondary-on-narrow"],
      "states": ["mobile-390", "dark"]
    }
  ],
  "after_fix": "If the fix reveals a missing token or component, update the component map (propose_learning kind=component_map_update)."
}
```
