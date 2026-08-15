# Unit Game Offer Map Verification Checks

Use these checks after pulling connector-side commits locally.

## Local Commands

```powershell
Set-Location -LiteralPath "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git restore apps/web/next-env.d.ts
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

## Browser Route

Open:

- `http://127.0.0.1:3000/teacher/intake`

## Visual Checks

Confirm the page includes a `Game offer map` panel with:

- the unit-to-game decision rule,
- metrics for required, premium, blocked, and teacher-control counts,
- offers for Entry Flashcards, Match Up, Label It, Memory Match, Speak It Practice, Balloon Pop, Type Answer, True or False, and Teacher Review Quiz,
- availability badges such as Required, Teacher only, Premium, and Hidden,
- readiness badges such as Ready, Review, and Blocked,
- audio, media, teacher-control, evidence, next-step, and not-allowed-yet sections.

## Product Checks

Confirm the panel makes these rules clear:

- game offers are configured per unit, not hard-coded as one-off pages,
- each game has a parent engine,
- required games have learner-facing audio requirements,
- premium games are tenant/package features and not child-facing pressure loops,
- microphone games require teacher approval and do not upload raw audio,
- hidden/blocked games are not student-facing until reviewed,
- background media does not replace comprehension audio.

## Acceptance

Do not mark this slice locally verified until typecheck/build pass and `/teacher/intake` renders the `Game offer map` panel without console errors.
