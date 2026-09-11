# ADR 0576: Evidence Alignment Collection Identity

Status: Accepted

## Decision

Validate the evidence-alignment collection as well as each individual packet.
Return review IDs, integration plan IDs, and tenant/request pairs must each be
unique across the collection.

## Context

The alignment validator already compares tenant, request, plan, mode, and
parent-engine identity within one packet. A review queue also needs protection
against duplicate packets before future Z.ai or Phaser evidence is considered
for controlled integration review.

## Consequences

- One candidate produces one auditable alignment packet per tenant/request.
- Duplicate queue entries fail before they can influence readiness summaries.
- The validator remains read-only and provider-neutral.
- No import, route write, scoring mutation, reward write, package promotion,
  playlist write, or assignment is enabled.

## Verification

Runtime behavior verification covers duplicate return review IDs, duplicate
integration plan IDs, and duplicate tenant/request pairs. Full foundation
verification remains required before push.
