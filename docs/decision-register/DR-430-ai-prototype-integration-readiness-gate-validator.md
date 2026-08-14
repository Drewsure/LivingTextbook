# DR-430: AI Prototype Integration Readiness Gate Validator

Date: 2026-08-14  
Status: Accepted

## Decision

AI prototype integration readiness gates must use a shared content-model validator before app patch proposals, route planning, package promotion, assignment, scoring profile mutation, Star Dust or reward writes, audio manifest mutation, or student-facing previews can be considered.

## Rationale

The readiness gate is the rollup that prevents partial evidence from looking integration-ready. A shared validator keeps wrapper, fixture, event, audio, mobile, scoring, and Codex decision evidence required together before any returned prototype can move toward the real app.

## Required Evidence

- Integration readiness gate, integration plan, wrapper adapter review, fixture replay report, event replay report, audio coverage report, mobile accessibility report, scoring replay report, and Codex decision source records.
- Evidence checks for wrapper adapter, fixture replay, standard events, target-language audio, mobile accessibility, deterministic scoring, and Codex decision.
- All evidence checks remain required before integration.
- Integration policy preserves parent-engine wrappers, reviewed fixtures, standard events, target-language audio, phone-first accessibility, and deterministic scoring replay.
- MiniStar readiness gates preserve hiragana-only support language and support-only Japanese boundaries.

## Hard Boundaries

- No `apps/web` patch.
- No direct import.
- No route registry write.
- No student-facing route.
- No scoring profile mutation.
- No Star Dust or reward write.
- No audio manifest mutation.
- No package promotion.
- No student assignment.
