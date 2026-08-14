# DR-433: AI Prototype Patch Test Harness Plan Validator

Date: 2026-08-14  
Status: Accepted

## Decision

AI prototype patch test harness plans must use a shared content-model validator before harness implementation proposals, route planning, package promotion, assignment, scoring profile mutation, Star Dust or reward writes, audio manifest mutation, app file work, test execution, or Playwright runs can be considered.

## Rationale

The harness plan should describe coverage without becoming a runnable harness. A shared validator preserves the review-only boundary while making fixture, event, audio, mobile, scoring, route, storage, rollback, and MiniStar support-language checks explicit.

## Required Evidence

- Required inputs for patch test readiness, app patch proposal, reviewed fixtures, standard event contract, audio cue manifest, scoring profile, route safety, rollback drill, storage verification, and Codex patch approval.
- Harness sections for fixture replay, standard events, target-language audio, mobile accessibility, deterministic scoring, route safety, storage contract, and rollback dry-run.
- Non-execution outputs for test manifests, assertion maps, cue coverage, viewport checks, scoring replay, route safety, storage adapter checks, and rollback dry-run checks.
- MiniStar harness plans include hiragana support-language checks and block Japanese support-language scoring, progress triggers, and release.

## Hard Boundaries

- No test execution from this plan.
- No Playwright run from this plan.
- No app file write.
- No app patch generation.
- No route mutation.
- No scoring or reward mutation.
- No audio manifest mutation.
- No package promotion.
- No assignment.
- No support-language progress trigger.
