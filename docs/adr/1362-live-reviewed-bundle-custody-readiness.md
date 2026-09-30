# ADR 1362: Bind Reviewed Bundle Custody Into Live Readiness

## Status

Accepted for the review-only pilot foundation.

## Decision

The live publisher package-readiness route reads the exact reviewed local
bundle-manifest custody record using the attached source-preflight version.
It validates the tenant, package, quarantine, review-packet, and source-
preflight identities before reporting the reviewed-manifest assembly input as
present.

The route returns bounded custody metadata only. It does not return the
manifest body, filesystem path, source payload, asset bytes, credentials, or
learner records.

## Consequences

- A draft bundle manifest cannot appear equivalent to reviewed custody.
- Missing, stale, or mismatched custody remains a visible blocker.
- The assembly preview becomes truthful about the exact evidence it has.
- The custody signal does not authorize assembly, promotion, QR printing,
  hosted persistence, learner records, or student-facing use.
- A later release workflow still requires separate human approval and all
  existing delivery gates.

## Verification

The focused assembly-preview verifier must confirm the route reads and
summarizes reviewed custody, while the production build and foundation
composition gate must continue to pass.
