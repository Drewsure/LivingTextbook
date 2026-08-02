# ADR 0350: AI Prototype Patch Test Harness Plan

Status: accepted

## Context

Patch test readiness gates identify the checks required before future app file work. The platform now needs a teacher-visible plan for the eventual test harness without enabling runnable tests.

## Decision

Add review-only AI prototype patch test harness plans to tenant generator routes after patch test readiness gates.

The plan names fixture replay, standard event, target-language audio, mobile accessibility, deterministic scoring, route safety, storage contract, rollback dry-run, and support-language boundary harness sections.

## Consequences

- Future harness work has a clear scope before implementation.
- Test execution, Playwright runs, app file writes, patch generation, route mutation, scoring or reward mutation, audio manifest mutation, package promotion, assignment, and support-language progress remain blocked.
- MiniStar harness planning must preserve hiragana-only support-language checks for early levels.
