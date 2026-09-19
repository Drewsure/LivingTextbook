# ADR 0874: Shared Release-Control Evidence For Policy And Pilot Handoff

## Status

Accepted for foundation rehearsal.

## Context

Media release-control evidence was already feeding the pilot readiness summary
and classroom launch gate. The school-policy acceptance preflight and the pilot
handoff package still described release blockers independently, which created a
risk that one review surface could drift from the actual release decision.

## Decision

Create one provider-neutral, review-only release-control evidence contract from
the existing media release-control binding. Require the pilot handoff package
to carry it and require the school-policy acceptance preflight to consume the
same derived evidence. Preserve the binding id, release gate, tenant/package
identity, decision, reasons, approvals, blocked actions, and all false/no-side-
effect flags.

## Consequences

Policy discussion and pilot handoff now show the same release state. Malformed
or missing evidence invalidates the pilot handoff. The contract adds no upload,
acceptance, storage, launch, assignment, export, or release mutation behavior.
