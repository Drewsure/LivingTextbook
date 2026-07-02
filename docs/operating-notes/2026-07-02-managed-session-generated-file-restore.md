# Operating Note: Managed Session Cannot Restore Generated Next File

Date: 2026-07-02

## Symptom

In a managed Codex session, `apps/web/next-env.d.ts` may be modified by local Next.js type generation. When connector-side commits are waiting on `legacy-source-import`, a normal pull may be blocked until this generated file is restored.

The managed session may reject `git restore apps/web/next-env.d.ts`, even though the file is only generated local noise.

## Workaround

When the local checkout needs to catch up, the human-side terminal can run:

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git restore apps/web/next-env.d.ts
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

Then start the dev server if needed:

```powershell
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

## Build Rule

Do not commit `apps/web/next-env.d.ts` as part of feature work. Treat it as local generated output unless a Next.js upgrade intentionally changes the file and a local build confirms the change is required.
