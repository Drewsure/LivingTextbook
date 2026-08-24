# Build Session Note: Package Adoption Record Preview

Date: 2026-08-24

## Change

Added future package adoption record previews to `/teacher/entitlements`.

## Why

Premium package adoption needs durable accepted-record fields before any live toggle, billing, speech scoring, hosted storage, report export, or local companion activation can be designed.

## Guardrails

- No accepted records.
- No accepted terms.
- No billing entitlement write.
- No model-call enablement write.
- No microphone scoring enablement write.
- No report export enablement write.
- No local bundle activation write.

## Verification

Run:

```powershell
npm run verify:package-entitlements
npm run verify:routes
```

Then open:

- `http://127.0.0.1:3000/teacher/entitlements`
