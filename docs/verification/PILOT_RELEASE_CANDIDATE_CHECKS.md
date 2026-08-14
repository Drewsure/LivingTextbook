# Pilot Release Candidate Checks

Run after publish-gate, approval-ledger, or release-control changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/teacher/intake` loads.
- `http://127.0.0.1:3000/teacher/release-control/sample-publisher` loads.
- The page shows `Pilot release candidate`.
- The summary says the candidate must not publish while release-blocking gates are open.
- The summary says required approvals must be signed before a live pilot.
- The panel does not imply a production publish button exists.
- The focused route shows `Release-control route workspace`, `Pilot release decision room`, `Release source routes`, and `Blocked release actions`.
- The focused route shows `No live publish workflow`, `No publish button`, `No release-state mutation`, `No assignment activation`, `No local bundle release`, `No student-ready marker`, and `No support-language-only release`.
