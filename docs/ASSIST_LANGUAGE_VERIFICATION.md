# Assist Language Verification Checklist

Use this checklist after pulling the latest `legacy-source-import` branch.

## Local Setup

1. Confirm the branch is `legacy-source-import`.
2. Confirm the checkout includes `docs/adr/0010-reviewed-assist-language-packages.md`, `docs/adr/0013-support-only-assist-language.md`, and `docs/adr/0015-target-language-entry-gate.md`.
3. Run typecheck.
4. Run build.
5. Start the local web app.

Recommended commands:

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

## Dashboard Checks

On `/`:

1. Confirm the Living Textbook package metrics include `Assist`.
2. Confirm the package validation still says `Package valid`.
3. Confirm the reviewed assist language panel appears.
4. Confirm the panel shows Japanese as optional package data.
5. Confirm it shows reviewed status and live AI fallback off.
6. Confirm the UI language does not imply Japanese is required for every tenant.

## Student Checks

On `/launch/demo-unit-1` and `/enter/ministar` after opening the unit:

1. Confirm flashcard terms still show English as the target learning text.
2. Confirm Japanese assist is hidden by default when the teacher support-language control is off.
3. Confirm `/enter/ministar` also keeps Japanese assist hidden unless a launch-session setting enables it.
4. Open `/teacher`, enable `Show assist language`, then return to `/launch/demo-unit-1`.
5. Confirm Japanese assist appears under each vocabulary term.
6. Confirm Japanese assist appears under both target sentences.
7. Confirm the Level 1 student-visible Japanese assist uses hiragana only.
8. Confirm the entry practice area shows the target-language counter, currently `English listened: 0/10` for the sample unit.
9. Tap only Japanese assist text and confirm Japanese speech is attempted through browser speech synthesis.
10. Confirm the target-language counter stays unchanged after Japanese-only taps.
11. Confirm the completion action stays disabled and does not unlock Memory Match after Japanese-only taps.
12. Tap English vocabulary terms and confirm English speech works.
13. Tap both English target sentences and confirm English speech works.
14. Confirm the target-language counter reaches `10/10` only after all 8 English terms and both English sentence structures have been heard.
15. Confirm `Mark practice complete` becomes available only after the target-language gate is satisfied.
16. Complete flashcard practice through the English entry-practice action and confirm the original progression path still works.
17. Confirm Memory Match unlocks only after entry practice completion.
18. Start Memory Match and confirm the game still works.
19. Confirm no live AI translation, AI Tutor, model call, or external translation service is required.
20. Open `http://127.0.0.1:3000/teacher/sessions/demo-unit-1` and confirm the settings snapshot includes `teacher_enablement_persisted` for assist language.
21. Confirm the teacher session warnings state that assist-language visibility still needs persisted teacher enablement before classroom use.
22. Confirm the content-package validator requires a declared Japanese script policy for student-visible plans.
23. Confirm Foundation, Bronze, and Plus plans reject katakana/kanji unless the package is explicitly reclassified and reviewed for a later band.
24. Confirm Silver-or-later mixed-script plans declare `reviewed-mixed-script` or an approved tenant-defined policy.

## White-Label Checks

- Assist language is configured through tenant/package data.
- Japanese appears only in MiniStar sample data.
- `TenantLanguageSettings` allows other tenants to choose different assist languages or none.
- Student-visible assist plans require reviewed, verified, or approved status.
- Student-visible Japanese assist plans declare `scriptPolicy` and, where applicable, `levelBand` in the content package.
- Assist language remains support-only and cannot replace the target learning language progression trigger.
- Foundation, Bronze, and Plus Japanese assist packages use hiragana-only student-facing text.
- Silver and later Japanese assist packages may introduce kanji and katakana only after review.
- Live AI fallback is explicit and disabled by default for the core sample.
- Assist language support remains separate from full UI localization and optional premium AI Tutor.
- Teacher-controlled visibility is local scaffold behavior until launch-session settings are persisted; the teacher-session settings snapshot must preserve the future durable setting shape.

## Acceptance Criteria

- The build proves multilingual assist architecture without a full localization rollout.
- The flashcard layout remains readable on desktop and mobile.
- The package remains valid.
- Existing QR/front-door, flashcard, Memory Match, audio, media, Training Academy, and AI Tutor-disabled flows do not regress.
- The support-language layer helps comprehension without becoming a shortcut around English mastery checks.
