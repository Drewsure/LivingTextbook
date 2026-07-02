# Build Session Note: Publisher Maintenance Contract

Date: 2026-07-03

## Added

- `apps/web/src/data/samplePublisherMaintenancePlan.ts`
- `apps/web/src/features/publisher/PublisherMaintenancePlanPanel.tsx`
- `/teacher/intake` integration
- `docs/PUBLISHER_MAINTENANCE_CONTRACT.md`
- `docs/verification/PUBLISHER_MAINTENANCE_CHECKS.md`
- `docs/decision-register/DR-040-publisher-maintenance-contract.md`
- `docs/adr/0040-publisher-maintenance-contract.md`

## Why

A white-label partner may need to maintain textbook-linked music, video, game offerings, QR routes, and teacher reports year after year. That requirement changes the foundation architecture, so it now appears as a first-class admin contract.

## Verification Needed

The connector-side commit still needs local verification:

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git restore apps/web/next-env.d.ts
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

Then open `http://127.0.0.1:3000/teacher/intake` and review the `Publisher maintenance` panel.
