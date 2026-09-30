# ADR 1337: Bind Source Evidence Into Publisher Handoff Review

## Status

Accepted for the foundation and pilot-review track.

## Decision

The live publisher quarantine handoff bridge must refresh the tenant-authorized
source-to-package evidence binding alongside package readiness, delivery,
release, and persistence previews.

The source bridge remains its own evidence object. It is displayed together for
review convenience, but it must not be collapsed into release approval or
treated as proof that the package can be assembled or assigned.

## Rationale

The saleable pilot requires a publisher to understand how a submitted source
becomes a reviewed multimedia/game package. Showing provenance in the same
handoff surface as package readiness makes that lineage inspectable and avoids
parallel, contradictory review summaries.

## Consequences

- Publisher review now shows source identity, extraction lineage, evidence
  lanes, package readiness, and delivery blockers together.
- The source bridge remains bounded and excludes raw payloads and learner data.
- Package, release, QR, persistence, and student gates remain independent.
- The focused verifier must protect the refresh wiring and the read-only route.
