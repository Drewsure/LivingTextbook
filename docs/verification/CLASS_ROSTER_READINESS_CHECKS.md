# Class Roster Readiness Checks

Use this focused checklist after pulling the latest `legacy-source-import` branch locally.

## Local Commands

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git restore apps/web/next-env.d.ts
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

## Browser Routes

Open:

- `http://127.0.0.1:3000/teacher/intake`

## Expected Result

- The page shows a `Class roster identity boundary` panel.
- The panel lists MiniStar, sample publisher, and closed local classroom roster plans.
- The panel shows learner slots using codes rather than real learner names.
- The panel shows that raw audio and transcripts are not stored as roster fields.
- The panel separates validation errors from open warnings.
- The panel makes clear that durable reports require persistence and policy decisions.

## Regression Guard

Do not mark a roster as pilot-ready if it stores real names, family contacts, raw audio, or transcripts without a documented policy and persistence decision.
