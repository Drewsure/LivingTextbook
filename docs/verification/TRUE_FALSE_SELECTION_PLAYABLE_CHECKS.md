# True Or False Selection Playable Checks

Run after selection-engine, activity-pathway, audio-cue, assignment, or active route changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/true-false/demo-unit-1` loads.
- `http://127.0.0.1:3000/true-false/partner-demo-unit-1` loads.
- The route shows `Core true/false selection slice`, `True or False Progress`, and `Selection`.
- The instruction is target-language audio-supported.
- The visible card is tap-to-hear.
- True/False decisions emit the standard selection event shape and deterministic mastery update.
- Support language and media remain support-only and cannot unlock progress.
