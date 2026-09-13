# Operating Note: Canonical Offer Engine Alignment

## Context

The sample tenant game offer map is used by the teacher readiness workbench,
student activity hub, completion handoff, and partner demonstration surfaces.
Those offers must agree with the canonical content-model and web catalog or a
teacher could see a misleading parent-engine assignment before integration.

## Finding

The initial sample entries had the engine labels reversed: Flashcards was marked
as `pairing` and Match Up as `selection`. The canonical contracts define
Flashcards as `selection` and Match Up as `pairing`.

## Procedure

When adding or editing an offer:

1. Check `packages/content-model/src/index.ts` for the mode contract.
2. Match `family`, `engineId`, supported levels, and background-media policy in
   `apps/web/src/features/game-shell/gameModeCatalog.ts`.
3. Run `npm run verify:canonical-games` and open the teacher game-readiness
   route to confirm each map renders as valid.
4. Keep external Phaser candidates in review-only status even when their game
   name matches an active offer.

## Resolution

The two sample offer records now match the canonical engine contracts. A static
verifier guard protects the mapping from silent drift in future edits.

## Curriculum-Level Guard

Offer maps now declare their curriculum level. The content-model validator
checks each offer against its supported levels, and a mode outside that range
must be explicitly `blocked`. Level 1 samples therefore do not recommend
Sentence Builder; the route remains available for later-level packages.

The Level 1 activity compatibility matrix uses the same distinction: Sentence
Builder is planned for Level 2+ rather than offered in the Level 1 pathway.
