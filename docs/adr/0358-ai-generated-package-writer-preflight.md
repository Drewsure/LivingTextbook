# 0358: AI Generated Package Writer Preflight

Date: 2026-08-09

## Status

Accepted

## Context

The generator now has assembly readiness, assembly dry-run previews, and dry-run storage contracts. The next visible step before any future generated package writer is to show exactly which writer targets would be involved and which evidence each target needs.

## Decision

Add review-only AI generated package writer preflights to tenant generator routes.

The preflight names package JSON writer, route registry writer, media playlist writer, local companion writer, assignment shell writer, and rollback map writer targets. It preserves required evidence and blocked writes while keeping all writer execution blocked.

## Consequences

- Reviewers can see the future writer surface before any writer exists.
- Package JSON, route, playlist, local bundle, assignment, rollback, and student-ready paths stay blocked.
- Future package writer implementation requires a separate storage contract and release-control decision.
