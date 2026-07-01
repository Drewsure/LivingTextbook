# Operating Note: Generated `next-env.d.ts` Pull Conflict

Date: 2026-07-01

## Context

Running Next.js locally can update `apps/web/next-env.d.ts`. If the same generated change is also committed remotely, `git pull --ff-only` can abort with:

```text
Your local changes to the following files would be overwritten by merge:
  apps/web/next-env.d.ts
```

This is Git protecting local changes. It is not a broken build.

## Recovery

Stop the dev server, then run:

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git restore apps/web/next-env.d.ts
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

## Workflow Note

When PowerShell receives several commands at once, later commands may still run even after `git pull` aborts. If pull fails, any following typecheck/build results are from the old local checkout, not the newly pulled branch.

## Prevention

The web workspace typecheck script now runs `next typegen && tsc --noEmit`, which should reduce clean-checkout generated-type problems. Generated files can still be touched by local Next runs, so this operating note remains useful.
