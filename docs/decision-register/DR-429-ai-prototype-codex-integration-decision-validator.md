# DR-429: AI Prototype Codex Integration Decision Validator

Date: 2026-08-14  
Status: Accepted

## Decision

AI prototype Codex integration decisions must use a shared content-model validator before integration readiness gates, app patch planning, route planning, package promotion, assignment, scoring profile mutation, Star Dust or reward writes, audio manifest mutation, or package promotion can be considered.

## Rationale

Returned external game prototypes should never silently become LivingTextbook application code. A shared Codex decision guard keeps integration approval manual, evidence-based, and review-only until wrapper, fixture, event, audio, mobile, scoring, and readiness-gate evidence has been inspected.

## Required Evidence

- Prototype integration plan, wrapper adapter review, fixture replay report, event replay report, audio coverage report, mobile accessibility report, scoring replay report, integration readiness gate, and Codex decision source records.
- No-decision-recorded state remains visible.
- Manual Codex review remains blocked until evidence passes.
- Decision options include return to external builder, approve wrapper integration review, and reject integration.
- Required-before-decision checks preserve tenant boundaries, target-language progress, no hidden scoring authority, and accessible learner controls.
- MiniStar decisions preserve hiragana-safe Japanese support while English remains the target-language trigger.

## Hard Boundaries

- No integration approval.
- No `apps/web` patch generation.
- No direct import.
- No route registry write.
- No student-facing route.
- No scoring profile mutation.
- No Star Dust or reward write.
- No audio manifest mutation.
- No package promotion.
- No assignment.
