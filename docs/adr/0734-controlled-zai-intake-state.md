# ADR 0734: Controlled Z.ai Intake State

## Status

Accepted

## Context

The foundation has reached the documented controlled-intake stage. The governed
intake document permits one isolated Z.ai or Phaser candidate to be returned
for review, but the teacher foundation status snapshot still said that intake
had not begun. That stale label obscured the human handoff without changing the
actual safety boundary.

## Decision

Change the teacher foundation status to `Controlled intake open` and retain the
explicit block `No Z.ai import before returned-package review`. The open state
permits a named candidate evidence package to be returned from
`Drewsure/ministar-lab`; it does not permit source copying, route activation,
production promotion, persistence, scoring ownership, or student assignment.

## Consequences

The teacher-facing status now accurately tells the owner when Z.ai work may be
handed back for review. Candidate package integrity, source identity, replay,
audio, scoring, mobile, accessibility, wrapper, tenant, and Codex decision
gates remain independent and fail closed.

## Verification

Run the teacher route checks, workspace typecheck, production build, and
`npm run verify:foundation`.
