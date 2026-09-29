# Shared Quarantine Package Identity Checks

## Purpose

Confirm all review-only upload APIs use the same deterministic default package
identity for a tenant and unit key.

## Checks

- Shared helper exists and preserves the `-package` suffix.
- Seven upload review/delivery routes import the helper.
- No route defines a private `derivePackageId` function.
- Explicit package ids remain route-bound and review-only.
- Package identity does not authorize assembly, promotion, QR printing,
  persistence, or student use.

## Command

```powershell
npm run verify:upload-quarantine-intake
```
