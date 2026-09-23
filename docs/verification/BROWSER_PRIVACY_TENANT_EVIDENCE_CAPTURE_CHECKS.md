# Browser, Privacy, and Tenant Evidence Capture Checks

Run the focused runtime check after changing local negative-evidence capture:

```powershell
npm run verify-browser-privacy-tenant-evidence-runtime
```

Confirm:

- A teacher action is required before privacy-negative or tenant-isolation
  lanes can pass.
- The stored record preserves tenant, package, launch, unit, student-session,
  and observation identity.
- A malformed record, cross-tenant lookup, or promotion-drifted record is not
  returned as usable evidence.
- The record remains local and review-only; it cannot enable hosted writes,
  learner data collection, export, promotion, QR mutation, assignment, or
  classroom launch.
- Browser continuity remains separate from privacy and tenant proof.

The broader gate is:

```powershell
npm run verify:foundation
```

