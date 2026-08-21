# Build Session Note: Package Entitlement Workbench Route

Date: 2026-08-22

## Change

Added `/teacher/entitlements` as a focused teacher/admin workbench for optional paid feature boundaries.

## Why

AI generation, Voice Tutor, microphone scoring, speech APIs, hosted storage, report export, and local companion mode are important white-label product levers, but they must not appear as automatic student features or unbounded cost centers.

## Guardrails

- No live model billing.
- No child-facing premium upsell.
- No package activation.
- No microphone permission prompt.
- No raw audio storage.
- No transcript storage.
- No report export.
- No storage or local folder write.

## Verification

Run:

```powershell
npm run verify:routes
```

Then open:

- `http://127.0.0.1:3000/teacher/entitlements`
