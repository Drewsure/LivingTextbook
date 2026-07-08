# Operating Note: Stale Local Origin After Connector Commits

Date: 2026-07-09

## Observed Behavior

The GitHub connector showed newer files on `legacy-source-import`, including:

- `apps/web/src/data/sampleUnitGameOfferMap.ts`
- `apps/web/src/app/q/[...segments]/page.tsx`
- updated `/teacher/intake` imports

The local checkout still reported:

```powershell
## legacy-source-import...origin/legacy-source-import
 M apps/web/next-env.d.ts
```

and local `git log --oneline -5 --decorate` showed `origin/legacy-source-import` at an older commit:

```text
b6bac65 (HEAD -> legacy-source-import, origin/legacy-source-import) docs: add decision-register file index
```

The local app route list also did not include `/q/[...segments]`, proving the local checkout had not received the newer connector commits.

## Safe Recovery Procedure

Run an explicit fetch before pull:

```powershell
Set-Location -LiteralPath "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git fetch origin legacy-source-import
git restore apps/web/next-env.d.ts
git pull --ff-only
```

Then verify the expected newer files exist:

```powershell
Get-ChildItem -LiteralPath "apps\web\src\app\q" -Recurse
Get-ChildItem -LiteralPath "apps\web\src\features\game-offers" -Recurse
```

Then run:

```powershell
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

## Why This Matters

`git pull --ff-only` can appear to do nothing if the local remote-tracking reference is stale or the previous fetch did not update as expected. Future verification should include `git fetch origin legacy-source-import` before the pull whenever connector-side commits are expected.

Do not mark connector-side changes as locally verified until route output includes expected new routes and browser checks show the expected panels.
