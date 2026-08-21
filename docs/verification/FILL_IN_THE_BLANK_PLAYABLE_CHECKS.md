# Fill in the Blank Playable Checks

Run after text-spelling, syntax construction, audio cue, route, package readiness, activity pathway, local bundle, assignment, or active route verification changes.

Checks:
- `http://127.0.0.1:3000/fill/demo-unit-1` loads.
- `http://127.0.0.1:3000/fill/partner-demo-unit-1` loads.
- The route shows `Fill in the Blank Progress`.
- The route uses the `text-spelling` parent engine and `syntax-construction-v1` scoring.
- Instructions, sentence prompt, answer choices, feedback, replay, and submit controls remain tap-to-speak.
- Correct target-language answers are the only completion trigger.
- Support-language text or audio cannot complete a round, unlock a game, or award Star Dust.
- The completion card offers the reviewed next activity path and the activity hub.
- Both sample packages include `fill-in-the-blank` audio cue coverage.
- The active route matrix shows 81 checked routes.

Verification command:

```powershell
npm run verify:foundation
```
