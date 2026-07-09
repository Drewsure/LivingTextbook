# Quiz Selection Playable Checks

Run after syncing `legacy-source-import`.

```powershell
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

Then verify:

- `http://127.0.0.1:3000/quiz/demo-unit-1` loads.
- `http://127.0.0.1:3000/quiz/partner-demo-unit-1` loads.
- Each prompt and answer option can be tapped to hear English.
- The Submit answer control has its own listen/replay control.
- Submitting an answer records `answer_submitted` and `answer_result`.
- Completing all rounds updates the local progress summary.
- The unit game offer map on `http://127.0.0.1:3000/teacher/intake` lists Quiz as ready and optional.
- The route does not claim durable backend reporting or production assessment readiness.
