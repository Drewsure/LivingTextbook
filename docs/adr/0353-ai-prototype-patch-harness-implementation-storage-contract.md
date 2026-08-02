# ADR 0353: AI Prototype Patch Harness Implementation Proposal Storage Contract

## Status

Accepted.

## Context

The generator now shows review-only patch harness implementation proposals after the harness plan. These proposals name future file scope and dry-run-only checks, but they must not become runnable harness code, tests, Playwright runs, app patches, routes, scoring changes, reward writes, audio manifest changes, package promotion, assignments, or support-language progress triggers.

## Decision

Add a backend-neutral storage contract for `ai_prototype_patch_harness_implementation_proposal` / `ai-prototype-patch-harness-implementation-proposal`.

The contract must preserve proposed file scope, implementation boundaries, required review gates, dry-run-only checks, next required records, and blocked implementation actions. Hosted and local adapters must expose equivalent write intents and keep harness implementation, test execution, Playwright runs, app file writes, app patch generation, route writes, student-facing routes, scoring or reward writes, audio manifest mutation, package promotion, assignments, and support-language progress blocked.

## Consequences

- External AI prototype work can progress toward disciplined test harness planning without bypassing Codex review.
- Closed local deployments and hosted deployments share the same audit vocabulary.
- Future runnable harness work requires a separate approval and implementation ticket.
