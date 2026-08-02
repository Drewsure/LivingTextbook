# ADR 0335: AI Prototype App Patch Proposal Preview

## Status

Accepted

## Context

The generator foundation now has return review, integration plan, wrapper review, fixture replay, event replay, audio coverage, mobile accessibility, scoring replay, Codex decision, and readiness-gate lanes. The next risk is that a future agent could interpret an accepted prototype as permission to write app files directly.

The platform needs a review-only patch proposal preview before any actual patch generation exists. This keeps useful external prototype work moving while preserving parent-engine, file-scope, test, release-control, and student-safety boundaries.

## Decision

Add an AI prototype app patch proposal preview to teacher generator routes. The preview shows future file scope, required pre-patch gates, required test gates, source records, and blocked actions.

Patch proposals remain blocked until an accepted Codex decision, all-evidence readiness gate, reviewer identity/signature gate, and release-control binding exist.

## Consequences

- Future integration work can discuss file scope without generating app file writes.
- Generated route writes, student-facing routes, scoring or reward mutations, audio manifest mutation, package promotion, and assignments remain blocked.
- Z.ai and other outside builders can still produce prototypes, but their work must pass through wrapper-first planning and verifier gates.
- MiniStar Japanese support remains support-only; English remains the target-language trigger.
