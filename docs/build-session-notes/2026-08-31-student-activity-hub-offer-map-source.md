# Build Session Note: Student Activity Hub Offer-Map Source

Date: 2026-08-31

## What Changed

- Connected `/activities/[code]` to the reviewed unit game offer map for the resolved content package.
- Added an offer-map source panel to the student activity hub.
- Generated reviewed game cards from offer-map entries.
- Kept Training Academy, printable worksheet, unit media, and launch doorway as explicit support routes.
- Displayed audio and reporting rules on student activity cards.
- Added a fallback game list for packages that do not yet have reviewed offer maps.

## Why It Matters

The student route map now follows the same source of truth as teacher/admin readiness. This keeps game availability tenant-maintainable and prevents hidden drift between review surfaces and learner navigation.

## Blocked Actions

- No unrestricted switch-template panel.
- No unreviewed student routes.
- No support-language-only progress.
- No media-only mastery.

## Verification

- Run `npm run typecheck --workspace @living-textbook/web`.
- Run `npm run verify:routes`.
- Run `npm run verify:review-keys`.
