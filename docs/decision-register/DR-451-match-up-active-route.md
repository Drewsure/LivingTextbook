# DR-451: Match Up Active Pairing Route

## Decision

Promote `match-up` to a first-class active student route at `/match/[code]`.

## Rationale

Match Up is the simplest visible pairing bridge after Flashcards. It lets early learners hear a target-language prompt and choose the matching word card before moving into the harder hidden-card Memory Match mode.

This strengthens the curated pathway without creating a one-off game. The route uses the existing pairing parent engine, deterministic scoring, standard progress events, tenant-aware package data, and explicit audio cue coverage.

## White-Label Impact

- Adds a common teacher-requested matching mode that can fit many textbook units.
- Keeps the implementation tenant-neutral and package-driven.
- Supports local companion packaging as a low-risk bundled game route.
- Preserves the curated activity pathway promise instead of a switch-to-anything panel.

## Cost Impact

Low. The route reuses existing pairing state, progression, audio, route, and scoring infrastructure. No Phaser, AI Tutor, storage, microphone, or live upload dependency is introduced.

## Constraints

- Target-language audio remains the progress trigger.
- Support-language taps cannot unlock progress or award mastery.
- Rewards remain deterministic.
- Background media is optional and teacher-gated.
- Future Phaser or premium polish must wrap this route contract rather than replace its reporting model.

## Verification

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
- `npm run verify:game-modes`
- `npm run verify:package-readiness`
- `npm run verify:local-bundle`
- `npm run verify:activity-pathways`
- `npm run verify:routes`
