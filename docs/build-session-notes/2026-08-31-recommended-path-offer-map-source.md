# Build Session Note: Recommended Path Offer-Map Source

Date: 2026-08-31

## What Changed

- Added content package ids to recommended path card calls in launch, front-door, and flashcard flows.
- Let `RecommendedGameRoutesCard` prefer reviewed unit game offer maps.
- Kept launch-session recommendations as the fallback path.
- Displayed the recommendation source on student-facing cards.
- Added active route checks for MiniStar and sample publisher source labels.

## Why It Matters

Student route recommendations now follow the same reviewed game availability source as activity hubs and completion cards. This reduces drift before we add more game modes or later evaluate outside prototypes.

## Blocked Actions

- No route publishing.
- No support-language-only progress.
- No premium or teacher-only auto-unlock.
- No unrestricted switch-template behavior.

## Verification

- Run `npm run typecheck --workspace @living-textbook/web`.
- Run `npm run build --workspace @living-textbook/web`.
- Run `npm run verify:routes`.
