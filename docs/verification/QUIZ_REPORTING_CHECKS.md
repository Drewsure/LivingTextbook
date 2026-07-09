# Quiz Reporting Checks

Run after syncing `legacy-source-import`.

```powershell
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

Then verify:

- `http://127.0.0.1:3000/teacher/sessions/demo-unit-1` loads.
- `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1` loads.
- The event stream includes `quiz`.
- Quiz metadata identifies the selection parent engine.
- The sample reward total displays as 1,000 Star Dust.
- The route does not imply production analytics, stored grades, or export readiness.
