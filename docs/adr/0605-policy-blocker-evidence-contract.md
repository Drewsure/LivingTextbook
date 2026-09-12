# ADR-0605: Policy Blocker Evidence Contract

Status: Accepted

## Decision

Migration candidates marked `needs-policy` must declare prerequisites, and
migration specifications marked `blocked-by-policy` must declare explicit
policy blockers.

## Why

White-label deployments need a reviewable boundary between technical
readiness and school, tenant, privacy, retention, rights, or commercial
approval. A status without the evidence needed to clear it is not an
actionable gate.

## Guardrails

- This contract records blockers; it does not accept policy or activate a
  migration.
- It does not enable billing, live persistence, uploads, student data, or
  classroom launch.
- Policy acceptance remains a human or tenant-controlled decision.

## Consequences

Every policy-blocked backend record must explain what remains unresolved and
what prerequisites are required before implementation can proceed.
