# DR-393: Dedicated Flashcard Entry Routes

Date: 2026-08-11

Status: Accepted

## Decision

Add dedicated student flashcard routes at `/flashcards/demo-unit-1` and `/flashcards/partner-demo-unit-1`, while keeping `/launch/[code]` as the classroom QR doorway.

## Rationale

Flashcards are the entry practice mode and the first step in the curated student pathway. The launch route remains valuable because it combines QR context, media shortcuts, student summary, flashcards, unlock flow, and recommended route guidance. A dedicated flashcard route is still needed for direct activity paths, teacher shortcuts, assignments, future QR aliases, and white-label package manifests.

## Impact

- MiniStar and sample publisher now both expose direct flashcard entry-practice routes.
- The route uses the existing flashcard component, preserving target-language audio gating and support-language-only boundaries.
- Teacher launch shortcuts, teacher unit review routes, active route matrix, package readiness checks, and active route verification now include Flashcards as a first-class activity route.
- The active route count moves to 57 checked routes.

## Constraints

- `/launch/[code]` remains the recommended whole-class QR doorway.
- `/flashcards/[code]` is an activity route, not a live assignment or production classroom launch.
- English/target-language listening remains the progress trigger.
- Support language, media, and assist text cannot complete the entry gate.
- No generated package, upload, QR alias, or assignment is promoted by this route.

## Verification

- `npm.cmd run verify:game-modes`
- `npm.cmd run verify:package-readiness`
- `npm.cmd run verify:ai-generator`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
