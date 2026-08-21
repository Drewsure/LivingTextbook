# ADR-0410: Tenant Prototype Review Workbench Routes

Date: 2026-08-21

## Status

Accepted.

## Context

Future game progress will eventually need to compare Codex-built parent-engine routes with Z.ai prototypes and Phaser candidates. The repository already models many prototype evidence gates, but a focused tenant route is needed so reviewers can inspect prototype readiness without treating generator output or outside code as approved product work.

## Decision

Create `/teacher/prototypes/[tenantId]` for tenant-scoped prototype review. The route reuses existing prototype task, return evidence, wrapper, fixture, event, audio, mobile, scoring, integration, patch, signature, release-lock, work-order, and change-set panels.

## Consequences

- Positive: Prototype review now has a clear non-destructive workspace for MiniStar and white-label tenants.
- Positive: Z.ai work can be discussed against concrete evidence gates before any import or app patch.
- Constraint: The route must remain review-only and cannot authorize handoff, returned-code import, Phaser wrapper activation, route creation, scoring/audio mutations, package promotion, storage writes, or student assignment.

## Verification

See `docs/decision-register/DR-481-tenant-prototype-review-workbench-routes.md`.
