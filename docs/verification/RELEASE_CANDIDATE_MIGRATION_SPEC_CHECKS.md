# Release Candidate Migration Spec Checks

Run after backend migration candidate or migration spec changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/teacher/intake` loads.
- Backend migration candidates include release candidate status with publish gate and approval ledger records.
- Backend migration specs include `Package release candidate status`.
- The spec includes `open_gate_count`, `open_approval_count`, and `pilot_ready`.
- The spec forbids manual pilot-ready override.
- Local fallback stores release candidate status beside publish gates and approval ledgers.

