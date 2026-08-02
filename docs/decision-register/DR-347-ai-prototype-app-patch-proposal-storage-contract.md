# DR-347: AI Prototype App Patch Proposal Storage Contract

Date: 2026-08-02

## Decision

Persist AI prototype app patch proposals as backend-neutral hosted and local records before generated or returned prototypes can move toward app file changes.

## Why

The preview shape is stable enough to preserve as a contract. Storing the proposal separately keeps future file-scope planning useful while preventing app patches from bypassing Codex review, evidence review, reviewer identity, release control, test gates, and rollback planning.

## Preserves

- Proposed file scope.
- Required pre-patch gates.
- Required test gates.
- Rollback requirements.
- Reviewer identity/signature requirement.
- Release-control binding.
- Blocked patch actions.

## Blocks

- No app file write.
- No app patch generation.
- No direct app import.
- No route write.
- No student-facing route.
- No scoring mutation.
- No Star Dust or reward write.
- No audio manifest mutation.
- No package promotion.
- No assignment.
- No support-language progress trigger.
