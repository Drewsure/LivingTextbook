# Partner Pilot Readiness Verification

Use this checklist when reviewing the white-label pilot surface.

## Full Test Address

[http://127.0.0.1:3000/](http://127.0.0.1:3000/)

## Dashboard Checks

1. Open `http://127.0.0.1:3000/`.
2. Confirm the dashboard includes `White-label pilot readiness`.
3. Confirm the recommended partner promise says `8-12 weeks`.
4. Confirm the panel separates `Ready`, `In progress`, and `Needs decision`.
5. Confirm blocked items are phrased as decisions/work still needed, not as finished product promises.

## Product Checks

1. Confirm the panel references tenant shell, QR/front-door entry, core games, multimedia, teacher reporting, PDF intake, and closed/local deployment.
2. Confirm MiniStar is presented as the current proof tenant, not the only possible tenant.
3. Confirm commercial readiness is later than the pilot window.
4. Confirm the first pilot scope remains narrow enough to build and verify.

## Workflow Note

Run Next type generation before standalone TypeScript checks:

```powershell
npm run typecheck --workspace @living-textbook/web
```

The `typecheck` script should run `next typegen` before `tsc --noEmit` so generated route types do not create order-dependent failures.
