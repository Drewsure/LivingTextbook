# 2026-07-17: Next Route Typegen Sequential Run

## Observation

Running `npm run typecheck --workspace @living-textbook/web` and `npm run build --workspace @living-textbook/web` at the same time can create a temporary Next route type race. TypeScript may report missing files under `apps/web/.next/types/app/...` because one process is reading generated route types while the other process is regenerating or replacing them.

## Procedure

Run these commands sequentially:

```powershell
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

If a route-type `TS6053` error appears after a parallel run, rerun typecheck after the build finishes. Treat a repeated sequential failure as real, but treat the one-time parallel race as an operating error rather than a code failure.
