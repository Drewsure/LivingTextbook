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
- `http://127.0.0.1:3000/teacher/sessions/demo-unit-1`
- `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1`
- `http://127.0.0.1:3000/enter/ministar`
- `http://127.0.0.1:3000/enter/sample-publisher`

## Expected Result

- The intake page shows a `Class roster identity boundary` panel.
- The intake panel lists MiniStar, sample publisher, and closed local classroom roster plans.
- Teacher session routes show a `Roster identity` card before the monitor details.
- Teacher report previews show coded learner slots, not real learner names.
- Front-door routes list roster-based demo learner codes.
- Front-door routes accept the expected teacher/user code and at least one roster learner code for the launch code.
- Roster cards show learner slots using codes rather than real learner names.
- Roster cards show that raw audio and transcripts are not stored as roster fields.
- Roster cards separate validation errors from open warnings.
- Roster cards make clear that durable reports require persistence and policy decisions.

## Regression Guard

Do not mark a roster as pilot-ready if it stores real names, family contacts, raw audio, or transcripts without a documented policy and persistence decision. Support-language activity, microphone replay, and AI Tutor speech features must not create roster identity records by themselves.
