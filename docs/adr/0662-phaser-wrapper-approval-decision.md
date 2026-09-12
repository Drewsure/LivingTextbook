# ADR 0662: Phaser Wrapper Approval Decision

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

Each external game candidate review must include a machine-checked wrapper
approval decision. The default status is `blocked`, with one or more explicit
blockers. `approved-for-wrapper` is permitted only when the review has no
missing evidence and no approval blockers.

Approval is narrowly scoped: it permits review of a platform-owned adapter,
not direct source import, route replacement, scene-owned scoring, browser
persistence, package promotion, or student assignment.

## Rationale

Mapped evidence and integration permission are separate decisions. Making the
distinction explicit prevents a visually compelling Phaser candidate from
silently becoming production code.

## Consequences

- Current Memory Match and Balloon Pop candidates remain blocked by default.
- Future approval is auditable through a decision id, timestamp, and blocker
  list.
- The platform can accept a useful wrapper without accepting the source
  engine's identity, scoring, storage, or reward behavior.
