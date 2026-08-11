# DR-391: Dedicated Memory Match Routes

Date: 2026-08-11

Status: Accepted

## Decision

Add dedicated student Memory Match routes at `/memory/demo-unit-1` and `/memory/partner-demo-unit-1`, backed by the existing reusable pairing parent engine.

## Rationale

Memory Match is a core early-learner activity and appears in the curated pathway immediately after flashcard entry practice. Keeping it only as a launch-page substate made the unlocked pathway feel less concrete and harder to verify.

Dedicated routes make Memory Match directly launchable from teacher shortcuts, student recommended routes, route QA, and future QR/package manifests while preserving the existing game engine and deterministic scoring rules.

## Impact

- MiniStar and sample publisher now have matching Memory Match route coverage.
- The student recommended pathway opens `/memory/[code]` when Memory Match is unlocked.
- Teacher launch shortcuts and teacher unit review contexts expose Memory Match alongside quiz, sentence, speak, media, print, collection, and Training Academy routes.
- Active route verification now guards both Memory Match routes and the route matrix count.

## Constraints

- Memory Match remains a target-language game route; support language does not unlock or complete progress.
- The route reuses the pairing parent engine instead of introducing a one-off game screen.
- Rewards remain deterministic and mastery-earned.
- This does not promote any generated package, uploaded asset, QR alias, or teacher draft into live student workflow.

## Verification

- `npm.cmd run verify:package-readiness`
- `npm.cmd run verify:ai-generator`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
