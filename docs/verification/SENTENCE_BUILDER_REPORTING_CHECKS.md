# Sentence Builder Reporting Checks

Run these checks after syncing `legacy-source-import`.

```powershell
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

Then verify:

- `http://127.0.0.1:3000/teacher/sessions/demo-unit-1` loads.
- `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1` loads.
- The teacher session event stream includes `sentence-builder`.
- Sentence Builder appears as a completed progression activity in the sample monitor data.
- The event metadata identifies the text-spelling parent engine.
- No teacher report claims live backend persistence or export readiness from this slice alone.
