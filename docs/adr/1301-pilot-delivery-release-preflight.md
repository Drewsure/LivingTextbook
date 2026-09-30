# ADR 1301: Reconcile delivery release identities before operator release

## Decision

The pilot keeps a review-only release preflight that binds the delivery manifest,
release receipt, and QR alias registry preview by tenant, package, version, and
source assembly checksum. The preflight is visible in the release-control
workspace and remains unable to write release state, persist QR aliases, print
production codes, or activate students.

## Rationale

Each release record already has its own validator, but a future operator should
not have to infer that separate records refer to the same package. A single
reconciliation object makes identity drift visible before a release boundary is
implemented or enabled. This preserves the white-label rule that printed aliases
belong to a specific tenant/package/version rather than to a global MiniStar
route.

## Consequences

- A future release workflow must consume this preflight or an equivalent stronger record.
- A review-only QR registry preview is not treated as durable registry evidence.
- Real human approval, rollback evidence, and explicit print authorization remain required before a saleable pilot release.
