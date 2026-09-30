# DR-1360: Persist Reviewed Local Bundle Manifests

## Decision

Add a durable reviewed local bundle-manifest record bound to exact tenant,
package, version, quarantine, review packet, source preflight evidence,
reviewer, and canonical manifest checksum identities.

## Why

The first saleable white-label pilot needs an operator-visible evidence packet
that survives between review and local package assembly. A one-off client
payload is not sufficient custody evidence.

## Guardrails

The record is immutable metadata only. Its write gate is disabled by default,
and it cannot authorize package assembly, promotion, QR printing, hosted
persistence, learner records, or student-facing activation. The durable-records
package request may reference only an exact reviewed record id.

See ADR 1360.
