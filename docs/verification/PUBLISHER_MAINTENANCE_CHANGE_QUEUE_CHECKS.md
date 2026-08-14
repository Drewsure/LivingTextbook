# Publisher Maintenance Change Queue Checks

Run after publisher maintenance, route registry, media rights, game offer map, report export, or release-control changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/teacher/intake` loads.
- The page shows `Maintenance change queue`.
- The page shows `Maintenance guard active`, `Maintenance guard blocks`, and `Maintenance guard warnings`.
- The queue includes at least one media replacement request.
- The queue includes at least one game availability request.
- The queue includes at least one QR alias update request.
- Each request shows route impact, media impact, game impact, report impact, approvals, blockers, and next action.
- Blocked QR changes do not look release-ready.
- Shared validation rejects redirect changes unless they remain blocked until rollback and notice rules are reviewed.
