# Teacher Report Package Preview Route Checks

Run after teacher session, reporting, route, event taxonomy, or export changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/teacher/sessions/demo-unit-1/report-package` loads.
- `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1/report-package` loads.
- Both routes show `Report package preview`.
- Both routes show `Export blocked`.
- Sanitized rows show event effects for learning evidence, support-only, and session context.
- Support-only signals remain separate from learning evidence.
- Raw media/audio is shown as excluded.
- Session monitor pages link to the preview route.
