// Single source of truth for the intro's timing.
// Used by the animation (src/intro.js), and by render/gen-meta.cjs to write
// ../timing.json and ../captions.en.vtt, so video, captions and narration stay in sync.
(function (root) {
  const TIMELINE = {
    fps: 30,
    width: 1920,
    height: 1080,
    duration: 86,
    beats: [
      { id: 'pain', n: 1, title: 'Pain', start: 0, end: 16 },
      { id: 'what', n: 2, title: 'What Blueprint is', start: 16, end: 29 },
      { id: 'how', n: 3, title: 'How it works', start: 29, end: 45 },
      { id: 'features', n: 4, title: 'Features', start: 45, end: 72 },
      { id: 'close', n: 5, title: 'Close', start: 72, end: 86 },
    ],
    // Narration lines. start/end are when the voice should speak the line.
    // `shot` says what the picture shows at that moment.
    cues: [
      { beat: 'pain', start: 0.6, end: 3.2, text: 'AI can build a screen in minutes.', shot: 'A prompt is typed; a subscribe screen assembles itself.' },
      { beat: 'pain', start: 3.4, end: 7.5, text: 'Then, six weeks in, a store rule says your checkout must change.', shot: 'A week timeline runs to week 6; a store-review notice strikes the Subscribe button.' },
      { beat: 'pain', start: 7.7, end: 11.9, text: 'Money, rules, what depends on what: none of it was visible.', shot: 'Hidden categories fade in around the screen: brand, money, rules, tech, ethics, launch.' },
      { beat: 'pain', start: 12.2, end: 13.5, text: "I wish I'd known.", shot: 'Hold. Slow push in.' },
      { beat: 'pain', start: 13.8, end: 15.6, text: 'Now you start over.', shot: 'The timeline rewinds to week 1; the screen un-builds.' },
      { beat: 'what', start: 16.4, end: 20.6, text: 'Blueprint is a map of your whole project, before you build.', shot: 'The screen collapses into one node; the hidden categories become columns; the whole map appears.' },
      { beat: 'what', start: 20.8, end: 25.4, text: 'Every decision sits in its column: brand, screens, tech, money, rules, launch.', shot: 'Dependency lines draw in; each named column lights up as it is said.' },
      { beat: 'what', start: 25.7, end: 28.6, text: 'One look, and you see it all.', shot: 'The full map, calm drift.' },
      { beat: 'how', start: 29.2, end: 34.0, text: 'Tap a decision. You get the options, one recommended pick, and the reason why.', shot: 'Zoom to Money. Tap "Taking money"; the decision panel opens with options, pick and reason.' },
      { beat: 'how', start: 34.3, end: 37.3, text: 'Compare it with the alternative we set aside.', shot: 'Tap Compare; the set-aside option slides in beside the pick.' },
      { beat: 'how', start: 37.6, end: 40.4, text: 'See what else changes if you switch.', shot: 'Dependent decisions light up on the map and in the panel.' },
      { beat: 'how', start: 40.7, end: 43.4, text: 'When it looks right, you approve it.', shot: 'Tap Approve; the node turns orange: decided by you.' },
      { beat: 'features', start: 45.4, end: 48.3, text: 'Add categories as your project grows.', shot: 'A new Accessibility column slides in and connects.' },
      { beat: 'features', start: 48.6, end: 53.1, text: 'Lines show real dependencies, so you see what breaks before it breaks.', shot: 'Hover "Where data lives"; the ripple of dependent decisions traces in orange.' },
      { beat: 'features', start: 53.4, end: 58.4, text: 'Lessons from real projects return as foresight: surprises others already hit.', shot: 'A foresight note attaches to App-store rules and links back to Taking money.' },
      { beat: 'features', start: 58.7, end: 62.7, text: 'AI proposes. Nothing is final until a person says yes.', shot: 'Operations nodes fill as AI picks (white); one is approved (orange). Legend shown.' },
      { beat: 'features', start: 62.9, end: 67.6, text: 'And AI coding tools like Claude Code, Cursor and Codex read the same map,', shot: 'Three tools connect to the local Blueprint MCP server; tool calls appear.' },
      { beat: 'features', start: 67.8, end: 71.4, text: 'through a local MCP server or a YAML export.', shot: 'The pane switches to the exported project-map.yaml with the decision.' },
      { beat: 'close', start: 72.6, end: 75.6, text: 'See the whole project before you build.', shot: 'The map settles back, dimmed; the Blueprint mark appears.' },
      { beat: 'close', start: 76.2, end: 78.4, text: 'Join the early prototype.', shot: 'A "Join the early prototype" button appears.' },
      { beat: 'close', start: 79.0, end: 81.8, text: 'Creativity Is Everywhere, LLC.', shot: 'Company name in small mono type. Hold, then fade.' },
    ],
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = TIMELINE;
  else root.BP_TIMELINE = TIMELINE;
})(typeof window !== 'undefined' ? window : globalThis);
