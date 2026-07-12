# DR-150: Foundation Verification Gate Panel

## Decision

Expose the foundation verification gate in the teacher/admin intake surface.

## Rationale

The project now has several command-line safety gates. Future partner conversations, school pilots, and outside AI delegation need a visible explanation of what those gates protect. Keeping this on `/teacher/intake` makes build discipline part of the product review workflow rather than hidden engineering folklore.

## Accepted Direction

- Add a compact panel near the top of `/teacher/intake`.
- Show the canonical `npm run verify:foundation` command.
- Show taxonomy, game-mode, package-readiness, local-bundle, build, and route checks.
- Add route-verifier required text for `Foundation verification gate`, `verify:package-readiness`, and `verify:local-bundle`.

## Follow-Up

Replace sample pass status with real CI/release-record status when a deployment pipeline exists.
