# ADR 0374: AI Prototype Signed Approval Preflight

## Status

Accepted.

## Context

The generator route now exposes Codex patch approval decision previews. The next visible checkpoint is the human signed approval boundary that would eventually authorize tightly scoped patch work. That boundary must be visible before any real signature capture, approve button, patch generation, app file write, test run, route mutation, package promotion, assignment, or support-language progress trigger exists.

## Decision

Add review-only AI prototype signed approval preflights to tenant generator routes after Codex patch approval decision previews.

The preflight names authenticated reviewer identity, tenant role binding, Codex reviewer acknowledgement, approval scope locks, approval record draft fields, evidence checklist, cannot-approve-while blockers, next required records, and blocked actions.

## Consequences

- Future signed approval work has a visible adult/admin evidence shape before implementation.
- No signed approval capture or approve button exists.
- No app patch, test execution, route mutation, scoring or reward mutation, package promotion, assignment, or support-language progress can be inferred from the preflight.
- MiniStar preflights preserve hiragana-only Japanese support and support-only progression while English remains the trigger.
