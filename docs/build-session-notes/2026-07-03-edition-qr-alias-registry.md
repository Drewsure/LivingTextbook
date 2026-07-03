# Build Session Note: Edition QR Alias Registry

Date: 2026-07-03

## Added

- `apps/web/src/data/sampleEditionQrAliasPlan.ts`
- `apps/web/src/features/routes/EditionQrAliasPanel.tsx`
- `/teacher/intake` integration
- `docs/EDITION_QR_ALIAS_CONTRACT.md`
- `docs/verification/EDITION_QR_ALIAS_CHECKS.md`
- `docs/decision-register/DR-042-edition-qr-alias-registry.md`
- `docs/adr/0042-edition-qr-alias-registry.md`

## Why

Printed textbook QR codes must remain stable across annual editions, package updates, hosted routes, and future local bundles. The alias registry makes that requirement visible before the full `/q/...` resolver exists.

## Verification Needed

The connector-side commit still needs local verification:

```powershell
Set-Location -LiteralPath "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git restore apps/web/next-env.d.ts
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

Then open `http://127.0.0.1:3000/teacher/intake` and review the `Edition QR aliases` panel.
