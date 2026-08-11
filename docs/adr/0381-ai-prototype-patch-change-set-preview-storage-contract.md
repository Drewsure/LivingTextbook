# 0381. AI prototype patch change set preview storage contract

Date: 2026-08-11

## Status

Accepted

## Context

AI prototype patch change set previews now show the future file-level plan before app file work. The platform needs a backend-neutral record vocabulary so hosted and local deployments preserve that review surface before any future patch execution exists.

## Decision

Add `ai_prototype_patch_change_set_preview` / `ai-prototype-patch-change-set-preview` to the schema draft, migration candidates, migration specs, durable records, hosted/local adapter intents, content-model validators, and route verification.

The record preserves linked work order, planned file changes, invariant checks, review blockers, next required records, route safety, rollback drill, storage verification, reviewer identity, and blocked change-set actions.

## Consequences

- Future hosted and local backends use the same change-set vocabulary.
- Apply-patch actions remain blocked until a separate implementation decision exists.
- App file writes, generated file writes, tests, Playwright runs, route writes, scoring/reward mutation, audio manifest mutation, package promotion, assignments, and support-language progress remain blocked by storage and verifier checks.
