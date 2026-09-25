# ADR 1203: Package Readiness Identifiers

## Decision

Package-readiness reconciliation records must validate bounded safe identities
for the reconciliation, tenant, package, release candidate, evidence lanes,
and all referenced review packets and gates.

## Why

Package readiness is the final evidence rollup before a release decision. Its
references cross source lineage, audio, media rights, verifier, publish, and
assignment records, so malformed or path-like identities must fail before a
human decision can be attached to the wrong tenant or package.

## Consequences

- Readiness remains review-only and cannot promote, assign, or activate a
  package.
- Normal tenant and publisher identifiers remain supported.
- The same identity boundary can travel through hosted and closed-local
  deployment evidence.
