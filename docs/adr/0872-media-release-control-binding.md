# ADR 0872: Media Release-Control Binding

## Status

Accepted for foundation rehearsal.

## Context

Media evidence reconciliation can identify pending evidence and package drift,
but the teacher release-control route must consume that result explicitly. A
separate media readiness panel would otherwise allow the release gate and the
media lane to disagree.

## Decision

Add a provider-neutral, review-only binding from media reconciliation into the
existing package publish gate. It compares release-gate tenant and package
identity, reconciled media status, and the release gate's media status, then
returns blocked, needs-review, or evidence-ready-for-human-review semantics.

## Consequences

The release route can explain why media blocks a candidate without adding a
publish action. Identity drift is blocked, pending evidence remains visible,
and even an evidence-ready result cannot activate, write, promote, or mutate
the package. Human approvals remain part of the release decision.
