# Assist Language Verification Checklist

Use this checklist after pulling the latest `legacy-source-import` branch.

## Local Setup

1. Confirm the branch is `legacy-source-import`.
2. Confirm the checkout includes `docs/adr/0010-reviewed-assist-language-packages.md`.
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
2. Confirm Japanese assist appears under each vocabulary term.
3. Confirm Japanese assist appears under both target sentences.
4. Tap English text and confirm English speech works.
5. Tap Japanese assist text and confirm Japanese speech is attempted through browser speech synthesis.
6. Complete flashcard practice and confirm the original progression path still works.
7. Start Memory Match and confirm the game still works.
8. Confirm no live AI translation, AI Tutor, model call, or external translation service is required.

## White-Label Checks

- Assist language is configured through tenant/package data.
- Japanese appears only in MiniStar sample data.
- `TenantLanguageSettings` allows other tenants to choose different assist languages or none.
- Student-visible assist plans require reviewed, verified, or approved status.
- Live AI fallback is explicit and disabled by default for the core sample.
- Assist language support remains separate from full UI localization and optional premium AI Tutor.

## Acceptance Criteria

- The build proves multilingual assist architecture without a full localization rollout.
- The flashcard layout remains readable on desktop and mobile.
- The package remains valid.
- Existing QR/front-door, flashcard, Memory Match, audio, media, Training Academy, and AI Tutor-disabled flows do not regress.
