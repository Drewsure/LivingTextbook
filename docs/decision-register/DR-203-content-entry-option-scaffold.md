# DR-203: Content Entry Option Scaffold

## Decision

Add a foundation content-entry option scaffold to the teacher intake route.

## Rationale

The product needs teacher-friendly authoring controls similar to mature activity platforms, but live upload and authoring workflows are too risky before storage, rights, review, compatibility, audio, and release gates are stable.

## Implications

- `http://127.0.0.1:3000/teacher/intake` now shows the content-entry option scaffold.
- The scaffold includes `Pick a template`, `Enter content`, `Play`, `Activity title`, `+ Instruction`, `Generate With AI`, `Flip tiles`, `Single sided`, `Double sided`, `Front`, `Back`, `Audio cue`, `Image upload`, formatting tools, row actions, item limits, and `Done`.
- `Done` cannot route to students.
- AI generation, uploaded media, image activation, support-language progress, file picker writes, and unchecked template switching remain blocked.
- Future live authoring must preserve teacher draft package, upload intake/review/promotion, asset manifest, media manifest, and activity compatibility snapshot records.

## Next

Use this scaffold as the visible checklist before implementing the real teacher authoring workbench or live upload controls.
