# 2026-07-01: Local Bundle Manifest Panel

Status: connector-side implementation complete; local typecheck/build still required after pull.

## Scope

Added a visible local/offline bundle planning surface to the teacher intake route.

Implemented:

- `sampleLocalBundlePlan.ts` with MiniStar and sample-publisher bundle manifest summaries.
- `LocalBundleManifestPanel.tsx` for closed textbook companion package visibility.
- `/teacher/intake` integration.
- Route contract update for `LocalBundleManifestSummary[]`.
- Deployment verification updates.

## Verification Route

- `http://127.0.0.1:3000/teacher/intake`

## Why It Matters

This supports the white-label/publisher scenario where a partner needs yearly media, video, audio, game, and QR updates in a reliable package shape. It keeps local/offline support in the initial product architecture rather than bolting it on later.

## Human Pull Commands

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git restore apps/web/next-env.d.ts
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```
