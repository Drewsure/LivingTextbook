# Backend Decision Matrix Checks

Use this checklist after pulling the latest `legacy-source-import` branch locally.

## Local Commands

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git restore apps/web/next-env.d.ts
Git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

If `Git pull` is copied with the wrong capitalization, PowerShell usually still accepts it, but use `git pull --ff-only` for consistency.

## Browser Route

Open:

- `http://127.0.0.1:3000/teacher/intake`

## Expected Result

- The page shows a `Backend decision matrix` panel before the persistence boundary detail.
- The panel recommends a hosted managed database pattern for the first real pilot without naming a final vendor.
- The panel compares static demo data, hosted relational database pattern, hosted document database pattern, local SQLite-style classroom package, and hybrid hosted registry plus local media bundle.
- The panel shows cost posture and deployment fit for each option.
- The panel names risks, required-before-pilot work, and not-allowed-yet boundaries.
- The panel keeps raw learner audio, transcripts, ungated exports, and AI Tutor storage out of the core pilot.

## Regression Guard

Do not choose a backend vendor from UI convenience alone. The first provider must satisfy route registry, reviewed content packages, teacher launch sessions, coded learner progress, report policy, white-label tenant boundaries, and future local/closed deployment compatibility.
