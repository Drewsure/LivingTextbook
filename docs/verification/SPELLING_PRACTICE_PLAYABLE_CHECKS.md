# Spelling Practice Playable Checks

Run after text-spelling, spelling, audio cue, route, package readiness, activity pathway, local bundle, assignment, or active route verification changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/spelling/demo-unit-1` loads.
- `http://127.0.0.1:3000/spelling/partner-demo-unit-1` loads.
- The page shows `Core spelling slice`, `Spelling Practice`, `Text-spelling`, and `Spelling Practice Progress`.
- The instruction, prompt listen control, letter tiles, remove controls, feedback, and submit control are audio-supported.
- Letter ordering is deterministic for the same unit payload and does not use random reward logic.
- Correct target-language spelling attempts emit standard `answer_submitted`, `answer_result`, `game_completed`, and `mastery_updated` events.
- Support language cannot unlock progress, complete the route, or substitute for the English target-language spelling attempt.
- The route is listed in the curated student activity hub and the active route matrix for both tenant samples.
