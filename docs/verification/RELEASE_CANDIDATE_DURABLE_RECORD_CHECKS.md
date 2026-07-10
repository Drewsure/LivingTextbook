# Release Candidate Durable Record Checks

Run after release-control, persistence, backend schema, or adapter changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/teacher/intake` loads.
- Persistence boundary shows a package release candidate record.
- Durable record map includes `package-release-candidate`.
- Hosted adapter write intents include package release candidate status.
- Local adapter write intents include package release candidate status.
- Backend schema draft includes `package_release_candidate`.
- Release candidate status is described as derived from gate and ledger state, not manually toggled.

