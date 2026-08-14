# DR-431: AI Prototype App Patch Proposal Validator

Date: 2026-08-14  
Status: Accepted

## Decision

AI prototype app patch proposals must use a shared content-model validator before patch test readiness, patch harness planning, route planning, package promotion, assignment, scoring profile mutation, Star Dust or reward writes, audio manifest mutation, or app file work can be considered.

## Rationale

A future returned prototype may be useful, but it still needs a narrowly scoped app patch proposal before Codex touches production app code. A shared validator keeps patch scope explicit, test scope required, and all student-facing or scoring side effects blocked.

## Required Evidence

- App patch proposal, Codex integration decision, integration readiness gate, integration plan, wrapper adapter review, fixture replay, event replay, audio coverage, mobile accessibility, and scoring replay source records.
- Proposed file scope limited to wrapper adapters, reviewed fixtures, route previews, and verifier tests.
- Pre-patch gates for accepted Codex decision, all-evidence readiness gate, reviewer identity signature, and release-control binding.
- Required test gates for fixture replay, standard events, target-language audio, mobile accessibility, and deterministic scoring.
- MiniStar proposals block Japanese support-language triggers while English remains the target-language trigger.

## Hard Boundaries

- No app file writes.
- No generated route write.
- No student-facing route.
- No scoring or reward mutation.
- No audio manifest mutation.
- No package promotion.
- No assignment.
