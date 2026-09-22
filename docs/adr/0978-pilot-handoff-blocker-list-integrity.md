# ADR 0978: Pilot Handoff Blocker-List Integrity

Status: Accepted

## Context

The pilot handoff packet carries persistence and activation blockers plus human
handoff notes. Array shape alone does not prove that the packet contains useful
distinct evidence.

## Decision

The canonical pilot handoff validator rejects blank or duplicate persistence-
gate blockers, blank or duplicate activation-preflight blockers, and duplicate
handoff notes.

## Consequences

- Controlled-pilot review packets present distinct actionable evidence.
- The rule applies to MiniStar and all publisher tenants.
- No pilot launch, persistence, reporting, promotion, or student access is
  enabled by this validation.

## Verification

Runtime behavior coverage exercises blank persistence blockers, duplicate
activation blockers, and duplicate handoff notes.
