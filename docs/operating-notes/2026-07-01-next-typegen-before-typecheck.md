# Operating Note: Next Type Generation Before Typecheck

Date: 2026-07-01

## Context

After Next.js generated route type references in `apps/web/next-env.d.ts`, running `tsc --noEmit` before generated `.next/types` existed produced missing-file errors.

## Workaround

The web app `typecheck` script now runs:

```powershell
next typegen && tsc --noEmit
```

Use:

```powershell
npm run typecheck --workspace @living-textbook/web
```

Do not run standalone `tsc --noEmit` in a clean checkout unless route types have already been generated.

## Build Rule

Run checks sequentially when validating the app:

```powershell
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

Do not run typecheck and build in parallel until generated-type behavior is intentionally revisited.
