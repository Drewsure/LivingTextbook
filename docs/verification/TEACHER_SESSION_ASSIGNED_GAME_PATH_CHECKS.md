# Teacher Session Assigned Game Path Checks

Run after syncing `legacy-source-import`.

```powershell
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

Then verify:

- `http://127.0.0.1:3000/teacher/sessions/demo-unit-1` loads.
- `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1` loads.
- The monitor shows an assigned game path panel.
- The assigned path includes Flashcards, Match Up, Memory Match, Balloon Pop, Quiz, Sentence Builder, and Speak It.
- The panel remains separate from event completion and report export readiness.
