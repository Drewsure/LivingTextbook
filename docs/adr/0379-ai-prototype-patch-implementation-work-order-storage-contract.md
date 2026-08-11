# 0379. AI prototype patch implementation work order storage contract

Date: 2026-08-11

## Status

Accepted

## Context

AI prototype patch implementation work orders are now visible on tenant generator routes as review-only surfaces. The platform needs a backend-neutral record vocabulary before any future patch work order can execute, write app files, run tests, mutate routes, or affect student-facing behavior.

## Decision

Add `ai_prototype_patch_implementation_work_order` / `ai-prototype-patch-implementation-work-order` to the schema draft, migration candidates, migration specs, durable records, hosted/local adapter intents, content-model validators, and route verification.

The record preserves required-before-work records, allowed future file groups, dry-run verification order, rollback plan, route safety, rollback drill, storage verification, reviewer identity, release-lock binding, and blocked work-order actions.

## Consequences

- Future hosted and local backends use the same work-order vocabulary.
- Work-order execution remains blocked until a separate implementation decision exists.
- App file writes, generated patches, tests, Playwright runs, route writes, scoring/reward mutation, audio manifest mutation, package promotion, assignments, and support-language progress remain blocked by storage and verifier checks.
