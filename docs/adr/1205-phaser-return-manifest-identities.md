# ADR 1205: Phaser Return Manifest Identity Boundaries

**Status:** Accepted  
**Date:** 2026-09-25

## Context

The Phaser candidate verifier already bound the returned package to the frozen
source commit, isolated artifact paths, checksums, and review-only status. Its
tenant, request, queue, and artifact identifiers were only required to be
non-blank, leaving malformed path-like values available to later review
records.

## Decision

Require bounded safe identities for `tenantId`, `requestId`, `queueItemId`,
and every artifact identifier. Bound relative paths by length and control
character rules as well as traversal and absolute-path rules. Preserve the
existing candidate profile and source-provenance requirements.

## Consequences

- External evidence can be associated with review records using portable
  identifiers.
- Candidate package verification fails before evidence adjudication when a
  manifest identity is malformed.
- This remains an evidence-only check and does not import source, execute the
  candidate, replace routes, mutate scoring, or enable persistence.

## Verification

- Contract markers cover the new identity rules.
- Package behavior tests reject unsafe tenant, request, queue, and artifact IDs.
- The complete candidate fixture still passes the verifier.
