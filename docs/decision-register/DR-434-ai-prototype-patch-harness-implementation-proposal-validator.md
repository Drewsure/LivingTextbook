# DR-434: AI Prototype Patch Harness Implementation Proposal Validator

Date: 2026-08-14  
Status: Accepted

## Decision

AI prototype patch harness implementation proposals must use a shared content-model validator before Codex patch approval decisions, route planning, package promotion, assignment, scoring profile mutation, Star Dust or reward writes, audio manifest mutation, app file work, harness implementation, test execution, or Playwright runs can be considered.

## Rationale

Implementation proposals must remain future-scope review artifacts. A shared validator keeps file scope dry-run-only, blocks runnable harness work, and preserves target-language progress boundaries before any code implementation is reviewed.

## Required Evidence

- Future-only file scope for harness manifest adapter, fixture/event/audio assertion maps, mobile viewport checklist, deterministic scoring replay checklist, route safety smoke checklist, storage adapter checklist, and rollback dry-run checklist.
- Implementation boundaries blocking app routes, student-facing UI, runtime test runners, Playwright invocation, and fixture/score/reward/audio/route/package/assignment writes.
- Review gates for Codex patch approval, accepted harness plan, route safety release gate, rollback drill, storage verification, and reviewer identity signature.
- Dry-run-only checks for fixture, event, audio, mobile, scoring, route, storage, rollback, and MiniStar hiragana support-language assertions.

## Hard Boundaries

- No harness implementation from this proposal.
- No test execution.
- No Playwright run.
- No app file write.
- No app patch generation.
- No route mutation.
- No student-facing route.
- No scoring or reward mutation.
- No audio manifest mutation.
- No package promotion.
- No assignment.
- No support-language progress trigger.
