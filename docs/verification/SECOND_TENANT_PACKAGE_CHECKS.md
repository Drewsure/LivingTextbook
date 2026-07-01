# Second Tenant Package Checks

Use these checks after pulling the latest `legacy-source-import` branch and running the local dev server.

## Commands

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git restore apps/web/next-env.d.ts
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

## Routes

- `http://127.0.0.1:3000/partner-demo`
- `http://127.0.0.1:3000/launch/partner-demo-unit-1`
- `http://127.0.0.1:3000/speak/partner-demo-unit-1`

## Expected Results

- `/partner-demo` shows `Sample Publisher Lab`, not MiniStar branding.
- `/partner-demo` shows `Learning Sparks`, not Star Dust.
- `/partner-demo` shows a valid package with audio cues, audio file placeholder, video placeholder, playlist, optional background media, and premium AI Tutor off.
- `/launch/partner-demo-unit-1` opens the student launch with the partner tenant palette and Daily Routines terms.
- Tapping English target-language terms and sentences increments the entry-practice gate.
- Assist language is not shown for the sample publisher package.
- Completing entry practice unlocks Memory Match.
- `/speak/partner-demo-unit-1` opens the same partner tenant and unit in Speak It.
- Microphone record/replay follows the teacher approval setting for the sample publisher tenant.
- Missing demo media files are acceptable placeholders during this phase, but the UI must remain usable.

## Failure Signals

- Any partner route shows MiniStar-specific Japanese support.
- Any partner route uses Star Dust as the reward name.
- Support language or media interaction unlocks the next game without target-language practice.
- Speak It requires AI Tutor or AI speech scoring.
- The app forks into partner-only duplicate screens rather than shared components.
