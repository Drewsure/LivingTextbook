# ADR 0368: AI Generated Package Writer Test Harness Plan

Date: 2026-08-10

## Status

Accepted

## Context

Generated package writer test evidence packets are visible and preserved as backend-neutral records. The next risk is allowing a future harness implementation to be imagined without naming the dry-run phases, adapter boundaries, prerequisites, and blocked actions first.

## Decision

Add a review-only AI generated package writer test harness plan to tenant generator routes after test evidence packet storage. The plan names fixture replay, route smoke, media policy, local/assignment, and rollback guard phases, plus static fixture, browser smoke, and local dry-run adapters.

The plan must remain blocked. It cannot implement a test harness, run tests, run mutation browser checks, upload evidence, capture signed approval, patch app files, write generated package JSON, mutate route registries, create playlists, package local bundles, activate assignments, mutate production QR redirects, or accept support-language-only harness passes.

## Consequences

- Future harness work gets explicit phase and adapter expectations first.
- Partner publishers and MiniStar share the same test-harness planning vocabulary.
- This does not create executable test harness code or any generated package writer workflow.
