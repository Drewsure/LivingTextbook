# Build Session Note: Shared Game-Mode Route Path Helper

Date: 2026-08-31

## What Changed

- Added `getGameModeRoutePath` as the shared route resolver for playable game modes.
- Refactored the student activity hub, game completion next card, recommended game path card, teacher launch shortcuts, and partner demo shortcuts to use the shared helper.
- Left non-game routes explicit, including printable, media, training, collection, teacher, assignment, and review routes.

## Why It Matters

The next phase will add more game-mode routes and eventually review Phaser/Z.ai prototypes. A shared route helper keeps game links disciplined, easier to verify, and cheaper to maintain across white-label tenants.

## Blocked Actions

- No route publishing.
- No unrestricted switch-template behavior.
- No direct outside prototype promotion.
- No support-language-only progress.

## Verification

- Run `npm run typecheck --workspace @living-textbook/web`.
- Run `npm run build --workspace @living-textbook/web`.
- Run `npm run verify:routes`.
