# Local Companion Release Gate Checks

## Scope

Use these checks when local companion package work changes route previews, manifests, media packaging, installer/update planning, local reporting, or school access rules.

## Required Checks

- Confirm `/local/sample-publisher` shows `Local release gate`.
- Confirm the gate decision says the sample package is previewable only, not ready for closed local handoff.
- Confirm media rights/checksums are blocked until real rights proof and checksums exist.
- Confirm installer/update is blocked until a local shell, update channel, rollback, and yearly edition migration plan exist.
- Confirm backup/restore/export is blocked until local persistence and teacher report export are designed.
- Confirm QR/deep-link fallback remains warning-level until device testing is complete.
- Confirm game audio/reporting coverage is represented as passed only for verified reusable engine routes.
- Confirm school access/privacy policy remains blocked until roster, device-sharing, privacy, and retention rules are approved.

## Verification Command

```powershell
npm run verify:foundation
```
