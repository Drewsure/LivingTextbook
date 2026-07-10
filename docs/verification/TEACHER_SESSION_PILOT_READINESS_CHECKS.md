# Teacher Session Pilot Readiness Checks

Run after teacher session monitor, preflight, report policy, or persistence changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/teacher/sessions/demo-unit-1` loads.
- `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1` loads.
- Both pages show `Session pilot readiness`.
- Demo-safe signals are separate from pilot blockers.
- Live-use requirements include persisted teacher settings, accepted reporting policy, event storage, and mobile verification.
- The snapshot does not imply demo monitoring is live classroom reporting.

