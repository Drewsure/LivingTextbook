# ADR 0864: Local Bundle Provider Mapping

## Status

Accepted for foundation rehearsal.

## Context

The local handoff review route now has a teacher-only access boundary, but it
must not become a storage-specific route. A future hosted or closed-deployment
provider needs one stable record shape that preserves tenant identity and
review blockers without turning readiness evidence into activation authority.

## Decision

Define `LocalBundleHandoffRecord` and
`mapLocalBundleHandoffPacketToRecord` in the shared content model. The web
application exposes `LocalBundleHandoffReviewProvider`; its current adapter is
explicitly unconfigured and returns no record. The protected route reads only
through that adapter.

## Boundaries

The mapper is pure and has no database, filesystem, media, learner, or network
side effects. It derives blocked count from checks and handoff items, preserves
tenant/bundle/package/packet identity, and keeps review-only status. No mapped
record can activate offline content, mutate a redirect, or promote a student.

## Consequences

Provider work can be reviewed against a stable contract and tested without
changing route authorization. A provider remains blocked until retention,
export, backup/restore, local fallback, tenant isolation, and runtime checks
are accepted.
