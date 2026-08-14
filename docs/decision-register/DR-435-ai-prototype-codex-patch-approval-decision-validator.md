# DR-435: AI Prototype Codex Patch Approval Decision Validator

## Status

Accepted.

## Context

AI/Z.ai prototype work can now reach a visible Codex patch approval decision preview. That preview is important, but it must not be mistaken for an actual approval or a permission to write app files.

## Decision

Add a shared `validateAiPrototypeCodexPatchApprovalDecision` guard in the content model and require the teacher generator route to show its active guard, guard blocks, and guard warnings.

The guard keeps Codex patch approval decisions blocked until linked source records, evidence checks, route safety, rollback, storage verification, reviewer identity, no recorded approval state, next records, and support-language boundaries are all present.

## Consequences

- Prototype approval previews stay review-only.
- Visible decision options do not become approval records.
- Signed approval, release locks, work orders, change sets, app file writes, test execution, Playwright runs, route mutation, scoring or reward mutation, audio manifest mutation, package promotion, assignments, and support-language progress remain blocked until later gates explicitly allow them.
- MiniStar Foundation Japanese support remains hiragana-only and support-only while English remains the progress trigger.
