# Type Answer Playable Checks

Run after text-spelling, vocabulary typing, audio cue, route, package readiness, or assignment changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/type-answer/demo-unit-1` loads.
- `http://127.0.0.1:3000/type-answer/partner-demo-unit-1` loads.
- The page shows `Core typing slice`, `Type Answer`, `Text-spelling`, and `Type Answer Progress`.
- The instruction, prompt listen control, input label, feedback, and submit control are audio-supported.
- Correct typed vocabulary answers emit standard `answer_submitted`, `answer_result`, `game_completed`, and `mastery_updated` events.
- Support language cannot unlock progress or substitute for the English target-language typing attempt.
- Scoring is deterministic and uses no random rewards.
