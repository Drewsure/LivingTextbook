# ADR 1325: Publisher Submission Package Review Journey

Date: 2026-09-30  
Status: Accepted

## Decision

The publisher intake workspace shows one controlled sample journey from
manifest receipt through canonical evidence reconciliation, quarantine package
review, multimedia/game review, delivery and QR review, and teacher-led
rehearsal. The journey binds tenant, package, manifest, reconciliation,
quarantine, evidence packet, package-review packet, and package-evidence review
identities.

The journey is synthetic sample data only. It is a review trace, not a real
upload, release approval, QR authorization, persistence opt-in, or student
activation. Existing immutable packet and release-control contracts remain the
authorities for future live records.

## Consequences

- A prospective publisher can understand the complete service path in one
  place.
- Open gates are visible without making unsafe assumptions about readiness.
- Local, hosted, and hybrid delivery remain separate downstream decisions.
- The sample cannot be mistaken for publisher-owned content or live learner
  data.

## Verification

`npm run verify:publisher-submission-package-review-journey` validates opaque
quarantine identity, blocked action flags, route/panel boundaries, and sample
journey coverage. The full foundation gate includes this verifier.
