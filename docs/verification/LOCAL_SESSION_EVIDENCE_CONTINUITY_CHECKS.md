# Local Session Evidence Continuity Checks

These checks protect the browser-rehearsal evidence lane for the first
production-shaped white-label slice.

- `LocalSessionEvidence` includes a package identity and versioned schema.
- Flashcards contributes route events through `appendLocalSessionEvidence`.
- The shared playable game shell contributes route events through the same
  helper for Memory Match, Sentence Builder, and other canonical modes.
- Events are cumulative across routes, exact duplicates are removed, and the
  first-seen order is preserved.
- Package, tenant, unit, launch, or student-session mismatch rejects the
  append.
- The browser-only storage mode remains explicit.
- No raw learner audio, transcript, support-language-only evidence, hosted
  write, export, or live reporting path is enabled.
- Local evidence failure is visible and does not unlock a route or award
  mastery.

Run:

```powershell
npm run verify:vertical-slice
```

The broader foundation command must also pass before this slice is considered
verified:

```powershell
npm run verify:foundation
```
