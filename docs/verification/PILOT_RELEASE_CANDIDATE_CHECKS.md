# Pilot Release Candidate Checks

Run after publish-gate, approval-ledger, or release-control changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/teacher/intake` loads.
- The page shows `Pilot release candidate`.
- The summary says the candidate must not publish while release-blocking gates are open.
- The summary says required approvals must be signed before a live pilot.
- The panel does not imply a production publish button exists.

