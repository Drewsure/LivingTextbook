# Pilot QR Alias Registry Preview Checks

## Purpose

Confirm the publisher handoff carries one tenant/package/version-bound QR alias
registry preview before any production QR print workflow exists.

## Checks

- Registry entries come from the package QR preview set.
- Manifest and release receipt identities are carried into the registry preview.
- Alias ids, printed QR ids, and alias paths are unique.
- Alias and fallback paths are safe internal routes.
- Every entry remains tenant, package, and version bound.
- Durable persistence, rollback evidence, route mutation, production print, and
  student activation remain blocked.

## Command

```powershell
node scripts/verify-qr-alias-preview-integration.mjs
```
