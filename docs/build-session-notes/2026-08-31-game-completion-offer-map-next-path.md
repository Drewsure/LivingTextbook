# Build Session Note: Game Completion Offer-Map Next Path

Date: 2026-08-31

## What Changed

- Let the shared game completion card receive the reviewed unit game offer map from the game shell.
- Preferred reviewed offer-map order when selecting the next activity.
- Kept launch-session recommendations as fallback behavior.
- Blocked hidden, blocked, premium, teacher-only, and not-ready offers from automatic next-activity suggestions.
- Added visible `Next source` evidence to completion cards.

## Why It Matters

Game completion is part of the progression loop. The next suggested activity should follow the same reviewed unit offer map that teacher/admin workbenches use.

## Blocked Actions

- No route publishing.
- No scoring mutation.
- No teacher-only or premium auto-unlock.
- No unrestricted activity switching.

## Verification

- Run `npm run typecheck --workspace @living-textbook/web`.
- Run `npm run build --workspace @living-textbook/web`.
- Run `npm run verify:routes`.
