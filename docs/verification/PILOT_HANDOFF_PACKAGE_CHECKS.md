# Pilot Handoff Package Checks

Use this checklist after pulling the latest `legacy-source-import` branch locally.

## Local Commands

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git restore apps/web/next-env.d.ts
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

## Browser Route

Open:

- `http://127.0.0.1:3000/teacher/intake`

## Expected Result

- The page shows a `Pilot handoff package` panel below the pilot readiness gate.
- The panel shows the recommended pilot window and recommended deployment path.
- The panel lists partner-facing routes including `/partner-demo`, `/enter/sample-publisher`, `/launch/partner-demo-unit-1`, `/speak/partner-demo-unit-1`, and `/teacher/sessions/partner-demo-unit-1`.
- The panel separates ready assets, review-needed assets, and blocked report/storage work.
- The panel names human decision owners: Codex, tenant, school, or shared.
- The panel keeps AI Tutor optional and premium, not part of the core pilot promise.
- The panel does not imply production persistence, student accounts, or export readiness.

## Regression Guard

Do not use the pilot handoff package to overpromise. It should make blockers more visible, not hide them.
