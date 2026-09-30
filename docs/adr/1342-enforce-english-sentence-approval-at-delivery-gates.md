# ADR 1342: Enforce English Sentence Approval At Delivery Gates

## Status

Accepted for the first saleable white-label pilot.

## Decision

Require the immutable English sentence-approval sidecar at both package
assembly preflight and delivery release lineage. A record is usable for these
checks only when it is approved and matches the tenant, quarantine, package,
and source checksum being delivered.

## Context

The sentence-approval sidecar correctly appeared in readiness and source
evidence, but the standalone assembly preflight and release lineage could
otherwise rely on adjacent package records without independently checking the
canonical two-sentence contract. Those are the boundaries closest to package
writing and release receipt creation, so they must fail closed.

## Consequences

- A package cannot appear assembly-ready without the exact English sentence
  approval record.
- A delivery release cannot be captured for a package with missing or
  mismatched sentence approval.
- The preflight response exposes only a boolean presence signal and no
  sentence payload.
- Other release, QR, rollback, policy, and deployment gates remain separate;
  sentence approval does not activate any protected action.

## Rejected alternatives

- Trusting the package-readiness projection alone would create a bypass if a
  future caller used the delivery gate directly.
- Treating generic package evidence as sentence approval would erase the
  exact target-language review boundary.
