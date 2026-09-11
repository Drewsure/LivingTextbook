# ADR-0593: Durable Evidence Scope Boundary

Status: Accepted

## Decision

Evidence packet and evidence attachment records must carry an explicit
`scope_kind` value of `platform` or `tenant` at the schema, migration, and
persistence-contract boundaries.

The existing human-readable `scope` field may describe the review workspace,
but it cannot substitute for the machine-readable ownership boundary.

## Why

The platform has shared review contracts as well as tenant-owned content. They
may use the same evidence packet shape, but they must not be confused during
storage queries, exports, local bundle assembly, or future adapter writes.

## Guardrails

- Missing or invalid scope keeps an evidence record blocked.
- Scope identifies ownership and visibility; it does not authorize upload,
  storage writes, approval, promotion, or student-facing use.
- Tenant filtering and release-control checks remain required independently.
- Hosted and local deployments must preserve the same field and values.

## Consequences

Backend candidates must support the field in both administrative records and
local fallback JSON. Review surfaces can now prove that a platform contract was
not mistaken for a tenant record before any real persistence adapter is chosen.
